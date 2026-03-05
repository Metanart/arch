import { mkdtemp, readFile, rm, stat, writeFile } from 'fs/promises'

import { tmpdir } from 'os'
import { join } from 'path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { FileSystemAdapter } from '../FileSystemAdapter'

const renameReject = { current: null as { code: string } | null }
const copyFileReject = { current: null as Error | null }

vi.mock('fs/promises', async (importOriginal) => {
  const actual = await importOriginal<typeof import('fs/promises')>()
  return {
    ...actual,
    rename: (...args: Parameters<typeof actual.rename>): ReturnType<typeof actual.rename> =>
      renameReject.current ? Promise.reject(renameReject.current) : actual.rename(...args),
    copyFile: (...args: Parameters<typeof actual.copyFile>): ReturnType<typeof actual.copyFile> =>
      copyFileReject.current ? Promise.reject(copyFileReject.current) : actual.copyFile(...args)
  }
})

describe('FileSystemAdapter.moveFile', () => {
  let tempDir: string

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'moveFile-test-'))
  })

  afterEach(async () => {
    renameReject.current = null
    copyFileReject.current = null
    await rm(tempDir, { recursive: true, force: true })
  })

  describe('normal behavior', () => {
    it('moves file to destination and returns true', async () => {
      const source = join(tempDir, 'source.txt')
      const destination = join(tempDir, 'dest.txt')
      await writeFile(source, 'content')

      const result = await FileSystemAdapter.moveFile(source, destination)

      expect(result).toBe(true)
      await expect(stat(source)).rejects.toThrow()
      const stats = await stat(destination)
      expect(stats.isFile()).toBe(true)
      const content = await readFile(destination, 'utf-8')
      expect(content).toBe('content')
    })

    it('moves file into an existing subdirectory', async () => {
      const source = join(tempDir, 'file.txt')
      const destDir = join(tempDir, 'subdir')
      const destination = join(destDir, 'file.txt')
      await FileSystemAdapter.createDir(destDir)
      await writeFile(source, 'data')

      const result = await FileSystemAdapter.moveFile(source, destination)

      expect(result).toBe(true)
      await expect(stat(source)).rejects.toThrow()
      const content = await readFile(destination, 'utf-8')
      expect(content).toBe('data')
    })

    it('overwrites destination when it already exists', async () => {
      const source = join(tempDir, 'new.txt')
      const destination = join(tempDir, 'existing.txt')
      await writeFile(source, 'new content')
      await writeFile(destination, 'old content')

      const result = await FileSystemAdapter.moveFile(source, destination)

      expect(result).toBe(true)
      await expect(stat(source)).rejects.toThrow()
      const content = await readFile(destination, 'utf-8')
      expect(content).toBe('new content')
    })
  })

  describe('EXDEV fallback', () => {
    it('uses copy+delete when rename throws EXDEV and returns true', async () => {
      const source = join(tempDir, 'source.txt')
      const destination = join(tempDir, 'dest.txt')
      await writeFile(source, 'cross-device content')

      renameReject.current = { code: 'EXDEV' }

      const result = await FileSystemAdapter.moveFile(source, destination)

      expect(result).toBe(true)
      await expect(stat(source)).rejects.toThrow()
      const content = await readFile(destination, 'utf-8')
      expect(content).toBe('cross-device content')
    })
  })

  describe('error handling', () => {
    it('throws AppError with FILE_MOVE_FAILED when source does not exist', async () => {
      const source = join(tempDir, 'missing.txt')
      const destination = join(tempDir, 'dest.txt')

      await expect(FileSystemAdapter.moveFile(source, destination)).rejects.toMatchObject({
        kind: 'AppError',
        code: 'FILE_MOVE_FAILED',
        details: { source, destination }
      })
    })

    it('throws AppError with FILE_MOVE_FAILED when destination parent does not exist', async () => {
      const source = join(tempDir, 'source.txt')
      const destination = join(tempDir, 'nonexistent', 'subdir', 'dest.txt')
      await writeFile(source, 'x')

      await expect(FileSystemAdapter.moveFile(source, destination)).rejects.toMatchObject({
        kind: 'AppError',
        code: 'FILE_MOVE_FAILED',
        details: { source, destination }
      })
    })

    it('throws AppError with FILE_MOVE_FALLBACK_FAILED when EXDEV copy fails', async () => {
      const source = join(tempDir, 'source.txt')
      const destination = join(tempDir, 'dest.txt')
      await writeFile(source, 'x')

      renameReject.current = { code: 'EXDEV' }
      copyFileReject.current = new Error('Copy failed')

      await expect(FileSystemAdapter.moveFile(source, destination)).rejects.toMatchObject({
        kind: 'AppError',
        code: 'FILE_MOVE_FALLBACK_FAILED',
        details: { source, destination }
      })
    })
  })
})
