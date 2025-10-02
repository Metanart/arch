import { DataSource } from 'typeorm'

import { appPaths } from '@server/Shared/Platform'
import { SettingsEntity } from '@server/Settings/SettingsRoot'

const isTest = process.env.NODE_ENV === 'test'

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: isTest ? ':memory:' : appPaths.dbFile,
  entities: [SettingsEntity],
  synchronize: true, // 🔧 DEV FLAG
  logging: false,
  cache: false
})
