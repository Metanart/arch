import { SettingsClientDTO, UpdateSettingsClientDTO } from '@arch/contracts'
import { IpcResponse } from '@arch/types'
import { getMessageFromError } from '@arch/utils'

import { SettingsRepository } from '../repository/SettingsRepository'

async function get(): Promise<IpcResponse<SettingsClientDTO>> {
  try {
    const settingsDto = await SettingsRepository.get()
    return { status: 'success', data: settingsDto }
  } catch (error: unknown) {
    return { status: 'error', error: { message: getMessageFromError(error) } }
  }
}

async function update(settings: UpdateSettingsClientDTO): Promise<IpcResponse<SettingsClientDTO>> {
  try {
    const settingsDto = await SettingsRepository.update(settings)
    return { status: 'success', data: settingsDto }
  } catch (error: unknown) {
    return { status: 'error', error: { message: getMessageFromError(error) } }
  }
}

export const SettingsIpcListeners = {
  get,
  update
}
