import type { Dirent, Stats } from 'node:fs'
import { createWriteStream } from 'node:fs'
import { mkdir, readdir, stat, unlink } from 'node:fs/promises'
import { dirname, join, posix as pathPosix } from 'node:path'

import { AppContext } from '@arch/types'
import { AppError } from '@arch/utils'

import * as yazl from 'yazl'

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
  const ignoreSymlinks = options.ignoreSymlinks ?? true

  if (options.signal?.aborted)
    throw new AppError<ZipServiceErrorCode, { inputDirectory: string; outputZipPath: string }>({
      ...appContext,
      code: 'ZIP_ARCHIVE_FAILED',
      message: 'ZIP archive failed',
      cause: new Error('Failed to archive directory'),
      details: { inputDirectory, outputZipPath }
    })

  await mkdir(dirname(outputZipPath), { recursive: true })

  // Collect a list of directories and files (relative paths), lexicographically
  const { dirs, files } = await collectEntries(inputDirectory, {
    ignoreSymlinks,
    filter: options.filter
  })
  dirs.sort()
  files.sort()

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
      // compress: true -> deflate, false -> store
      zip.addFile(absPath, entryName, {
        mtime: fixedMtime,
        mode: s.mode,
        compress: compression === 'deflate'
      })
    }

    zip.end()
    await completion
  } catch (err) {
    // If we fail, try to delete the partially created archive
    try {
      await unlink(outputZipPath)
    } catch {
      // ignore
    }
    throw err
  } finally {
    options.signal?.removeEventListener('abort', abortHandler)
  }
}

/** Recursive collection of relative paths of directories and files */
// @TODO: use FileSystemService.walkDirectoryTree instead
async function collectEntries(
  rootDir: string,
  opts: { ignoreSymlinks: boolean; filter?: (rel: string, s: Stats) => boolean }
): Promise<{ dirs: string[]; files: string[] }> {
  const dirs: string[] = []
  const files: string[] = []

  async function walk(currentRel: string): Promise<void> {
    const currentAbs = join(rootDir, currentRel)
    const dirents: Dirent[] = await readdir(currentAbs, { withFileTypes: true })

    // If there are no elements and this is not the root — save an empty directory
    if (dirents.length === 0 && currentRel !== '') {
      dirs.push(currentRel)
      return
    }

    // First directories (to save them even if they are empty)
    for (const d of dirents.filter((d) => d.isDirectory())) {
      const rel = pathJoinRel(currentRel, d.name)
      // Save the directory, even if it is not empty (for compatibility with some unpackers)
      dirs.push(rel)
      await walk(rel)
    }

    // Files
    for (const f of dirents.filter((d) => d.isFile() || d.isSymbolicLink())) {
      if (f.isSymbolicLink() && opts.ignoreSymlinks) continue
      const rel = pathJoinRel(currentRel, f.name)
      const s = await stat(join(rootDir, rel))
      if (opts.filter && !opts.filter(rel, s)) continue
      files.push(rel)
    }
  }

  await walk('')
  return { dirs, files }
}

/** Normalize the path for ZIP: always "/" and add "/" for directories */
function toZipEntryName(relPath: string, isDir: boolean): string {
  const normalized = pathPosix.normalize(relPath).replace(/^\.?\//, '')
  return isDir ? (normalized.endsWith('/') ? normalized : normalized + '/') : normalized
}

/** POSIX join for relative paths (independent of OS) */
function pathJoinRel(baseRel: string, name: string): string {
  return baseRel ? pathPosix.join(baseRel.replace(/\\/g, '/'), name) : name
}
