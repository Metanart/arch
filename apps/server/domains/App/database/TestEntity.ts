import { Column, Entity } from 'typeorm'

import { BaseEntity } from '@domains/Shared'

/**
 * Minimal entity for testing repo helpers (createEntity, updateEntity, etc.).
 * Not used in production app schema.
 */
@Entity({ name: 'test_entity' })
export class TestEntity extends BaseEntity {
  @Column({ type: 'varchar', unique: true })
  name!: string
}
