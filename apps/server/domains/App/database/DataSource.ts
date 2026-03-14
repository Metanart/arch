import { DataSource } from 'typeorm'

import { SettingsEntity } from '@domains/Settings'
import { SourceEntity } from '@domains/Sources'

import { TestEntity } from './TestEntity'

let dataSource: DataSource | null = null

export const appEntities = [SettingsEntity, SourceEntity]

export type TAppEntities = typeof appEntities

export type TTestEntities = [typeof TestEntity]

function createDataSource(
  database: string | ':memory:',
  entities: TAppEntities | TTestEntities
): DataSource {
  if (dataSource) return dataSource

  if (!entities || !Array.isArray(entities)) {
    throw new Error(
      'entities argument must be defined and must be an array to initialize DataSource'
    )
  }

  if (entities.length === 0) {
    throw new Error('entities array must be not empty to initialize DataSource')
  }

  if (!database || typeof database !== 'string') {
    throw new Error('database argument must be defined to initialize DataSource')
  }

  dataSource = new DataSource({
    type: 'better-sqlite3',
    synchronize: true, // 🔧 DEV FLAG
    logging: false,
    cache: false,
    entities,
    database
  })

  return dataSource
}

export function createAppDataSource(database: string) {
  return createDataSource(database, appEntities)
}

export function createTestDataSource(entities: TAppEntities | TTestEntities) {
  return createDataSource(':memory:', entities)
}

export { TestEntity }

export function getDataSource(): DataSource {
  if (!dataSource) {
    throw new Error('DataSource is not initialized. Call getDataSource().initialize() first.')
  }

  return dataSource
}
