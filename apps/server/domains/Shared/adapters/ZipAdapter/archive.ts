import type { Stats } from 'node:fs'
import { createWriteStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { dirname, join, posix as pathPosix } from 'node:path'

import { AppContext } from '@arch/types'
import { AppError } from '@arch/utils'

import * as yazl from 'yazl'

import { FileSystemAdapter } from '../FileSystemAdapter/FileSystemAdapter'

import { ZipServiceErrorCode } from './types'

type ArchiveOptions = {
  /** 'deflate' (default) or 'store' (no compression) */
  compression?: 'deflate' | 'store'
  /** Fixed mtime for deterministic ZIP (default 2000-01-01) */
  mtime?: Date
  /** Skip/include files by your own rule */
  filter?: (relativePath: string, stats: Stats) => boolean
  /** Ignore symbolic links (default true) */
  ignoreSymlinks?: boolean
  /** Abort operation */
  signal?: AbortSignal
}

const appContext: AppContext = {
  domain: 'Global',
  layer: 'FileSystem',
  origin: 'ZipService.archive'
}

/**
 * Archives a directory entirely in ZIP using yazl.
 * Saves empty directories, normalizes paths ("/") and can be deterministic.
 */
export async function archive(
  inputDirectory: string,
  outputZipPath: string,
  options: ArchiveOptions = {}
): Promise<void> {
  const compression = options.compression ?? 'deflate'
  const fixedMtime = options.mtime ?? new Date('2000-01-01T00:00:00Z')

  if (options.signal?.aborted)
    throw new AppError<ZipServiceErrorCode, { inputDirectory: string; outputZipPath: string }>({
      ...appContext,
      code: 'ZIP_ARCHIVE_FAILED',
      message: 'ZIP archive failed',
      cause: new Error('Failed to archive directory'),
      details: { inputDirectory, outputZipPath }
    })

  const outputDirCreated = await FileSystemAdapter.createDir(dirname(outputZipPath), true)
  if (!outputDirCreated) {
    throw new AppError<ZipServiceErrorCode, { inputDirectory: string; outputZipPath: string }>({
      ...appContext,
      code: 'ZIP_ARCHIVE_FAILED',
      message: 'ZIP archive failed',
      cause: new Error('Failed to create output directory for archive'),
      details: { inputDirectory, outputZipPath }
    })
  }

  // Collect directories and files via FileSystemAdapter.walkDirectoryTree (depth/cycle limits, consistent errors).
  // Symlinks are ignored on purpose for now — walkDirectoryTree does not follow or include them.
  const { dirs, files } = await collectEntriesFromWalk(inputDirectory)

  const zip = new yazl.ZipFile()
  const out = createWriteStream(outputZipPath)

  const abortHandler = (): void => {
    try {
      out.destroy(new Error('Aborted'))
      // Close the zip (end() is idempotent); file will be deleted in finally if we abort
      zip.end()
    } catch {
      // ignore
    }
  }
  options.signal?.addEventListener('abort', abortHandler, { once: true })

  const completion = new Promise<void>((resolve, reject) => {
    out.once('error', reject)
    zip.outputStream.once('error', reject)
    out.once('close', () => resolve())
  })

  // Start the pipeline
  zip.outputStream.pipe(out)

  try {
    // Empty directories — to be saved in the archive
    for (const d of dirs) {
      const entryName = toZipEntryName(d, true)
      zip.addEmptyDirectory(entryName, { mtime: fixedMtime })
    }

    // Files
    for (const f of files) {
      const entryName = toZipEntryName(f, false)
      const absPath = join(inputDirectory, f)
      const s = await stat(absPath)
      if (options.filter && !options.filter(f, s)) continue
      zip.addFile(absPath, entryName, {
        mtime: fixedMtime,
        mode: s.mode,
        compress: compression === 'deflate'
      })
    }

    zip.end()
    await completion
  } catch (err) {
    // Best-effort cleanup of partially created archive
    await FileSystemAdapter.deleteFile(outputZipPath)
    throw err
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
    throw new AppError<ZipServiceErrorCode, { inputDirectory: string }>({
      ...appContext,
      code: 'ZIP_ARCHIVE_FAILED',
      message: 'ZIP archive failed',
      cause: new Error(result.errors[0]),
      details: { inputDirectory: rootDir }
    })
  }

  return FileSystemAdapter.flattenDirectoryTree(rootDir, result.tree)
}

/** Normalize the path for ZIP: always "/" and add "/" for directories */
function toZipEntryName(relPath: string, isDir: boolean): string {
  const normalized = pathPosix.normalize(relPath).replace(/^\.?\//, '')
  return isDir ? (normalized.endsWith('/') ? normalized : normalized + '/') : normalized
}
