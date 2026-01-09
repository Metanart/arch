import { CreateSourceClientDTO, SourceClientDTO } from '@arch/contracts'
import { SOURCES_IPC_CHANNELS } from '@arch/enums'

import { SourcesIpcApi } from './SourcesIpcApi'

import { SOURCES_IPC_API_TAGS } from './enums'

export const { useCreateSourceMutation } = SourcesIpcApi.injectEndpoints({
  endpoints: (builder) => ({
    createSource: builder.mutation<SourceClientDTO, CreateSourceClientDTO>({
      query: (payload: CreateSourceClientDTO) => {
        return {
          domain: 'Sources',
          channel: SOURCES_IPC_CHANNELS.CREATE,
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
