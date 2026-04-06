import { existsSync } from 'node:fs'
import { copyFile, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

import { resolvePathToExecutable } from '../resolvePathToExecutable'
import { testIntegrity } from '../testIntegrity'

const __dirname = dirname(fileURLToPath(import.meta.url))

const validFixturePath = join(__dirname, 'fixtures', 'valid.rar')

const unrarAvailable = ((): boolean => {
  try {
    resolvePathToExecutable()
    return true
  } catch {
    return false
  }
})()

describe('testIntegrity (integration)', () => {
  describe('when unrar executable is available', () => {
    it.runIf(unrarAvailable)('returns true for intact valid.rar', async () => {
      if (!existsSync(validFixturePath)) {
        return
      }
      const result = await testIntegrity(validFixturePath)
      expect(result).toBe(true)
    })

    it.runIf(unrarAvailable)('returns false for corrupted copy of valid.rar', async () => {
      if (!existsSync(validFixturePath)) {
        return
      }

      const tempDir = await mkdtemp(join(tmpdir(), 'unrar-integrity-test-'))
      const corruptedPath = join(tempDir, 'corrupted.rar')
      try {
        await copyFile(validFixturePath, corruptedPath)
        const buf = await readFile(corruptedPath)
        const offset = Math.max(1, Math.floor(buf.length / 2) - 5)
        for (let i = 0; i < 20 && offset + i < buf.length; i++) {
          buf[offset + i] = 0xff
        }
        await writeFile(corruptedPath, buf)

        const result = await testIntegrity(corruptedPath)
        expect(result).toBe(false)
      } finally {
        await rm(tempDir, { recursive: true, force: true })
      }
    })

    it.runIf(unrarAvailable)('returns false for nonexistent archive', async () => {
      const badPath = join(__dirname, 'fixtures', 'nonexistent.rar')
      const result = await testIntegrity(badPath)
      expect(result).toBe(false)
    })
  })

  describe('when unrar executable is not available', () => {
    it.runIf(!unrarAvailable)(
      'returns false (runExecutable throws, caught by testIntegrity)',
      async () => {
        if (!existsSync(validFixturePath)) {
          return
        }
        const result = await testIntegrity(validFixturePath)
        expect(result).toBe(false)
      }
    )
  })
})
