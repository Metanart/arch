import { readdir, stat } from 'node:fs/promises'
import { basename, join } from 'node:path'

import { getMessageFromError } from '@arch/utils'

import { safeGetFileExtension } from './utils/safeGetFileExtension'
import { defaultDirPredicate, defaultFilePredicate, defaultKeyFilePredicate } from './defaults'

import { TDirectoryNode, TDirectoryTree, TFileNode, TWalkOptions } from './types'

/** Default max number of files to traverse; prevents memory overflow. */
export const DEFAULT_MAX_FILES = 100_000

/** Default max recursion depth; prevents stack overflow. */
export const DEFAULT_MAX_RECURSION_DEPTH = 1000

/**
 * Recursively walks a directory and builds a tree of included files and subdirs.
 *
 * Non-fatal issues (e.g. unreadable entries, stat failures, limits exceeded) are
 * collected in the returned `errors` array; the walk continues where possible.
 *
 * When `maxFiles` is exceeded, the walk stops but `totalFiles` in the result
 * may be greater than `maxFiles` (by up to one subtree), since the limit is
 * checked after processing each directory.
 *
 * Symlinks are not followed; entries that are neither directory nor file are skipped.
 *
 * @param root - Absolute or relative path to the directory to walk
 * @param options - Optional depth limit, predicates, and safety limits
 * @returns Tree, file counts, and any non-fatal errors encountered
 */
export async function walkDirectoryTree(
  root: string,
  options: TWalkOptions = {}
): Promise<TDirectoryTree> {
  const {
    maxDepth,
    dirPredicate = defaultDirPredicate,
    filePredicate = defaultFilePredicate,
    keyFilePredicate = defaultKeyFilePredicate,
    maxFiles = DEFAULT_MAX_FILES,
    maxRecursionDepth = DEFAULT_MAX_RECURSION_DEPTH
  } = options

  const errors: string[] = []
  const visitedPaths = new Set<string>() // Protection against circular references

  try {
    const { tree, totalFiles, keyFiles } = await walkInternal(
      root,
      0,
      visitedPaths,
      errors,
      maxFiles,
      maxRecursionDepth
    )
    return { tree, totalFiles, keyFiles, nonKeyFiles: totalFiles - keyFiles, errors }
  } catch (error) {
    errors.push(`Critical error in walkDirectoryTree: ${getMessageFromError(error)}`)
    return {
      tree: { path: root, name: basename(root), files: [], subdirs: [] },
      totalFiles: 0,
      keyFiles: 0,
      nonKeyFiles: 0,
      errors
    }
  }

  async function walkInternal(
    currentDir: string,
    depth: number,
    visitedPaths: Set<string>,
    errors: string[],
    maxFiles: number,
    maxRecursionDepth: number
  ): Promise<{ tree: TDirectoryNode; totalFiles: number; keyFiles: number }> {
    // Protection against stack overflow
    if (depth > maxRecursionDepth) {
      errors.push(`Maximum recursion depth exceeded at: ${currentDir}`)
      return {
        tree: { path: currentDir, name: basename(currentDir), files: [], subdirs: [] },
        totalFiles: 0,
        keyFiles: 0
      }
    }

    // Protection against circular references
    if (visitedPaths.has(currentDir)) {
      errors.push(`Circular reference detected at: ${currentDir}`)
      return {
        tree: { path: currentDir, name: basename(currentDir), files: [], subdirs: [] },
        totalFiles: 0,
        keyFiles: 0
      }
    }

    visitedPaths.add(currentDir)

    try {
      const entries = await readdir(currentDir, { withFileTypes: true })
      const files: TFileNode[] = []
      const subdirs: TDirectoryNode[] = []

      let total = 0
      let key = 0

      for (const entry of entries) {
        try {
          const fullPath = join(currentDir, entry.name)

          if (entry.isDirectory()) {
            if (maxDepth != null && depth >= maxDepth) continue
            if (!dirPredicate(entry.name)) continue

            const child = await walkInternal(
              fullPath,
              depth + 1,
              visitedPaths,
              errors,
              maxFiles,
              maxRecursionDepth
            )
            subdirs.push(child.tree)
            total += child.totalFiles
            key += child.keyFiles

            // Check file limit
            if (total > maxFiles) {
              errors.push(`File limit exceeded (${maxFiles}) at: ${currentDir}`)
              break
            }
          } else if (entry.isFile()) {
            try {
              const s = await stat(fullPath)
              if (!filePredicate(entry.name, s.size)) continue

              const ext = safeGetFileExtension(entry.name)
              files.push({
                path: fullPath,
                name: entry.name,
                size: s.size,
                ext
              })

              total += 1
              if (keyFilePredicate(entry.name, s.size)) key += 1
            } catch (statError) {
              errors.push(`Failed to stat file ${fullPath}: ${getMessageFromError(statError)}`)
              continue
            }
          }
          // @TODO: handle symlinks if needed
        } catch (entryError) {
          errors.push(
            `Error processing entry ${entry.name} in ${currentDir}: ${getMessageFromError(entryError)}`
          )
          continue
        }
      }

      return {
        tree: {
          path: currentDir,
          name: basename(currentDir),
          files,
          subdirs
        },
        totalFiles: total,
        keyFiles: key
      }
    } catch (readdirError) {
      errors.push(`Failed to read directory ${currentDir}: ${getMessageFromError(readdirError)}`)
      return {
        tree: { path: currentDir, name: basename(currentDir), files: [], subdirs: [] },
        totalFiles: 0,
        keyFiles: 0
      }
    } finally {
      visitedPaths.delete(currentDir)
    }
  }
}
