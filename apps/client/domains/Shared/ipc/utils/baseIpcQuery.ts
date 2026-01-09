import { BaseQueryFn } from '@reduxjs/toolkit/query'

import { AppDomain, IpcChannel, IpcResponse } from '@arch/types'
import { AppError, getMessageFromError } from '@arch/utils'

export type IpcQueryArgs = {
  domain: AppDomain
  channel: IpcChannel
  payload?: unknown
}

export const baseIpcQuery: BaseQueryFn<IpcQueryArgs, unknown, string> = async ({
  domain,
  channel,
  payload
}) => {
  try {
    const ipcMethod = window.ipc?.[domain]?.[channel]

    if (typeof ipcMethod !== 'function') {
      throw new AppError({
        domain,
        code: '',
        layer: 'API',
        message: `API method with channel ${channel} not found`
      })
    }

    const response: IpcResponse<unknown> = await ipcMethod(payload)

    if (response.status === 'error') {
      return { error: response.error.message }
    }

    if (response.data === null || response.data === undefined) {
      return { error: 'Response is empty' }
    }

    return { data: response.data }
  } catch (error: unknown) {
    return { error: getMessageFromError(error) }
  }
}
