import { SourceClientDTO, UpdateSourceClientDTO } from '@arch/contracts'
import { SOURCES_IPC_CHANNELS } from '@arch/enums'

import { SourcesIpcApi } from './SourcesIpcApi'

import { SOURCES_IPC_API_TAGS } from './enums'

export const { useUpdateSourceMutation } = SourcesIpcApi.injectEndpoints({
  endpoints: (builder) => ({
    updateSource: builder.mutation<SourceClientDTO, UpdateSourceClientDTO>({
      query: (payload: UpdateSourceClientDTO) => {
        return {
          domain: 'Sources',
          channel: SOURCES_IPC_CHANNELS.UPDATE,
          payload
        }
      },
      invalidatesTags: (result, error) => {
        if (error || !result) return []
        return [SOURCES_IPC_API_TAGS.GLOBAL]
      }
    })
  })
})
