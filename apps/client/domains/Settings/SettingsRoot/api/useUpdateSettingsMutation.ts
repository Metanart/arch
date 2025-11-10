import {
  TSettingsClientDTO,
  TSettingsServerDTO,
  TUpdateSettingsClientDTO,
  TUpdateSettingsServerDTO
} from '@arch/contracts'
import { ApiDomain, ApiMethod } from '@arch/types'
import { convertDto, createLog } from '@arch/utils'

import { SettingsApi, SettingsApiTags } from './SettingsApi'

type QueryReturn = {
  domain: ApiDomain
  method: ApiMethod
  payload: TUpdateSettingsServerDTO
}

function query(settingsUpdateClientDTO: TUpdateSettingsServerDTO): QueryReturn {
  const log = createLog({ tag: 'Config.update', category: 'RENDERER' })

  log.info('Received raw settings form', settingsUpdateClientDTO)

  const settingsUpdateServerDTO = convertDto<TUpdateSettingsClientDTO, TUpdateSettingsServerDTO>(
    settingsUpdateClientDTO
  )

  log.success('Returning mapped settings form', settingsUpdateServerDTO)

  return {
    domain: 'Settings',
    method: 'update',
    payload: settingsUpdateServerDTO
  }
}

function transformResponse(settingsServerDTO: TSettingsServerDTO): TSettingsClientDTO {
  const log = createLog({ tag: 'Config.get', category: 'RENDERER' })

  log.info('Received raw settings', settingsServerDTO)

  const settingsClientDTO = convertDto<TSettingsServerDTO, TSettingsClientDTO>(settingsServerDTO)

  log.success('Returning mapped settings form', settingsClientDTO)

  return settingsClientDTO
}

function invalidatesTags(result, error): SettingsApiTags[] {
  if (error || !result) return []

  return ['Settings']
}

export const { useUpdateSettingsMutation } = SettingsApi.injectEndpoints({
  endpoints: (builder) => ({
    updateSettings: builder.mutation<TSettingsClientDTO, TUpdateSettingsServerDTO>({
      query,
      transformResponse,
      invalidatesTags
    })
  })
})
