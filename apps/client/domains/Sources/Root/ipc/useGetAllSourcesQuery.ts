import { SourceClientDTO } from '@arch/contracts'
import { SOURCES_IPC_CHANNELS } from '@arch/enums'

import { SourcesIpcApi } from './SourcesIpcApi'

import { SOURCES_IPC_API_TAGS } from './enums'

export const { useGetAllSourcesQuery } = SourcesIpcApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSources: builder.query<SourceClientDTO[], void>({
      query: () => {
        return {
          domain: 'Sources',
          channel: SOURCES_IPC_CHANNELS.GET_ALL
        }
      },
      providesTags: [SOURCES_IPC_API_TAGS.GLOBAL]
    })
  })
})
