import { readdir, stat } from 'node:fs/promises'
import { basename, join } from 'node:path'

import { getMessageFromError } from '@arch/utils'

import { safeGetFileExtension } from './utils/safeGetFileExtension'
import { defaultDirPredicate, defaultFilePredicate, defaultKeyFilePredicate } from './defaults'

import { DirectoryNode, DirectoryTree, FileNode, WalkOptions } from './types'

export async function walkDirectoryTree(
  root: string,
  options: WalkOptions = {}
): Promise<DirectoryTree> {
  const {
    maxDepth,
    dirPredicate = defaultDirPredicate,
    filePredicate = defaultFilePredicate,
    keyFilePredicate = defaultKeyFilePredicate,
    maxFiles = 100000, // Reasonable default limit
    maxRecursionDepth = 1000 // Protection against stack overflow
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
  ): Promise<{ tree: DirectoryNode; totalFiles: number; keyFiles: number }> {
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
      const files: FileNode[] = []
      const subdirs: DirectoryNode[] = []

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
