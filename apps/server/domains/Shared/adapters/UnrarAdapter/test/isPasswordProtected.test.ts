import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { AppError } from '@arch/utils'

import { describe, expect, it } from 'vitest'

import { isPasswordProtected } from '../isPasswordProtected'
import { resolvePathToExecutable } from '../resolvePathToExecutable'
import { UnrarServiceErrorCode } from '../types'

const __dirname = dirname(fileURLToPath(import.meta.url))

const validFixturePath = join(__dirname, 'fixtures', 'valid.rar')
const nestedFixturePath = join(__dirname, 'fixtures', 'nested.rar')
const protectedFixturePath = join(__dirname, 'fixtures', 'protected.rar')
const nonexistentPath = join(__dirname, 'fixtures', 'nonexistent.rar')

const unrarAvailable = ((): boolean => {
  try {
    resolvePathToExecutable()
    return true
  } catch {
    return false
  }
})()

describe('isPasswordProtected (integration)', () => {
  describe('when unrar executable is available', () => {
    it.runIf(unrarAvailable)('returns false for valid.rar', async () => {
      if (!existsSync(validFixturePath)) {
        return
      }
      const result = await isPasswordProtected(validFixturePath)
      expect(result).toBe(false)
    })

    it.runIf(unrarAvailable)('returns false for nested.rar', async () => {
      if (!existsSync(nestedFixturePath)) {
        return
      }
      const result = await isPasswordProtected(nestedFixturePath)
      expect(result).toBe(false)
    })

    it.runIf(unrarAvailable)('returns true for protected.rar', async () => {
      if (!existsSync(protectedFixturePath)) {
        return
      }
      const result = await isPasswordProtected(protectedFixturePath)
      expect(result).toBe(true)
    })

    it.runIf(unrarAvailable)(
      'throws AppError UNRAR_PASSWORD_PROTECTTION_CHECK_FAILED for nonexistent archive',
      async () => {
        await expect(isPasswordProtected(nonexistentPath)).rejects.toMatchObject({
          code: 'UNRAR_PASSWORD_PROTECTTION_CHECK_FAILED',
          kind: 'AppError',
          details: expect.objectContaining({ archivePath: nonexistentPath })
        } as Partial<AppError<UnrarServiceErrorCode, { archivePath: string }>>)
      }
    )
  })

  describe('when unrar executable is not available', () => {
    it.runIf(!unrarAvailable)(
      'isPasswordProtected is not testable (resolvePathToExecutable would throw)',
      () => {
        expect(() => resolvePathToExecutable()).toThrow(AppError)
      }
    )
  })
})
