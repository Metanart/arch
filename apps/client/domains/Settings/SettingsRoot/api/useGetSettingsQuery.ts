import { TSettingsClientDTO, TSettingsServerDTO } from '@arch/contracts'
import { ApiDomain, ApiMethod } from '@arch/types'
import { convertDto, createLog } from '@arch/utils'

import { SettingsApi, SettingsApiTags } from './SettingsApi'

type QueryReturn = {
  domain: ApiDomain
  method: ApiMethod
}

function query(): QueryReturn {
  return {
    domain: 'Settings',
    method: 'get'
  }
}

function transformResponse(settingsServerDto: TSettingsServerDTO): TSettingsClientDTO {
  const log = createLog({ tag: 'Settings.get', category: 'RENDERER' })

  log.info('Received raw settings', settingsServerDto)

  const settingsClientDto = convertDto<TSettingsServerDTO, TSettingsClientDTO>(settingsServerDto)

  log.success('Returning mapped settings client DTO', settingsClientDto)

  return settingsClientDto
}

const providesTags: SettingsApiTags[] = ['Settings']

export const { useGetSettingsQuery } = SettingsApi.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query<TSettingsClientDTO, void>({ query, transformResponse, providesTags })
  })
})
