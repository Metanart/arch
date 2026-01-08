import { createApi } from '@reduxjs/toolkit/query/react'
import { baseIpcQuery } from '@shared/utils'

import { SETTINGS_IPC_API_TAGS } from './enums'

export const SettingsIpcApi = createApi({
  reducerPath: 'UNIQUE_SETTINGS_API_KEY',
  baseQuery: baseIpcQuery,
  tagTypes: [SETTINGS_IPC_API_TAGS.GLOBAL],
  endpoints: () => ({})
})
