import { SettingsClientDTO, UpdateSettingsClientDTO } from '@arch/contracts'
import { SETTINGS_IPC_CHANNELS } from '@arch/enums'

import { SETTINGS_IPC_API_TAGS } from './enums'
import { SettingsIpcApi } from './SettingsIpcApi'

export const { useUpdateSettingsMutation } = SettingsIpcApi.injectEndpoints({
  endpoints: (builder) => ({
    updateSettings: builder.mutation<SettingsClientDTO, UpdateSettingsClientDTO>({
      query: (payload: UpdateSettingsClientDTO) => {
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
