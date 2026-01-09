import { DataSource } from 'typeorm'

import { appPaths } from '@domains/Shared'

import { SettingsEntity } from '@domains/Settings/Root'
import { SourceEntity } from '@domains/Sources/Root'

const isTest = process.env.NODE_ENV === 'test'

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: isTest ? ':memory:' : appPaths.dbFile,
  entities: [SettingsEntity, SourceEntity],
  synchronize: true, // 🔧 DEV FLAG
  logging: false,
  cache: false
})
