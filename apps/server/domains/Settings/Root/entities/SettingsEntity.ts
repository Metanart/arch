import { Column, Entity } from 'typeorm'

import { BaseEntity } from '@domains/Shared'

@Entity({ name: 'settings' })
export class SettingsEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  outputDir!: string

  @Column({ type: 'varchar' })
  tempDir!: string

  @Column({ type: 'int', default: 4 })
  maxThreads!: number

  @Column({ type: 'boolean', default: false })
  autoProcessOnScan!: boolean

  @Column({ type: 'boolean', default: false })
  autoArchiveOnComplete!: boolean

  @Column({ type: 'boolean', default: true })
  useMultithreading!: boolean

  @Column({ type: 'boolean', default: false })
  debugMode!: boolean
}

export function createDefaultSettings(outputDir: string, tempDir: string): Partial<SettingsEntity> {
  return {
    outputDir,
    tempDir,
    maxThreads: 4,
    autoProcessOnScan: false,
    autoArchiveOnComplete: false,
    useMultithreading: true,
    debugMode: false
  }
}
