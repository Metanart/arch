import { relative, resolve } from 'node:path'

import type { TDirectoryNode } from './walkDirectoryTree/types'

/**
 * Converts a directory tree into flat lists of relative paths (POSIX-style, "/" separators).
 * Excludes the root node from dirs so the result represents contents under rootDir.
 */
export function flattenDirectoryTree(
  rootDir: string,
  tree: TDirectoryNode
): { dirs: string[]; files: string[] } {
  const dirs: string[] = []
  const files: string[] = []
  const rootResolved = resolve(rootDir)

  function visit(node: TDirectoryNode): void {
    if (resolve(node.path) !== rootResolved) {
      dirs.push(relative(rootDir, node.path).replace(/\\/g, '/'))
    }
    for (const f of node.files) {
      files.push(relative(rootDir, f.path).replace(/\\/g, '/'))
    }
    for (const sub of node.subdirs) {
      visit(sub)
    }
  }

  visit(tree)

  dirs.sort()
  files.sort()

  return { dirs, files }
}
