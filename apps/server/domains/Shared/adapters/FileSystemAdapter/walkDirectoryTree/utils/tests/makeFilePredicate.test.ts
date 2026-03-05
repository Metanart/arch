import { describe, expect, it } from 'vitest'

import { makeFilePredicate } from '../makeFilePredicate'

describe('makeFilePredicate', () => {
  describe('normal behavior', () => {
    it('returns true for a file when no filters are configured', () => {
      const predicate = makeFilePredicate()
      expect(predicate('readme.txt', 100)).toBe(true)
      expect(predicate('data.json', 0)).toBe(true)
    })

    it('returns a function that accepts fileName and fileSize and returns boolean', () => {
      const predicate = makeFilePredicate()
      expect(typeof predicate('a.txt', 0)).toBe('boolean')
    })
  })

  describe('blocked names', () => {
    it('excludes file names in blockedNames (exact match)', () => {
      const predicate = makeFilePredicate([], ['Thumbs.db', 'desktop.ini'])
      expect(predicate('Thumbs.db', 0)).toBe(false)
      expect(predicate('desktop.ini', 100)).toBe(false)
    })

    it('allows names not in blockedNames', () => {
      const predicate = makeFilePredicate([], ['Thumbs.db'])
      expect(predicate('Thumbs.db.bak', 0)).toBe(true)
      expect(predicate('myfile.txt', 0)).toBe(true)
    })

    it('uses empty blockedNames when not provided', () => {
      const predicate = makeFilePredicate()
      expect(predicate('Thumbs.db', 0)).toBe(true)
    })
  })

  describe('blocked patterns', () => {
    it('excludes file names matching any blocked pattern', () => {
      const predicate = makeFilePredicate([], [], [/\.log$/i, /^~\$/])
      expect(predicate('app.log', 0)).toBe(false)
      expect(predicate('~$document.docx', 100)).toBe(false)
    })

    it('allows names that do not match any pattern', () => {
      const predicate = makeFilePredicate([], [], [/\.log$/i])
      expect(predicate('readme.txt', 0)).toBe(true)
      expect(predicate('data.json', 0)).toBe(true)
    })

    it('uses empty blockedPatterns when not provided', () => {
      const predicate = makeFilePredicate()
      expect(predicate('file.log', 0)).toBe(true)
    })
  })

  describe('allowed extensions', () => {
    it('allows only files with allowed extensions when allowedExts is non-empty', () => {
      const predicate = makeFilePredicate(['txt', 'md'])
      expect(predicate('readme.txt', 0)).toBe(true)
      expect(predicate('doc.md', 0)).toBe(true)
      expect(predicate('script.js', 0)).toBe(false)
      expect(predicate('image.png', 0)).toBe(false)
    })

    it('normalizes extension to lowercase for comparison', () => {
      const predicate = makeFilePredicate(['txt'])
      expect(predicate('file.TXT', 0)).toBe(true)
      expect(predicate('file.Txt', 0)).toBe(true)
    })

    it('allows any extension when allowedExts is empty', () => {
      const predicate = makeFilePredicate([])
      expect(predicate('file.xyz', 0)).toBe(true)
      expect(predicate('noext', 0)).toBe(true)
    })

    it('uses last segment after dot as extension (e.g. a.b.c)', () => {
      const predicate = makeFilePredicate(['c'])
      expect(predicate('a.b.c', 0)).toBe(true)
      expect(predicate('archive.tar.gz', 0)).toBe(false)
    })

    it('excludes files with no extension when allowedExts is non-empty and ext is empty', () => {
      const predicate = makeFilePredicate(['txt'])
      expect(predicate('noext', 0)).toBe(false)
    })
  })

  describe('size limits', () => {
    it('excludes files below minSize when minSize is set', () => {
      const predicate = makeFilePredicate([], [], [], 100)
      expect(predicate('a.txt', 50)).toBe(false)
      expect(predicate('a.txt', 99)).toBe(false)
      expect(predicate('a.txt', 100)).toBe(true)
      expect(predicate('a.txt', 101)).toBe(true)
    })

    it('excludes files above maxSize when maxSize is set', () => {
      const predicate = makeFilePredicate([], [], [], undefined, 1000)
      expect(predicate('a.txt', 1001)).toBe(false)
      expect(predicate('a.txt', 1000)).toBe(true)
      expect(predicate('a.txt', 999)).toBe(true)
    })

    it('allows files within minSize and maxSize when both are set', () => {
      const predicate = makeFilePredicate([], [], [], 10, 100)
      expect(predicate('a.txt', 5)).toBe(false)
      expect(predicate('a.txt', 10)).toBe(true)
      expect(predicate('a.txt', 50)).toBe(true)
      expect(predicate('a.txt', 100)).toBe(true)
      expect(predicate('a.txt', 101)).toBe(false)
    })

    it('applies no size filter when minSize and maxSize are undefined', () => {
      const predicate = makeFilePredicate()
      expect(predicate('a.txt', 0)).toBe(true)
      expect(predicate('a.txt', 1e9)).toBe(true)
    })
  })

  describe('combined filters', () => {
    it('excludes when any condition fails', () => {
      const predicate = makeFilePredicate(['txt'], ['blocked.txt'], [/\.log$/], 10, 100)
      expect(predicate('blocked.txt', 50)).toBe(false)
      expect(predicate('app.log', 50)).toBe(false)
      expect(predicate('allowed.txt', 5)).toBe(false)
      expect(predicate('allowed.txt', 150)).toBe(false)
      expect(predicate('wrong.js', 50)).toBe(false)
      expect(predicate('allowed.txt', 50)).toBe(true)
    })

    it('checks order: name first, then patterns, then extension, then size', () => {
      const predicate = makeFilePredicate(['txt'], ['exact.txt'], [], 1, 10)
      expect(predicate('exact.txt', 5)).toBe(false)
      expect(predicate('other.txt', 0)).toBe(false)
      expect(predicate('other.txt', 5)).toBe(true)
    })
  })

  describe('edge cases', () => {
    it('handles zero file size', () => {
      const predicate = makeFilePredicate()
      expect(predicate('empty.txt', 0)).toBe(true)
    })

    it('handles minSize 0', () => {
      const predicate = makeFilePredicate([], [], [], 0)
      expect(predicate('a.txt', 0)).toBe(true)
    })

    it('handles empty fileName with no extension', () => {
      const predicate = makeFilePredicate(['txt'])
      expect(predicate('', 0)).toBe(false)
    })

    it('handles fileName that is only extension (e.g. ".txt")', () => {
      const predicate = makeFilePredicate(['txt'])
      expect(''.includes('.')).toBe(false)
      const name = '.txt'
      expect(name.includes('.')).toBe(true)
      expect(name.split('.').pop()).toBe('txt')
      expect(predicate('.txt', 0)).toBe(true)
    })
  })
})
