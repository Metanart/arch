import { z } from 'zod'

import { createTestDataSource, getDataSource, TestEntity } from '@domains/App'

import type { DataSource } from 'typeorm'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import { createEntity } from './createEntity'

declare global {
  var __testDataSource: DataSource | undefined
}

vi.mock('@domains/App', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@domains/App')>()
  return {
    ...actual,
    getDataSource: (): DataSource => {
      const ds = globalThis.__testDataSource
      if (!ds) throw new Error('Test DataSource not initialized')
      return ds
    }
  }
})

const outputSchema = z.object({
  id: z.string().uuid(),
  name: z.string()
})

type TOutputDto = z.infer<typeof outputSchema>

describe('createEntity', () => {
  beforeAll(async () => {
    const ds = createTestDataSource([TestEntity])
    await ds.initialize()
    globalThis.__testDataSource = ds
  })

  afterAll(async () => {
    const ds = globalThis.__testDataSource
    if (ds) await ds.destroy()
    globalThis.__testDataSource = undefined
  })

  beforeEach(async () => {
    const ds = getDataSource()
    await ds.getRepository(TestEntity).clear()
  })

  describe('normal behavior', () => {
    it('creates entity, saves to database, and returns DTO', async () => {
      const input = { name: 'first' }

      const result = await createEntity<TestEntity, TOutputDto>(TestEntity, outputSchema, input)

      expect(result).toMatchObject({ name: 'first' })
      expect(result.id).toBeDefined()
      expect(typeof result.id).toBe('string')

      const repo = getDataSource().getRepository(TestEntity)
      const saved = await repo.findOne({ where: { id: result.id } })
      expect(saved).not.toBeNull()
      expect(saved?.name).toBe('first')
    })

    it('persists entity so it can be read back', async () => {
      const input = { name: 'persisted' }

      const dto = await createEntity<TestEntity, TOutputDto>(TestEntity, outputSchema, input)

      const repo = getDataSource().getRepository(TestEntity)
      const found = await repo.findOne({ where: { id: dto.id } })
      expect(found?.name).toBe('persisted')
    })
  })

  describe('failure paths', () => {
    it('throws when save fails (e.g. unique constraint)', async () => {
      await createEntity<TestEntity, TOutputDto>(TestEntity, outputSchema, { name: 'dupe' })

      await expect(
        createEntity<TestEntity, TOutputDto>(TestEntity, outputSchema, { name: 'dupe' })
      ).rejects.toThrow()
    })

    it('throws when output schema parse fails', async () => {
      const strictSchema = z.object({
        id: z.string().uuid(),
        name: z.string(),
        extra: z.number()
      })

      await expect(
        createEntity<TestEntity, z.infer<typeof strictSchema>>(TestEntity, strictSchema, {
          name: 'will-fail-dto'
        })
      ).rejects.toThrow()
    })
  })
})
