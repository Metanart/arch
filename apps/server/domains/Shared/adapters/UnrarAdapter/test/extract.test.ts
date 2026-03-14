import { existsSync } from 'node:fs'
import { mkdtemp, rm, stat } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { AppError } from '@arch/utils'

import { describe, expect, it } from 'vitest'

import { extract } from '../extract'
import { listContents } from '../listContents'
import { resolvePathToExecutable } from '../resolvePathToExecutable'
import { TUnrarServiceErrorCode } from '../types'

const __dirname = dirname(fileURLToPath(import.meta.url))

const fixturePath = join(__dirname, 'fixtures', 'valid.rar')
const nestedFixturePath = join(__dirname, 'fixtures', 'nested.rar')
const protectedFixturePath = join(__dirname, 'fixtures', 'protected.rar')
const protectedArchivePassword = '666666'

const unrarAvailable = ((): boolean => {
  try {
    resolvePathToExecutable()
    return true
  } catch {
    return false
  }
})()

describe('extract (integration)', () => {
  describe('when unrar executable is available', () => {
    it.runIf(unrarAvailable)(
      'extracts valid.rar to output directory and creates expected files',
      async () => {
        if (!existsSync(fixturePath)) {
          return
        }

        const outputDir = await mkdtemp(join(tmpdir(), 'unrar-extract-test-'))
        try {
          const entriesBefore = await listContents(fixturePath)
          await extract(fixturePath, outputDir)

          await expect(stat(outputDir)).resolves.toBeDefined()
          for (const entry of entriesBefore) {
            const fullPath = join(outputDir, entry)
            await expect(stat(fullPath)).resolves.toBeDefined()
          }
        } finally {
          await rm(outputDir, { recursive: true, force: true })
        }
      }
    )

    it.runIf(unrarAvailable)('creates output directory when it does not exist', async () => {
      if (!existsSync(fixturePath)) {
        return
      }

      const baseDir = await mkdtemp(join(tmpdir(), 'unrar-extract-test-'))
      const outputDir = join(baseDir, 'nested', 'output')
      try {
        await extract(fixturePath, outputDir)
        await expect(stat(outputDir)).resolves.toBeDefined()
      } finally {
        await rm(baseDir, { recursive: true, force: true })
      }
    })

    it.runIf(unrarAvailable)(
      'extracts nested.rar to output directory and creates expected files with paths',
      async () => {
        if (!existsSync(nestedFixturePath)) {
          return
        }

        const outputDir = await mkdtemp(join(tmpdir(), 'unrar-extract-test-'))
        try {
          const entriesBefore = await listContents(nestedFixturePath)
          await extract(nestedFixturePath, outputDir)

          await expect(stat(outputDir)).resolves.toBeDefined()
          for (const entry of entriesBefore) {
            const fullPath = join(outputDir, entry)
            await expect(stat(fullPath)).resolves.toBeDefined()
          }
        } finally {
          await rm(outputDir, { recursive: true, force: true })
        }
      }
    )

    it.runIf(unrarAvailable)('extracts again with overwrite: true without failing', async () => {
      if (!existsSync(fixturePath)) {
        return
      }

      const outputDir = await mkdtemp(join(tmpdir(), 'unrar-extract-test-'))
      try {
        await extract(fixturePath, outputDir)
        await extract(fixturePath, outputDir, { overwrite: true })
        const entries = await listContents(fixturePath)

        for (const entry of entries) {
          const fullPath = join(outputDir, entry)
          await expect(stat(fullPath)).resolves.toBeDefined()
        }
      } finally {
        await rm(outputDir, { recursive: true, force: true })
      }
    })

    it.runIf(unrarAvailable)(
      'extracts protected.rar with correct password and creates expected files',
      async () => {
        if (!existsSync(protectedFixturePath)) {
          return
        }

        const outputDir = await mkdtemp(join(tmpdir(), 'unrar-extract-test-'))
        try {
          const entriesBefore = await listContents(protectedFixturePath, {
            password: protectedArchivePassword
          })
          await extract(protectedFixturePath, outputDir, {
            password: protectedArchivePassword
          })

          await expect(stat(outputDir)).resolves.toBeDefined()
          for (const entry of entriesBefore) {
            const fullPath = join(outputDir, entry)
            await expect(stat(fullPath)).resolves.toBeDefined()
          }
        } finally {
          await rm(outputDir, { recursive: true, force: true })
        }
      }
    )

    it.runIf(unrarAvailable)('rejects when extracting protected.rar without password', async () => {
      if (!existsSync(protectedFixturePath)) {
        return
      }

      const outputDir = await mkdtemp(join(tmpdir(), 'unrar-extract-test-'))
      try {
        await expect(extract(protectedFixturePath, outputDir)).rejects.toMatchObject({
          code: 'UNRAR_EXECUTABLE_RUN_FAILED',
          kind: 'AppError',
          details: expect.objectContaining({ exitCode: expect.any(Number) })
        } as Partial<AppError<TUnrarServiceErrorCode, { exitCode: number }>>)
      } finally {
        await rm(outputDir, { recursive: true, force: true })
      }
    })
  })

  describe('when unrar executable is not available', () => {
    it.runIf(!unrarAvailable)(
      'extract is not testable (resolvePathToExecutable would throw)',
      () => {
        expect(() => resolvePathToExecutable()).toThrow()
      }
    )
  })
})
