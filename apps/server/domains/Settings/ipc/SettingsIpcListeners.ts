import { TSettingsClientDTO, TUpdateSettingsClientDTO } from '@arch/contracts'
import { IpcResponse } from '@arch/types'
import { getMessageFromError } from '@arch/utils'

import { SettingsRepo } from '../repo/SettingsRepo'

async function get(): Promise<IpcResponse<TSettingsClientDTO>> {
  try {
    const settingsDto = await SettingsRepo.get()
    return { status: 'success', data: settingsDto }
  } catch (error: unknown) {
    return { status: 'error', error: { message: getMessageFromError(error) } }
  }
}

async function update(
  settings: TUpdateSettingsClientDTO
): Promise<IpcResponse<TSettingsClientDTO>> {
  try {
    const settingsDto = await SettingsRepo.update(settings)
    return { status: 'success', data: settingsDto }
  } catch (error: unknown) {
    return { status: 'error', error: { message: getMessageFromError(error) } }
  }
}

export const SettingsIpcListeners = {
  get,
  update
}
