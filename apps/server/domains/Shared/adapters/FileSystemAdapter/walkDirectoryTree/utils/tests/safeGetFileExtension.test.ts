import { describe, expect, it } from 'vitest'

import { safeGetFileExtension } from '../safeGetFileExtension'

describe('safeGetFileExtension', () => {
  describe('normal behavior', () => {
    it('returns extension as substring after the last dot', () => {
      expect(safeGetFileExtension('readme.txt')).toBe('txt')
      expect(safeGetFileExtension('config.json')).toBe('json')
    })

    it('returns extension in lowercase', () => {
      expect(safeGetFileExtension('file.TXT')).toBe('txt')
      expect(safeGetFileExtension('file.JS')).toBe('js')
    })

    it('uses last dot when multiple dots present', () => {
      expect(safeGetFileExtension('archive.tar.gz')).toBe('gz')
      expect(safeGetFileExtension('a.b.c')).toBe('c')
    })
  })

  describe('no extension', () => {
    it('returns empty string when fileName has no dot', () => {
      expect(safeGetFileExtension('noext')).toBe('')
      expect(safeGetFileExtension('README')).toBe('')
    })

    it('returns empty string when dot is at the end (nothing after last dot)', () => {
      expect(safeGetFileExtension('file.')).toBe('')
      expect(safeGetFileExtension('a.b.')).toBe('')
    })
  })

  describe('invalid or empty input', () => {
    it('returns empty string for empty string', () => {
      expect(safeGetFileExtension('')).toBe('')
    })

    it('returns empty string for non-string input', () => {
      expect(safeGetFileExtension(null as unknown as string)).toBe('')
      expect(safeGetFileExtension(undefined as unknown as string)).toBe('')
    })
  })

  describe('edge cases', () => {
    it('returns empty string for single dot', () => {
      expect(safeGetFileExtension('.')).toBe('')
    })

    it('handles single character extension', () => {
      expect(safeGetFileExtension('file.a')).toBe('a')
    })

    it('handles long extension', () => {
      expect(safeGetFileExtension('file.longextension')).toBe('longextension')
    })
  })
})
