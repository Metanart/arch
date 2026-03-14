import { TSettingsClientDTO, TUpdateSettingsClientDTO } from '@arch/contracts'
import { SETTINGS_IPC_CHANNELS } from '@arch/enums'

import { SettingsIpcApi } from './SettingsIpcApi'

import { SETTINGS_IPC_API_TAGS } from './enums'

export const { useUpdateSettingsMutation } = SettingsIpcApi.injectEndpoints({
  endpoints: (builder) => ({
    updateSettings: builder.mutation<TSettingsClientDTO, TUpdateSettingsClientDTO>({
      query: (payload: TUpdateSettingsClientDTO) => {
        return {
          domain: 'Settings',
          channel: SETTINGS_IPC_CHANNELS.UPDATE,
          payload
        }
      },
      invalidatesTags: (result, error) => {
        if (error || !result) return []
        return [SETTINGS_IPC_API_TAGS.GLOBAL]
      }
    })
  })
})
