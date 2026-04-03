import { DataSource } from 'typeorm'

import { SettingsEntity } from '@domains/Settings/entities'
import { SourceEntity } from '@domains/Sources/entities'
import { TaskDependencyEntity, TaskEntity, TasksWorkflowEntity } from '@domains/Tasks/entities'

let dataSource: DataSource | null = null

export const appEntities = [
  SettingsEntity,
  SourceEntity,
  TaskEntity,
  TasksWorkflowEntity,
  TaskDependencyEntity
]

export type TAppEntities = typeof appEntities

function createDataSource(database: string | ':memory:', entities: TAppEntities): DataSource {
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

export function createTestDataSource(entities: TAppEntities) {
  return createDataSource(':memory:', entities)
}

export function getDataSource(): DataSource {
  if (!dataSource) {
    throw new Error('DataSource is not initialized. Call getDataSource().initialize() first.')
  }

  return dataSource
}
