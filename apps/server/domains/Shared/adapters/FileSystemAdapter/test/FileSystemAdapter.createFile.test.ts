import { mkdtemp, readFile, rm, stat, writeFile } from 'fs/promises'

import { tmpdir } from 'os'
import { join } from 'path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { FileSystemAdapter } from './FileSystemAdapter'

describe('FileSystemAdapter.createFile', () => {
  let tempDir: string

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'createFile-test-'))
  })

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true })
  })

  describe('normal behavior', () => {
    it('creates an empty file with given name and extension and returns true', async () => {
      const result = await FileSystemAdapter.createFile('myfile', 'txt', tempDir)

      expect(result).toBe(true)
      const filePath = join(tempDir, 'myfile.txt')
      const stats = await stat(filePath)
      expect(stats.isFile()).toBe(true)
      const content = await readFile(filePath, 'utf-8')
      expect(content).toBe('')
    })

    it('normalizes extension by stripping leading dot', async () => {
      const result = await FileSystemAdapter.createFile('config', '.json', tempDir)

      expect(result).toBe(true)
      const filePath = join(tempDir, 'config.json')
      await stat(filePath)
      const content = await readFile(filePath, 'utf-8')
      expect(content).toBe('')
    })

    it('uses extension as-is when it has no leading dot', async () => {
      const result = await FileSystemAdapter.createFile('data', 'csv', tempDir)

      expect(result).toBe(true)
      const filePath = join(tempDir, 'data.csv')
      await stat(filePath)
    })

    it('creates file without extension when extension is empty', async () => {
      const result = await FileSystemAdapter.createFile('noext', '', tempDir)

      expect(result).toBe(true)
      const filePath = join(tempDir, 'noext')
      const stats = await stat(filePath)
      expect(stats.isFile()).toBe(true)
    })
  })

  describe('directory creation', () => {
    it('creates output directory recursively when it does not exist', async () => {
      const nestedDir = join(tempDir, 'nested', 'deep')

      const result = await FileSystemAdapter.createFile('file', 'ext', nestedDir)

      expect(result).toBe(true)
      const filePath = join(nestedDir, 'file.ext')
      await stat(filePath)
    })
  })

  describe('error handling', () => {
    it('returns false when outputDir parent is an existing file (mkdir fails)', async () => {
      const fileAsDir = join(tempDir, 'blocker')
      await writeFile(fileAsDir, '')
      const outputDir = join(fileAsDir, 'subdir')

      const result = await FileSystemAdapter.createFile('x', 'y', outputDir)

      expect(result).toBe(false)
    })
  })
})
