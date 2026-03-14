import { resolve } from 'node:path'

import { AppError } from '@arch/utils'

import { afterEach, describe, expect, it, vi } from 'vitest'

import { detectPlatform } from '../../../utils/platform/detectPlatform'
import { resolvePathToExecutable } from '../resolvePathToExecutable'
import { TUnrarServiceErrorCode } from '../types'

const { realExistsSync } = vi.hoisted(() => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- need sync require for vi.hoisted before mock
  const fs = require('node:fs') as typeof import('node:fs')
  return { realExistsSync: fs.existsSync }
})

const existsSyncMock = vi.fn<(path: string) => boolean>((path: string) => realExistsSync(path))

vi.mock('node:fs', () => ({
  existsSync: (path: string): boolean => existsSyncMock(path)
}))

function getDevPath(): string {
  const exe: 'unrar.exe' | 'unrar' = process.platform === 'win32' ? 'unrar.exe' : 'unrar'
  return resolve(process.cwd(), 'resources', 'bin', detectPlatform(), exe)
}

describe('resolvePathToExecutable', () => {
  afterEach(() => {
    vi.clearAllMocks()
    existsSyncMock.mockImplementation((path: string) => realExistsSync(path))
  })

  describe('integration (real path resolution)', () => {
    const devPath = getDevPath()

    it.runIf(realExistsSync(devPath))(
      'resolves to the real unrar executable under resources/bin for current platform',
      () => {
        const result = resolvePathToExecutable()

        expect(result).toBe(devPath)
        expect(realExistsSync(result)).toBe(true)
      }
    )

    it.runIf(realExistsSync(devPath))(
      'resolved path contains resources/bin and platform-specific segment',
      () => {
        const result = resolvePathToExecutable()

        expect(result).toContain('resources')
        expect(result).toContain('bin')
        expect(result).toContain(detectPlatform())
        const exe = process.platform === 'win32' ? 'unrar.exe' : 'unrar'
        expect(result.endsWith(exe)).toBe(true)
      }
    )

    it.runIf(realExistsSync(devPath))(
      'uses correct executable name for current platform (unrar.exe on win32, unrar otherwise)',
      () => {
        const result = resolvePathToExecutable()
        const expectedSuffix = process.platform === 'win32' ? 'unrar.exe' : 'unrar'

        expect(result.endsWith(expectedSuffix)).toBe(true)
      }
    )
  })

  describe('error handling (when executable not found)', () => {
    it('throws AppError with UNRAR_EXECUTABLE_NOT_FOUND when executable not at prod or dev', () => {
      existsSyncMock.mockReturnValue(false)

      expect(() => resolvePathToExecutable()).toThrow(AppError)
      try {
        resolvePathToExecutable()
      } catch (e) {
        const err = e as AppError<TUnrarServiceErrorCode, { prod: string; dev: string }>
        expect(err.code).toBe('UNRAR_EXECUTABLE_NOT_FOUND')
        expect(err.kind).toBe('AppError')
      }
    })

    it('error details include prod and dev paths', () => {
      existsSyncMock.mockReturnValue(false)

      try {
        resolvePathToExecutable()
      } catch (e) {
        const err = e as AppError<TUnrarServiceErrorCode, { prod: string; dev: string }>
        expect(err.details).toBeDefined()
        expect(typeof err.details!.prod).toBe('string')
        expect(typeof err.details!.dev).toBe('string')
        expect(err.details!.prod.length).toBeGreaterThan(0)
        expect(err.details!.dev.length).toBeGreaterThan(0)
        expect(err.message).toContain(err.details!.prod)
        expect(err.message).toContain(err.details!.dev)
      }
    })

    it('error has cause set', () => {
      existsSyncMock.mockReturnValue(false)

      try {
        resolvePathToExecutable()
      } catch (e) {
        const err = e as AppError<TUnrarServiceErrorCode, { prod: string; dev: string }>
        expect(err.cause).toBeInstanceOf(Error)
      }
    })
  })

  describe('platform (path shape)', () => {
    it('prod and dev paths use correct executable name for current platform', () => {
      existsSyncMock.mockReturnValue(false)

      try {
        resolvePathToExecutable()
      } catch (e) {
        const err = e as AppError<TUnrarServiceErrorCode, { prod: string; dev: string }>
        const prod = err.details!.prod
        const dev = err.details!.dev
        const expectedSuffix = process.platform === 'win32' ? 'unrar.exe' : 'unrar'
        expect(prod.endsWith(expectedSuffix)).toBe(true)
        expect(dev.endsWith(expectedSuffix)).toBe(true)
      }
    })
  })
})
