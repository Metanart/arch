import { DataSource } from 'typeorm'

import { appPaths } from '@shared/utils'

// Entities have to be imported first and separately from the main repository code
// to avoid errors like "ReferenceError: Cannot access 'AppDataSource' before initialization"
import { SettingsEntity } from '@domains/Settings/SettingsRoot/entities'
import { SourceEntity } from '@domains/Sources/SourcesRoot/entities'

const isTest = process.env.NODE_ENV === 'test'

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: isTest ? ':memory:' : appPaths.dbFile,
  entities: [SettingsEntity, SourceEntity],
  synchronize: true, // 🔧 DEV FLAG
  logging: false,
  cache: false
})
