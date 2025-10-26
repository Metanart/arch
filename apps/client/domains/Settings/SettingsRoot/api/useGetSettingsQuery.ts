import {
  ESettingsMapperKeys,
  SettingsMapper,
  TSettingsClientDTO,
  TSettingsServerDTO
} from '@arch/contracts'
import { ApiDomain, ApiMethod } from '@arch/types'
import { createLog } from '@arch/utils'

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

function transformResponse(settingsDto: TSettingsServerDTO): TSettingsClientDTO {
  const log = createLog({ tag: 'Settings.get', category: 'RENDERER' })

  log.info('Received raw settings', settingsDto)

  const settingsFormDto = SettingsMapper.map<TSettingsServerDTO, TSettingsClientDTO>(
    settingsDto,
    ESettingsMapperKeys.SettingsServerDTO,
    ESettingsMapperKeys.SettingsClientDTO
  )

  log.success('Returning mapped settings form', settingsFormDto)

  return settingsFormDto
}

const providesTags: SettingsApiTags[] = ['Settings']

export const { useGetSettingsQuery } = SettingsApi.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query<TSettingsClientDTO, void>({ query, transformResponse, providesTags })
  })
})
