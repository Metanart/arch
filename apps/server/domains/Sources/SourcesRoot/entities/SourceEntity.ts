import { Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm'

import { BaseEntity } from '@shared/entities'

@Entity({ name: 'sources' })
export class SourceEntity extends BaseEntity {
  @Column({ type: 'varchar', unique: true })
  path!: string

  @Column({ type: 'varchar', unique: true })
  name!: string

  @Column({ type: 'varchar', nullable: true })
  comment!: string | null

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date

  @UpdateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  updatedAt!: Date
}
