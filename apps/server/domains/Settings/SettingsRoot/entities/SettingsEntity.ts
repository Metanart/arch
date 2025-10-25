import { Column, Entity } from 'typeorm'

import { BaseEntity } from '@shared/entities'
import { appPaths } from '@shared/utils'

const { outputDir, tempDir } = appPaths

@Entity({ name: 'settings' })
export class SettingsEntity extends BaseEntity {
  @Column({ type: 'varchar', default: outputDir })
  outputDir!: string

  @Column({ type: 'varchar', default: tempDir })
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
