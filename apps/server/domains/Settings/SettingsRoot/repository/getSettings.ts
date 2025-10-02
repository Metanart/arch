import { IsNull, Not } from 'typeorm'

import { createLog } from '@arch/shared'
import { AppDataSource } from '@server/App/AppRoot'

import { SettingsMapper } from '../mappers/SettingsMapper'
import { SettingsEntity } from '../entities/SettingsEntity'
import { SETTINGS_CONTRACTS_KEYS, SettingsDTO } from '../contracts/SettingsContracts'

const repo = AppDataSource.getRepository(SettingsEntity)

export async function getSettings(): Promise<SettingsDTO> {
  const log = createLog({ tag: 'SettingsRepo.getSettings' })

  let settings: SettingsEntity | null

  try {
    settings = await repo.findOne({
      where: {
        id: Not(IsNull())
      }
    })
  } catch (error) {
    log.error('Failed to query settings from database:', (error as Error).message)
    throw new Error('Error getting configuration from database')
  }

  if (!settings) {
    log.warn('No settings found — creating new default settings')
    try {
      const newSettings = repo.create()
      settings = await repo.save(newSettings)
      log.success('New default settings saved', settings)
    } catch (error) {
      log.error('Failed to create new settings:', (error as Error).message)
      throw new Error('Failed to create new configuration')
    }
  } else {
    log.info('Existing settings retrieved', settings)
  }

  let mappedDTO: SettingsDTO

  try {
    mappedDTO = SettingsMapper.map<SettingsEntity, SettingsDTO>(
      settings,
      SETTINGS_CONTRACTS_KEYS.SettingsEntity,
      SETTINGS_CONTRACTS_KEYS.SettingsDTO
    )
    log.info('Mapped settings to DTO', mappedDTO)
  } catch (error) {
    log.error('Failed to map settings to DTO:', (error as Error).message)
    throw new Error('Failed to map settings')
  }

  return mappedDTO
}
