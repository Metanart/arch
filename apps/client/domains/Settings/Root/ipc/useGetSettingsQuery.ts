import { TSettingsClientDTO } from '@arch/contracts'
import { SETTINGS_IPC_CHANNELS } from '@arch/enums'

import { SettingsIpcApi } from './SettingsIpcApi'

import { SETTINGS_IPC_API_TAGS } from './enums'

export const { useGetSettingsQuery } = SettingsIpcApi.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query<TSettingsClientDTO, void>({
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
