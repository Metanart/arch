import type { Stats, WriteStream } from 'node:fs'
import { createWriteStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { dirname, join, posix as pathPosix } from 'node:path'
import * as yazl from 'yazl'

import { TAppContext } from '@arch/types'
import { AppError, createLogger } from '@arch/utils'

import { FileSystemAdapter } from '../FileSystemAdapter/FileSystemAdapter'

import { TZipServiceErrorCode } from './types'

type TArchiveOptions = {
  /** 'deflate' (default) or 'store' (no compression) */
  compression?: 'deflate' | 'store'
  /** Fixed mtime for deterministic ZIP (default 2000-01-01) */
  mtime?: Date
  /** Skip/include files by your own rule */
  filter?: (relativePath: string, stats: Stats) => boolean
  /** Abort operation */
  signal?: AbortSignal
}

const appContext: TAppContext = {
  domain: 'Global',
  layer: 'FileSystem',
  origin: 'ZipService.archive'
}

const logger = createLogger(appContext)

/**
 * Archives a directory entirely in ZIP using yazl.
 * Saves empty directories, normalizes paths ("/") and can be deterministic.
 */
export async function archive(
  inputDirectory: string,
  outputZipPath: string,
  options: TArchiveOptions = {}
): Promise<void> {
  const compression = options.compression ?? 'deflate'
  const fixedMtime = options.mtime ?? new Date('2000-01-01T00:00:00Z')

  if (options.signal?.aborted)
    throw new AppError<TZipServiceErrorCode, { inputDirectory: string; outputZipPath: string }>({
      ...appContext,
      code: 'ZIP_ARCHIVE_FAILED',
      message: 'ZIP archive failed',
      cause: new Error('Failed to archive directory'),
      details: { inputDirectory, outputZipPath }
    })

  const outputDirCreated = await FileSystemAdapter.createDir(dirname(outputZipPath), true)
  if (!outputDirCreated) {
    throw new AppError<TZipServiceErrorCode, { inputDirectory: string; outputZipPath: string }>({
      ...appContext,
      code: 'ZIP_ARCHIVE_FAILED',
      message: 'ZIP archive failed',
      cause: new Error('Failed to create output directory for archive'),
      details: { inputDirectory, outputZipPath }
    })
  }

  // Abort listener attached before the walk so the whole operation (including walk) can be cancelled.
  let zip: yazl.ZipFile | undefined
  let out: WriteStream | undefined
  let abortReject: (reason: Error) => void
  const abortPromise = new Promise<never>((_, rej) => {
    abortReject = rej
  })

  const abortHandler = (): void => {
    abortReject(
      new AppError<TZipServiceErrorCode, { inputDirectory: string; outputZipPath: string }>({
        ...appContext,
        code: 'ZIP_ARCHIVE_FAILED',
        message: 'ZIP archive failed',
        cause: new Error('Aborted'),
        details: { inputDirectory, outputZipPath }
      })
    )
    try {
      if (out) out.destroy(new Error('Aborted'))
      if (zip) zip.end()
    } catch (e) {
      // Do not rethrow: avoid double-handling when the main flow also fails.
      logger.warn('Abort cleanup failed', e instanceof Error ? e.message : String(e))
    }
  }
  options.signal?.addEventListener('abort', abortHandler, { once: true })

  try {
    // Collect directories and files via FileSystemAdapter.walkDirectoryTree (depth/cycle limits, consistent errors).
    // Symlinks are ignored on purpose for now — walkDirectoryTree does not follow or include them.
    const { dirs, files } = await Promise.race([
      collectEntriesFromWalk(inputDirectory),
      abortPromise
    ])

    zip = new yazl.ZipFile()
    out = createWriteStream(outputZipPath)

    const completion = new Promise<void>((resolve, reject) => {
      out!.once('error', reject)
      zip!.outputStream.once('error', reject)
      out!.once('close', () => resolve())
    })

    zip.outputStream.pipe(out)

    // Empty directories — to be saved in the archive
    for (const d of dirs) {
      const entryName = toZipEntryName(d, true)
      zip!.addEmptyDirectory(entryName, { mtime: fixedMtime })
    }

    // Files
    for (const f of files) {
      const entryName = toZipEntryName(f, false)
      const absPath = join(inputDirectory, f)
      const s = await stat(absPath)
      if (options.filter && !options.filter(f, s)) continue
      zip!.addFile(absPath, entryName, {
        mtime: fixedMtime,
        mode: s.mode,
        compress: compression === 'deflate'
      })
    }

    zip.end()
    await completion
  } catch (error) {
    // Best-effort cleanup of partially created archive
    await FileSystemAdapter.deleteFile(outputZipPath)

    if (error instanceof AppError) {
      throw error
    }

    throw new AppError<TZipServiceErrorCode, { inputDirectory: string; outputZipPath: string }>({
      ...appContext,
      code: 'ZIP_ARCHIVE_FAILED',
      message: 'ZIP archive failed',
      cause: error,
      details: { inputDirectory, outputZipPath }
    })
  } finally {
    options.signal?.removeEventListener('abort', abortHandler)
  }
}

/**
 * Collects relative paths of directories and files using FileSystemAdapter.walkDirectoryTree.
 * Uses accept-all predicates so the archive can apply its own filter when adding files.
 */
async function collectEntriesFromWalk(rootDir: string): Promise<{
  dirs: string[]
  files: string[]
}> {
  const result = await FileSystemAdapter.walkDirectoryTree(rootDir, {
    dirPredicate: () => true,
    filePredicate: () => true,
    keyFilePredicate: () => false
  })

  if (result.errors.length > 0) {
    const allErrors = result.errors.join('; ')
    throw new AppError<TZipServiceErrorCode, { inputDirectory: string; walkErrors: string[] }>({
      ...appContext,
      code: 'ZIP_ARCHIVE_FAILED',
      message: 'ZIP archive failed',
      cause: new Error(allErrors),
      details: { inputDirectory: rootDir, walkErrors: result.errors }
    })
  }

  return FileSystemAdapter.flattenDirectoryTree(rootDir, result.tree)
}

/** Normalize the path for ZIP: always "/" and add "/" for directories */
function toZipEntryName(relPath: string, isDir: boolean): string {
  const normalized = pathPosix.normalize(relPath).replace(/^\.?\//, '')
  return isDir ? (normalized.endsWith('/') ? normalized : normalized + '/') : normalized
}
