import { DataSource } from 'typeorm'

import { SettingsEntity } from '@domains/Settings'
import { SourceEntity } from '@domains/Sources'

const isTest = process.env.NODE_ENV === 'test'

let dataSource: DataSource | null = null

export function createDataSource(dbPath: string): DataSource {
  if (dataSource) return dataSource

  const database = isTest ? ':memory:' : dbPath

  dataSource = new DataSource({
    type: 'better-sqlite3',
    database,
    entities: [SettingsEntity, SourceEntity],
    synchronize: true, // 🔧 DEV FLAG
    logging: false,
    cache: false
  })

  return dataSource
}

export function getDataSource(): DataSource {
  if (!dataSource) {
    throw new Error('DataSource is not initialized. Call initDataSource() first.')
  }

  return dataSource
}
