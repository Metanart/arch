import { createApi } from '@reduxjs/toolkit/query/react'

import { baseIpcQuery } from '@domains/Shared'

import { SOURCES_IPC_API_TAGS } from './enums'

export const SourcesIpcApi = createApi({
  reducerPath: 'UNIQUE_SOURCES_API_KEY',
  baseQuery: baseIpcQuery,
  tagTypes: [SOURCES_IPC_API_TAGS.GLOBAL],
  endpoints: () => ({})
})
