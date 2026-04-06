import { mkdir, mkdtemp, readdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { AppError } from '@arch/utils'

import { FileSystemAdapter } from '../../FileSystemAdapter/FileSystemAdapter'
import { archive } from '../archive'
import { extract } from '../extract'
import { listContents } from '../listContents'

vi.mock('../../FileSystemAdapter/FileSystemAdapter', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../FileSystemAdapter/FileSystemAdapter')>()
  return {
    FileSystemAdapter: {
      ...actual.FileSystemAdapter,
      walkDirectoryTree: vi.fn(actual.FileSystemAdapter.walkDirectoryTree)
    }
  }
})

describe('archive', () => {
  let tempDir: string
  let inputDir: string
  let outputZipPath: string

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'archive-test-'))
    inputDir = join(tempDir, 'input')
    outputZipPath = join(tempDir, 'out', 'archive.zip')
    await mkdir(inputDir, { recursive: true })
  })

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true })
  })

  describe('normal behavior', () => {
    it('creates a zip file containing all files and preserves paths', async () => {
      await writeFile(join(inputDir, 'a.txt'), 'content a')
      await mkdir(join(inputDir, 'sub'), { recursive: true })
      await writeFile(join(inputDir, 'sub', 'b.txt'), 'content b')

      await archive(inputDir, outputZipPath)

      const entries = await listContents(outputZipPath)
      expect(entries.sort()).toEqual(['a.txt', 'sub/b.txt'])
    })

    it('round-trip: archive then extract produces same file contents', async () => {
      const content = 'hello world'
      await writeFile(join(inputDir, 'file.txt'), content)

      await archive(inputDir, outputZipPath)

      const extractDir = join(tempDir, 'extracted')
      await extract(outputZipPath, extractDir)

      const { readFile } = await import('node:fs/promises')
      const extractedContent = await readFile(join(extractDir, 'file.txt'), {
        encoding: 'utf-8'
      })
      expect(extractedContent).toBe(content)
    })

    it('archives empty directory and produces a zip with no files', async () => {
      await archive(inputDir, outputZipPath)

      const entries = await listContents(outputZipPath)
      expect(entries).toEqual([])
    })

    it('accepts custom mtime and compression options without throwing', async () => {
      await writeFile(join(inputDir, 'x.txt'), 'x')

      await expect(
        archive(inputDir, outputZipPath, {
          mtime: new Date('2020-06-15T12:00:00Z'),
          compression: 'store'
        })
      ).resolves.toBeUndefined()

      const entries = await listContents(outputZipPath)
      expect(entries).toEqual(['x.txt'])
    })
  })

  describe('edge cases', () => {
    it('applies filter and only includes matching files', async () => {
      await writeFile(join(inputDir, 'keep.txt'), '')
      await writeFile(join(inputDir, 'skip.log'), '')

      await archive(inputDir, outputZipPath, {
        filter: (relativePath) => relativePath.endsWith('.txt')
      })

      const entries = await listContents(outputZipPath)
      expect(entries).toEqual(['keep.txt'])
    })

    it('filter receives stats and can filter by size', async () => {
      await writeFile(join(inputDir, 'small.txt'), 'x')
      await writeFile(join(inputDir, 'large.txt'), 'large content here')

      await archive(inputDir, outputZipPath, {
        filter: (_path, stats) => stats.size <= 5
      })

      const entries = await listContents(outputZipPath)
      expect(entries).toEqual(['small.txt'])
    })

    it('includes empty subdirectories and extract recreates them', async () => {
      await mkdir(join(inputDir, 'emptySub'), { recursive: true })
      await writeFile(join(inputDir, 'root.txt'), 'r')

      await archive(inputDir, outputZipPath)

      const extractDir = join(tempDir, 'extracted')
      await extract(outputZipPath, extractDir)

      const entries = await listContents(outputZipPath)
      expect(entries.sort()).toEqual(['root.txt'])
      const extractedDirs = await readdir(extractDir, { withFileTypes: true })
      const subDir = extractedDirs.find((d) => d.isDirectory() && d.name === 'emptySub')
      expect(subDir).toBeDefined()
    })
  })

  describe('error handling', () => {
    it('throws AppError with ZIP_ARCHIVE_FAILED when signal is already aborted', async () => {
      const controller = new AbortController()
      controller.abort()

      await expect(
        archive(inputDir, outputZipPath, { signal: controller.signal })
      ).rejects.toMatchObject({
        name: 'AppError',
        code: 'ZIP_ARCHIVE_FAILED',
        details: { inputDirectory: inputDir, outputZipPath }
      })
    })

    it('throws AppError when output directory cannot be created (path under a file)', async () => {
      const filePath = join(tempDir, 'blocker')
      await writeFile(filePath, '')
      const zipUnderFile = join(filePath, 'sub', 'archive.zip')

      await expect(archive(inputDir, zipUnderFile)).rejects.toMatchObject({
        name: 'AppError',
        code: 'ZIP_ARCHIVE_FAILED',
        details: { inputDirectory: inputDir, outputZipPath: zipUnderFile }
      })
    })

    it('throws AppError with walkErrors in details when walk returns errors', async () => {
      const walkErrors = ['permission denied', 'max depth exceeded']
      vi.mocked(FileSystemAdapter.walkDirectoryTree).mockResolvedValueOnce({
        tree: {
          path: inputDir,
          name: 'input',
          files: [],
          subdirs: []
        },
        totalFiles: 0,
        keyFiles: 0,
        nonKeyFiles: 0,
        errors: walkErrors
      })

      const err = await archive(inputDir, outputZipPath).then(
        () => null,
        (e: unknown) => e
      )

      expect(err).toBeInstanceOf(AppError)
      expect(err).toMatchObject({
        name: 'AppError',
        code: 'ZIP_ARCHIVE_FAILED',
        details: { inputDirectory: inputDir, walkErrors }
      })
      const causeMessage =
        err instanceof AppError && err.cause instanceof Error ? err.cause.message : ''
      expect(causeMessage).toContain('permission denied')
      expect(causeMessage).toContain('max depth exceeded')
    })

    it('throws AppError with ZIP_ARCHIVE_FAILED when input directory does not exist', async () => {
      const nonExistentDir = join(tempDir, 'does-not-exist')

      await expect(archive(nonExistentDir, outputZipPath)).rejects.toMatchObject({
        name: 'AppError',
        code: 'ZIP_ARCHIVE_FAILED',
        details: { inputDirectory: nonExistentDir }
      })
    })
  })
})
