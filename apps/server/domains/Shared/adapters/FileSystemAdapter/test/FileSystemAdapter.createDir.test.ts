import { mkdtemp, rm, stat, writeFile } from 'fs/promises'

import { tmpdir } from 'os'
import { join } from 'path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { FileSystemAdapter } from '../FileSystemAdapter'

describe('FileSystemAdapter.createDir', () => {
  let tempDir: string

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'createDir-test-'))
  })

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true })
  })

  describe('normal behavior', () => {
    it('creates a directory and returns true', async () => {
      const dirPath = join(tempDir, 'newdir')

      const result = await FileSystemAdapter.createDir(dirPath)

      expect(result).toBe(true)
      const stats = await stat(dirPath)
      expect(stats.isDirectory()).toBe(true)
    })

    it('creates nested directories recursively when recursive is true (default)', async () => {
      const nestedPath = join(tempDir, 'a', 'b', 'c')

      const result = await FileSystemAdapter.createDir(nestedPath)

      expect(result).toBe(true)
      await stat(join(tempDir, 'a'))
      await stat(join(tempDir, 'a', 'b'))
      const stats = await stat(nestedPath)
      expect(stats.isDirectory()).toBe(true)
    })

    it('creates a single directory when recursive is false and parent exists', async () => {
      const dirPath = join(tempDir, 'single')

      const result = await FileSystemAdapter.createDir(dirPath, false)

      expect(result).toBe(true)
      const stats = await stat(dirPath)
      expect(stats.isDirectory()).toBe(true)
    })

    it('returns true when directory already exists and recursive is true', async () => {
      const dirPath = join(tempDir, 'existing')
      await FileSystemAdapter.createDir(dirPath)

      const result = await FileSystemAdapter.createDir(dirPath)

      expect(result).toBe(true)
      const stats = await stat(dirPath)
      expect(stats.isDirectory()).toBe(true)
    })
  })

  describe('edge cases', () => {
    it('returns true when creating the same path again with recursive true', async () => {
      const nestedPath = join(tempDir, 'nested', 'path')
      await FileSystemAdapter.createDir(nestedPath)

      const result = await FileSystemAdapter.createDir(nestedPath)

      expect(result).toBe(true)
    })
  })

  describe('error handling', () => {
    it('returns false when recursive is false and parent does not exist', async () => {
      const dirPath = join(tempDir, 'missing', 'child')

      const result = await FileSystemAdapter.createDir(dirPath, false)

      expect(result).toBe(false)
    })

    it('returns false when dirPath is under an existing file', async () => {
      const filePath = join(tempDir, 'blocker')
      await writeFile(filePath, '')
      const dirPath = join(filePath, 'subdir')

      const result = await FileSystemAdapter.createDir(dirPath)

      expect(result).toBe(false)
    })
  })
})
