import { SettingsClientDTO } from '@arch/contracts'
import { SETTINGS_IPC_CHANNELS } from '@arch/enums'

import { SETTINGS_IPC_API_TAGS } from './enums'
import { SettingsIpcApi } from './SettingsIpcApi'

export const { useGetSettingsQuery } = SettingsIpcApi.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query<SettingsClientDTO, void>({
      query: () => {
        return {
          domain: 'Settings',
          channel: SETTINGS_IPC_CHANNELS.GET
        }
      },
      providesTags: [SETTINGS_IPC_API_TAGS.GLOBAL]
    })
  })
})
