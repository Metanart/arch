import {
  ESettingsMapperKeys,
  SettingsMapper,
  TSettingsClientDTO,
  TSettingsServerDTO,
  TSettingsUpdateClientDTO,
  TSettingsUpdateServerDTO
} from '@arch/contracts'
import { ApiDomain, ApiMethod } from '@arch/types'
import { createLog } from '@arch/utils'

import { SettingsApi, SettingsApiTags } from './SettingsApi'

type QueryReturn = {
  domain: ApiDomain
  method: ApiMethod
  payload: TSettingsUpdateServerDTO
}

function query(settingsUpdateFormDTO: TSettingsUpdateServerDTO): QueryReturn {
  const log = createLog({ tag: 'Config.update', category: 'RENDERER' })

  log.info('Received raw settings form', settingsUpdateFormDTO)

  const settingsUpdateDTO = SettingsMapper.map<TSettingsUpdateServerDTO, TSettingsUpdateClientDTO>(
    settingsUpdateFormDTO,
    ESettingsMapperKeys.SettingsUpdateServerDTO,
    ESettingsMapperKeys.SettingsUpdateClientDTO
  )

  log.success('Returning mapped settings form', settingsUpdateDTO)

  return {
    domain: 'Settings',
    method: 'update',
    payload: settingsUpdateDTO
  }
}

function transformResponse(settingsDto: TSettingsServerDTO): TSettingsClientDTO {
  const log = createLog({ tag: 'Config.get', category: 'RENDERER' })

  log.info('Received raw settings', settingsDto)

  const settingsFormDto = SettingsMapper.map<TSettingsServerDTO, TSettingsClientDTO>(
    settingsDto,
    ESettingsMapperKeys.SettingsServerDTO,
    ESettingsMapperKeys.SettingsClientDTO
  )

  log.success('Returning mapped settings form', settingsFormDto)

  return settingsFormDto
}

function invalidatesTags(result, error): SettingsApiTags[] {
  if (error || !result) return []

  return ['Settings']
}

export const { useUpdateSettingsMutation } = SettingsApi.injectEndpoints({
  endpoints: (builder) => ({
    updateSettings: builder.mutation<TSettingsClientDTO, TSettingsUpdateServerDTO>({
      query,
      transformResponse,
      invalidatesTags
    })
  })
})
