import { describe, expect, it } from 'vitest'

import { makeDirPredicate } from '../makeDirPredicate'

describe('makeDirPredicate', () => {
  describe('normal behavior', () => {
    it('returns true for a normal directory name when no blocks are configured', () => {
      const predicate = makeDirPredicate()
      expect(predicate('src')).toBe(true)
      expect(predicate('components')).toBe(true)
    })

    it('returns a function that accepts dirName and returns boolean', () => {
      const predicate = makeDirPredicate()
      expect(typeof predicate('any')).toBe('boolean')
    })
  })

  describe('hidden directories', () => {
    it('excludes hidden directories (starting with ".") when allowHidden is false (default)', () => {
      const predicate = makeDirPredicate()
      expect(predicate('.git')).toBe(false)
      expect(predicate('.vscode')).toBe(false)
      expect(predicate('.')).toBe(false)
    })

    it('includes hidden directories when allowHidden is true', () => {
      const predicate = makeDirPredicate([], [], true)
      expect(predicate('.git')).toBe(true)
      expect(predicate('.hidden')).toBe(true)
    })

    it('allows non-hidden names when allowHidden is false', () => {
      const predicate = makeDirPredicate()
      expect(predicate('src')).toBe(true)
      expect(predicate('dot.at.end')).toBe(true)
    })
  })

  describe('blocked names', () => {
    it('excludes directory names in blockedNames (exact match)', () => {
      const predicate = makeDirPredicate(['node_modules', 'dist'])
      expect(predicate('node_modules')).toBe(false)
      expect(predicate('dist')).toBe(false)
    })

    it('allows names not in blockedNames', () => {
      const predicate = makeDirPredicate(['node_modules'])
      expect(predicate('node_modules_old')).toBe(true)
      expect(predicate('src')).toBe(true)
    })

    it('uses empty blockedNames when not provided', () => {
      const predicate = makeDirPredicate()
      expect(predicate('node_modules')).toBe(true)
    })
  })

  describe('blocked patterns', () => {
    it('excludes directory names matching any blocked pattern', () => {
      const predicate = makeDirPredicate([], [/^__pycache__$/i, /^temp/i])
      expect(predicate('__pycache__')).toBe(false)
      expect(predicate('temp')).toBe(false)
      expect(predicate('temporary')).toBe(false)
    })

    it('allows names that do not match any pattern', () => {
      const predicate = makeDirPredicate([], [/^backup/i])
      expect(predicate('src')).toBe(true)
      expect(predicate('data')).toBe(true)
    })

    it('uses empty blockedPatterns when not provided', () => {
      const predicate = makeDirPredicate()
      expect(predicate('__pycache__')).toBe(true)
    })
  })

  describe('combined filters', () => {
    it('excludes when any condition matches (hidden wins first)', () => {
      const predicate = makeDirPredicate([], [], false)
      expect(predicate('.git')).toBe(false)
    })

    it('excludes when name is in blockedNames even if allowHidden is true', () => {
      const predicate = makeDirPredicate(['.git'], [], true)
      expect(predicate('.git')).toBe(false)
    })

    it('excludes when pattern matches even if allowHidden is true', () => {
      const predicate = makeDirPredicate([], [/^\./], true)
      expect(predicate('.git')).toBe(false)
    })

    it('allows only when all checks pass', () => {
      const predicate = makeDirPredicate(['node_modules'], [/^tmp$/i], false)
      expect(predicate('src')).toBe(true)
      expect(predicate('node_modules')).toBe(false)
      expect(predicate('tmp')).toBe(false)
    })
  })

  describe('edge cases', () => {
    it('handles empty string (not hidden, no dot at start)', () => {
      const predicate = makeDirPredicate()
      expect(predicate('')).toBe(true)
    })

    it('handles empty string when in blockedNames', () => {
      const predicate = makeDirPredicate([''])
      expect(predicate('')).toBe(false)
    })

    it('handles empty blockedNames and blockedPatterns', () => {
      const predicate = makeDirPredicate([], [])
      expect(predicate('anydir')).toBe(true)
    })
  })
})
