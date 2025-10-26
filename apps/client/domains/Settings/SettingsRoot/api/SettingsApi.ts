import { createApi } from '@reduxjs/toolkit/query/react'
import { baseApiQuery } from '@shared/utils'

const reducerPath = 'SettingsApi'

export type SettingsApiTags = 'Settings'

export const SettingsApi = createApi({
  reducerPath,
  baseQuery: baseApiQuery,
  tagTypes: ['Settings'],
  endpoints: () => ({})
})
