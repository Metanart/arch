import { SOURCES_IPC_CHANNELS } from '@arch/enums'

import { SourcesIpcApi } from './SourcesIpcApi'

import { SOURCES_IPC_API_TAGS } from './enums'

export const { useRemoveSourceMutation } = SourcesIpcApi.injectEndpoints({
  endpoints: (builder) => ({
    removeSource: builder.mutation<boolean, string>({
      query: (sourceId: string) => {
        return {
          domain: 'Sources',
          channel: SOURCES_IPC_CHANNELS.REMOVE,
          payload: sourceId
        }
      },
      invalidatesTags: (result, error) => {
        if (error || !result) return []
        return [SOURCES_IPC_API_TAGS.GLOBAL]
      }
    })
  })
})
