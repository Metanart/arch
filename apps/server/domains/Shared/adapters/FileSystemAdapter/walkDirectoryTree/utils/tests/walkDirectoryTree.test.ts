import { mkdir, mkdtemp, rm, writeFile } from 'fs/promises'

import { tmpdir } from 'os'
import { join } from 'path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import type { TWalkOptions } from '../../types'
import {
  DEFAULT_MAX_FILES,
  DEFAULT_MAX_RECURSION_DEPTH,
  walkDirectoryTree
} from '../../walkDirectoryTree'

describe('walkDirectoryTree', () => {
  let tempDir: string

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'walkDirectoryTree-test-'))
  })

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true })
  })

  /** Allow all dirs and all files so tests control structure via options. */
  const allowAllOptions: TWalkOptions = {
    dirPredicate: () => true,
    filePredicate: () => true,
    keyFilePredicate: () => false
  }

  describe('normal behavior', () => {
    it('returns tree with root and empty arrays when directory is empty', async () => {
      const result = await walkDirectoryTree(tempDir, allowAllOptions)

      expect(result.tree.path).toBe(tempDir)
      expect(result.tree.name).toBe(tempDir.split(/[/\\]/).pop())
      expect(result.tree.files).toEqual([])
      expect(result.tree.subdirs).toEqual([])
      expect(result.totalFiles).toBe(0)
      expect(result.keyFiles).toBe(0)
      expect(result.nonKeyFiles).toBe(0)
      expect(result.errors).toEqual([])
    })

    it('includes files at root and sets totalFiles and nonKeyFiles', async () => {
      await writeFile(join(tempDir, 'a.txt'), 'x')
      await writeFile(join(tempDir, 'b.txt'), 'yy')

      const result = await walkDirectoryTree(tempDir, allowAllOptions)

      expect(result.tree.files).toHaveLength(2)
      expect(result.tree.files.map((f) => f.name).sort()).toEqual(['a.txt', 'b.txt'])
      expect(result.tree.files.every((f) => f.path.startsWith(tempDir) && f.size >= 0)).toBe(true)
      expect(result.totalFiles).toBe(2)
      expect(result.keyFiles).toBe(0)
      expect(result.nonKeyFiles).toBe(2)
      expect(result.errors).toEqual([])
    })

    it('includes subdirs recursively and aggregates file counts', async () => {
      await writeFile(join(tempDir, 'root.txt'), '')
      await mkdir(join(tempDir, 'sub'), { recursive: true })
      await writeFile(join(tempDir, 'sub', 'nested.txt'), '')

      const result = await walkDirectoryTree(tempDir, allowAllOptions)

      expect(result.tree.files).toHaveLength(1)
      expect(result.tree.files[0].name).toBe('root.txt')
      expect(result.tree.subdirs).toHaveLength(1)
      expect(result.tree.subdirs[0].name).toBe('sub')
      expect(result.tree.subdirs[0].files).toHaveLength(1)
      expect(result.tree.subdirs[0].files[0].name).toBe('nested.txt')
      expect(result.totalFiles).toBe(2)
      expect(result.nonKeyFiles).toBe(2)
      expect(result.errors).toEqual([])
    })

    it('counts key files when keyFilePredicate returns true', async () => {
      await writeFile(join(tempDir, 'a.zip'), '')
      await writeFile(join(tempDir, 'b.txt'), '')

      const result = await walkDirectoryTree(tempDir, {
        ...allowAllOptions,
        keyFilePredicate: (name) => name.endsWith('.zip')
      })

      expect(result.totalFiles).toBe(2)
      expect(result.keyFiles).toBe(1)
      expect(result.nonKeyFiles).toBe(1)
      expect(result.errors).toEqual([])
    })

    it('returns file nodes with path, name, size, and ext', async () => {
      await writeFile(join(tempDir, 'image.png'), 'content')

      const result = await walkDirectoryTree(tempDir, allowAllOptions)

      expect(result.tree.files).toHaveLength(1)
      expect(result.tree.files[0]).toMatchObject({
        name: 'image.png',
        size: 7,
        ext: 'png'
      })
      expect(result.tree.files[0].path).toBe(join(tempDir, 'image.png'))
    })
  })

  describe('maxDepth', () => {
    it('limits depth to 0 (root only, no subdirs entered)', async () => {
      await writeFile(join(tempDir, 'root.txt'), '')
      await mkdir(join(tempDir, 'child'), { recursive: true })
      await writeFile(join(tempDir, 'child', 'nested.txt'), '')

      const result = await walkDirectoryTree(tempDir, {
        ...allowAllOptions,
        maxDepth: 0
      })

      expect(result.tree.files).toHaveLength(1)
      expect(result.tree.subdirs).toHaveLength(0)
      expect(result.totalFiles).toBe(1)
      expect(result.errors).toEqual([])
    })

    it('limits depth to 1 (root and one level of subdirs)', async () => {
      await writeFile(join(tempDir, 'root.txt'), '')
      await mkdir(join(tempDir, 'child'), { recursive: true })
      await writeFile(join(tempDir, 'child', 'nested.txt'), '')
      await mkdir(join(tempDir, 'child', 'grandchild'), { recursive: true })
      await writeFile(join(tempDir, 'child', 'grandchild', 'deep.txt'), '')

      const result = await walkDirectoryTree(tempDir, {
        ...allowAllOptions,
        maxDepth: 1
      })

      expect(result.tree.files).toHaveLength(1)
      expect(result.tree.subdirs).toHaveLength(1)
      expect(result.tree.subdirs[0].files).toHaveLength(1)
      expect(result.tree.subdirs[0].subdirs).toHaveLength(0)
      expect(result.totalFiles).toBe(2)
      expect(result.errors).toEqual([])
    })
  })

  describe('predicates', () => {
    it('excludes directories when dirPredicate returns false', async () => {
      await mkdir(join(tempDir, 'skip'), { recursive: true })
      await writeFile(join(tempDir, 'skip', 'file.txt'), '')
      await mkdir(join(tempDir, 'keep'), { recursive: true })
      await writeFile(join(tempDir, 'keep', 'file.txt'), '')

      const result = await walkDirectoryTree(tempDir, {
        ...allowAllOptions,
        dirPredicate: (name) => name === 'keep'
      })

      expect(result.tree.subdirs).toHaveLength(1)
      expect(result.tree.subdirs[0].name).toBe('keep')
      expect(result.totalFiles).toBe(1)
      expect(result.errors).toEqual([])
    })

    it('excludes files when filePredicate returns false', async () => {
      await writeFile(join(tempDir, 'include.txt'), '')
      await writeFile(join(tempDir, 'exclude.log'), '')

      const result = await walkDirectoryTree(tempDir, {
        ...allowAllOptions,
        filePredicate: (name) => !name.endsWith('.log')
      })

      expect(result.tree.files).toHaveLength(1)
      expect(result.tree.files[0].name).toBe('include.txt')
      expect(result.totalFiles).toBe(1)
      expect(result.errors).toEqual([])
    })
  })

  describe('limits', () => {
    it('stops and records error when maxFiles is exceeded', async () => {
      await mkdir(join(tempDir, 'd1'), { recursive: true })
      await writeFile(join(tempDir, 'd1', 'a.txt'), '')
      await writeFile(join(tempDir, 'd1', 'b.txt'), '')
      await mkdir(join(tempDir, 'd2'), { recursive: true })
      await writeFile(join(tempDir, 'd2', 'c.txt'), '')

      const result = await walkDirectoryTree(tempDir, {
        ...allowAllOptions,
        maxFiles: 2
      })

      expect(
        result.errors.some((e) => e.includes('File limit exceeded') && e.includes('(2)'))
      ).toBe(true)
      expect(result.totalFiles).toBeGreaterThanOrEqual(2)
    })

    it('records error when maxRecursionDepth is exceeded', async () => {
      await mkdir(join(tempDir, 'd1'), { recursive: true })
      await mkdir(join(tempDir, 'd1', 'd2'), { recursive: true })
      await mkdir(join(tempDir, 'd1', 'd2', 'd3'), { recursive: true })
      await writeFile(join(tempDir, 'd1', 'd2', 'd3', 'file.txt'), '')

      const result = await walkDirectoryTree(tempDir, {
        ...allowAllOptions,
        maxRecursionDepth: 1
      })

      expect(result.errors.some((e) => e.includes('Maximum recursion depth exceeded'))).toBe(true)
      expect(result.totalFiles).toBe(0)
    })

    it('uses DEFAULT_MAX_FILES and DEFAULT_MAX_RECURSION_DEPTH when options omitted', async () => {
      const result = await walkDirectoryTree(tempDir)

      expect(result.tree).toBeDefined()
      expect(result.errors).toEqual([])
      expect(DEFAULT_MAX_FILES).toBe(100_000)
      expect(DEFAULT_MAX_RECURSION_DEPTH).toBe(1000)
    })
  })

  describe('error handling', () => {
    it('returns stub tree and records error when root does not exist', async () => {
      const nonExistent = join(tempDir, 'does-not-exist')

      const result = await walkDirectoryTree(nonExistent, allowAllOptions)

      expect(result.errors).toHaveLength(1)
      expect(result.errors[0]).toMatch(/Failed to read directory|Critical error/)
      expect(result.tree.path).toBe(nonExistent)
      expect(result.tree.files).toEqual([])
      expect(result.tree.subdirs).toEqual([])
      expect(result.totalFiles).toBe(0)
      expect(result.keyFiles).toBe(0)
      expect(result.nonKeyFiles).toBe(0)
    })

    it('collects non-fatal errors and continues walk', async () => {
      await mkdir(join(tempDir, 'good'), { recursive: true })
      await writeFile(join(tempDir, 'good', 'file.txt'), '')
      await mkdir(join(tempDir, 'throw'), { recursive: true })
      await writeFile(join(tempDir, 'throw', 'file.txt'), '')
      await mkdir(join(tempDir, 'readable'), { recursive: true })
      await writeFile(join(tempDir, 'readable', 'file.txt'), '')

      const result = await walkDirectoryTree(tempDir, {
        ...allowAllOptions,
        dirPredicate: (name) => {
          if (name === 'throw') throw new Error('Intentional predicate error')
          return true
        }
      })

      expect(result.tree.subdirs.some((d) => d.name === 'good')).toBe(true)
      expect(result.tree.subdirs.some((d) => d.name === 'readable')).toBe(true)
      expect(result.errors.some((e) => e.includes('Intentional predicate error'))).toBe(true)
      expect(result.totalFiles).toBe(2)
    })
  })

  describe('edge cases', () => {
    it('computes nonKeyFiles as totalFiles minus keyFiles', async () => {
      await writeFile(join(tempDir, 'a.zip'), '')
      await writeFile(join(tempDir, 'b.zip'), '')
      await writeFile(join(tempDir, 'c.txt'), '')

      const result = await walkDirectoryTree(tempDir, {
        ...allowAllOptions,
        keyFilePredicate: (name) => name.endsWith('.zip')
      })

      expect(result.totalFiles).toBe(3)
      expect(result.keyFiles).toBe(2)
      expect(result.nonKeyFiles).toBe(result.totalFiles - result.keyFiles)
    })

    it('returns empty errors array when no errors occur', async () => {
      await writeFile(join(tempDir, 'only.txt'), '')

      const result = await walkDirectoryTree(tempDir, allowAllOptions)

      expect(Array.isArray(result.errors)).toBe(true)
      expect(result.errors).toEqual([])
    })
  })
})
