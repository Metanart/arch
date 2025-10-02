import { Column, Entity } from 'typeorm'

import { appPaths } from '@server/Shared/platform'
import { BaseEntity } from '@server/Shared/entities'

const { outputDir, tempDir } = appPaths

@Entity({ name: 'settings' })
export class SettingsEntity extends BaseEntity {
  @Column({ type: 'varchar', default: outputDir })
  outputFolder!: string

  @Column({ type: 'varchar', default: tempDir })
  tempFolder!: string

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
