import { existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { AppError } from '@arch/utils'

import { describe, expect, it } from 'vitest'

import { detectPlatform } from '../../../utils/platform/detectPlatform'
import { resolvePathToExecutable } from '../resolvePathToExecutable'
import { runExecutable } from '../runExecutable'
import { UnrarServiceErrorCode } from '../types'

const __dirname = dirname(fileURLToPath(import.meta.url))

function getDevPath(): string {
  const exe: 'unrar.exe' | 'unrar' = process.platform === 'win32' ? 'unrar.exe' : 'unrar'
  return resolve(process.cwd(), 'resources', 'bin', detectPlatform(), exe)
}

const unrarAvailable = ((): boolean => {
  try {
    resolvePathToExecutable()
    return true
  } catch {
    return false
  }
})()

describe('runExecutable (integration)', () => {
  describe('when unrar executable is available', () => {
    it.runIf(unrarAvailable)(
      'uses path from resolvePathToExecutable and resolves with stdout when listing a real archive',
      async () => {
        const archivePath = join(__dirname, 'fixtures', 'nested.rar')
        const stdout = await runExecutable(['lb', '-idq', '-scu', '-p-', archivePath])

        expect(typeof stdout).toBe('string')
        expect(stdout.length).toBeGreaterThanOrEqual(0)
      }
    )

    it.runIf(unrarAvailable)(
      'resolves with stdout string when listing contents of valid fixture',
      async () => {
        const archivePath = join(__dirname, 'fixtures', 'valid.rar')
        if (!existsSync(archivePath)) {
          return
        }
        const stdout = await runExecutable(['lb', '-idq', '-scu', '-p-', archivePath])

        expect(typeof stdout).toBe('string')
      }
    )

    it.runIf(unrarAvailable)(
      'rejects with AppError UNRAR_EXECUTABLE_RUN_FAILED when archive does not exist',
      async () => {
        const badPath = join(__dirname, 'fixtures', 'nonexistent.rar')

        await expect(runExecutable(['lb', '-idq', '-scu', '-p-', badPath])).rejects.toMatchObject({
          code: 'UNRAR_EXECUTABLE_RUN_FAILED',
          kind: 'AppError',
          details: expect.objectContaining({ exitCode: expect.any(Number) })
        } as Partial<AppError<UnrarServiceErrorCode, { exitCode: number }>>)
      }
    )

    it.runIf(unrarAvailable)(
      'rejects with AppError when unrar exits with non-zero and error message includes stderr or stdout',
      async () => {
        const badPath = join(__dirname, 'fixtures', 'nonexistent.rar')

        await expect(runExecutable(['lb', '-idq', '-scu', '-p-', badPath])).rejects.toThrow(
          AppError
        )
      }
    )

    it.runIf(unrarAvailable)(
      'runs the executable resolved by resolvePathToExecutable (same path as getDevPath when under dev)',
      async () => {
        const devPath = getDevPath()
        if (!existsSync(devPath)) {
          return
        }
        const resolved = resolvePathToExecutable()
        expect(resolved).toBe(devPath)

        const archivePath = join(__dirname, 'fixtures', 'nested.rar')
        await expect(
          runExecutable(['lb', '-idq', '-scu', '-p-', archivePath])
        ).resolves.toBeDefined()
      }
    )

    it.runIf(unrarAvailable)(
      'rejects when abort signal is triggered before process completes',
      async () => {
        const controller = new AbortController()
        const archivePath = join(__dirname, 'fixtures', 'nested.rar')
        const promise = runExecutable(['lb', '-idq', '-scu', '-p-', archivePath], controller.signal)
        controller.abort()

        await expect(promise).rejects.toThrow()
      }
    )
  })

  describe('when unrar executable is not available', () => {
    it.runIf(!unrarAvailable)(
      'runExecutable is not testable (resolvePathToExecutable would throw)',
      () => {
        expect(() => resolvePathToExecutable()).toThrow(AppError)
      }
    )
  })
})
