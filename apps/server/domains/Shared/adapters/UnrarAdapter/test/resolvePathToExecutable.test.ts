import { AppError } from '@arch/utils'

import { afterEach, describe, expect, it, vi } from 'vitest'

import { resolvePathToExecutable } from '../resolvePathToExecutable'
import { UnrarServiceErrorCode } from '../types'

const existsSyncMock = vi.fn<(path: string) => boolean>(() => false)

vi.mock('node:fs', () => ({
  existsSync: (path: string): boolean => existsSyncMock(path)
}))

describe('resolvePathToExecutable', () => {
  afterEach(() => {
    vi.clearAllMocks()
    existsSyncMock.mockReturnValue(false)
  })

  describe('normal behavior', () => {
    it('returns prod path when executable exists at prod location', () => {
      let prod = ''
      try {
        resolvePathToExecutable()
      } catch (e) {
        const err = e as AppError<UnrarServiceErrorCode, { prod: string; dev: string }>
        prod = err.details!.prod
      }
      existsSyncMock.mockImplementation((path: string) => path === prod)

      const result = resolvePathToExecutable()

      expect(result).toBe(prod)
      expect(existsSyncMock).toHaveBeenCalledWith(prod)
    })

    it('returns dev path when executable exists at dev but not at prod', () => {
      let prod = ''
      let dev = ''
      try {
        resolvePathToExecutable()
      } catch (e) {
        const err = e as AppError<UnrarServiceErrorCode, { prod: string; dev: string }>
        prod = err.details!.prod
        dev = err.details!.dev
      }
      existsSyncMock.mockImplementation((path: string) => path === dev)

      const result = resolvePathToExecutable()

      expect(result).toBe(dev)
      expect(existsSyncMock).toHaveBeenCalledWith(prod)
      expect(existsSyncMock).toHaveBeenCalledWith(dev)
    })
  })

  describe('error handling', () => {
    it('throws AppError with UNRAR_EXECUTABLE_NOT_FOUND when executable not at prod or dev', () => {
      existsSyncMock.mockReturnValue(false)

      expect(() => resolvePathToExecutable()).toThrow(AppError)
      try {
        resolvePathToExecutable()
      } catch (e) {
        const err = e as AppError<UnrarServiceErrorCode, { prod: string; dev: string }>
        expect(err.code).toBe('UNRAR_EXECUTABLE_NOT_FOUND')
        expect(err.kind).toBe('AppError')
      }
    })

    it('error details include prod and dev paths', () => {
      existsSyncMock.mockReturnValue(false)

      try {
        resolvePathToExecutable()
      } catch (e) {
        const err = e as AppError<UnrarServiceErrorCode, { prod: string; dev: string }>
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
        const err = e as AppError<UnrarServiceErrorCode, { prod: string; dev: string }>
        expect(err.cause).toBeInstanceOf(Error)
      }
    })
  })

  describe('platform', () => {
    it('uses correct executable name for current platform', () => {
      existsSyncMock.mockReturnValue(false)

      try {
        resolvePathToExecutable()
      } catch (e) {
        const err = e as AppError<UnrarServiceErrorCode, { prod: string; dev: string }>
        const prod = err.details!.prod
        const dev = err.details!.dev
        const expectedSuffix = process.platform === 'win32' ? 'unrar.exe' : 'unrar'
        expect(prod.endsWith(expectedSuffix)).toBe(true)
        expect(dev.endsWith(expectedSuffix)).toBe(true)
      }
    })
  })
})
