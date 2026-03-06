import { describe, expect, it } from 'vitest'

import { flattenDirectoryTree } from '../../../flattenDirectoryTree'
import type { DirectoryNode, FileNode } from '../../types'

function dir(
  path: string,
  name: string,
  files: FileNode[] = [],
  subdirs: DirectoryNode[] = []
): DirectoryNode {
  return { path, name, files, subdirs }
}

function file(path: string, name: string, size = 0, ext = ''): FileNode {
  return { path, name, size, ext }
}

describe('flattenDirectoryTree', () => {
  describe('normal behavior', () => {
    it('returns empty dirs and files when tree has only root with no files and no subdirs', () => {
      const rootPath = '/root'
      const tree = dir(rootPath, 'root', [], [])

      const result = flattenDirectoryTree(rootPath, tree)

      expect(result.dirs).toEqual([])
      expect(result.files).toEqual([])
    })

    it('includes root files with POSIX-style relative paths and excludes root from dirs', () => {
      const rootPath = '/project'
      const tree = dir(
        rootPath,
        'project',
        [file('/project/a.txt', 'a.txt'), file('/project/b.txt', 'b.txt')],
        []
      )

      const result = flattenDirectoryTree(rootPath, tree)

      expect(result.dirs).toEqual([])
      expect(result.files).toEqual(['a.txt', 'b.txt'])
    })

    it('includes subdirs (excluding root) and files at all levels with relative paths', () => {
      const rootPath = '/project'
      const subPath = '/project/sub'
      const tree = dir(
        rootPath,
        'project',
        [file('/project/root.txt', 'root.txt')],
        [dir(subPath, 'sub', [file('/project/sub/nested.txt', 'nested.txt')], [])]
      )

      const result = flattenDirectoryTree(rootPath, tree)

      expect(result.dirs).toEqual(['sub'])
      expect(result.files).toEqual(['root.txt', 'sub/nested.txt'])
    })

    it('sorts dirs and files alphabetically', () => {
      const rootPath = '/x'
      const tree = dir(
        rootPath,
        'x',
        [file('/x/z.txt', 'z.txt'), file('/x/a.txt', 'a.txt')],
        [dir('/x/bb', 'bb', [], []), dir('/x/aa', 'aa', [], [])]
      )

      const result = flattenDirectoryTree(rootPath, tree)

      expect(result.dirs).toEqual(['aa', 'bb'])
      expect(result.files).toEqual(['a.txt', 'z.txt'])
    })

    it('flattens deeply nested structure with multiple subdirs', () => {
      const rootPath = '/r'
      const tree = dir(
        rootPath,
        'r',
        [file('/r/r.txt', 'r.txt')],
        [
          dir(
            '/r/a',
            'a',
            [file('/r/a/a.txt', 'a.txt')],
            [dir('/r/a/b', 'b', [file('/r/a/b/b.txt', 'b.txt')], [])]
          ),
          dir('/r/c', 'c', [file('/r/c/c.txt', 'c.txt')], [])
        ]
      )

      const result = flattenDirectoryTree(rootPath, tree)

      expect(result.dirs).toEqual(['a', 'a/b', 'c'])
      expect(result.files).toEqual(['a/a.txt', 'a/b/b.txt', 'c/c.txt', 'r.txt'])
    })
  })

  describe('path normalization', () => {
    it('normalizes paths to POSIX style (backslash to forward slash)', () => {
      const rootPath = 'C:\\project'
      const tree = dir(
        'C:\\project',
        'project',
        [file('C:\\project\\file.txt', 'file.txt')],
        [dir('C:\\project\\subdir', 'subdir', [], [])]
      )

      const result = flattenDirectoryTree(rootPath, tree)

      expect(result.dirs.every((d) => !d.includes('\\'))).toBe(true)
      expect(result.files.every((f) => !f.includes('\\'))).toBe(true)
      expect(result.dirs).toContain('subdir')
      expect(result.files).toContain('file.txt')
    })
  })

  describe('edge cases', () => {
    it('root dir is excluded from dirs even when root path is resolved differently', () => {
      const rootPath = '/foo/bar'
      const tree = dir('/foo/bar', 'bar', [], [])

      const result = flattenDirectoryTree(rootPath, tree)

      expect(result.dirs).toEqual([])
      expect(result.files).toEqual([])
    })

    it('handles root with only subdirs and no root-level files', () => {
      const rootPath = '/r'
      const tree = dir(
        rootPath,
        'r',
        [],
        [dir('/r/only', 'only', [file('/r/only/f.txt', 'f.txt')], [])]
      )

      const result = flattenDirectoryTree(rootPath, tree)

      expect(result.dirs).toEqual(['only'])
      expect(result.files).toEqual(['only/f.txt'])
    })
  })
})
