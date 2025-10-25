import { ipcRenderer } from 'electron'

import { ApiResponse, IpcTag } from '@arch/types'
import { createLog } from '@arch/utils'

export function createIpcInvoker<R>(tag: IpcTag): () => Promise<ApiResponse<R>> {
  return async function () {
    const log = createLog({ tag, category: 'PRELOAD' })
    log.info(`Invoked ${tag}`)
    return ipcRenderer.invoke(tag)
  }
}

export function createIpcInvokerWithPayload<R, P = void>(
  tag: IpcTag
): (payload: P) => Promise<ApiResponse<R>> {
  return async function (payload) {
    const log = createLog({ tag, category: 'PRELOAD' })

    if (!payload) {
      log.error(`Invoked ${tag} without payload`)
      return { data: null, error: `Invoked ${tag} without payload` }
    } else {
      log.info(`Invoked ${tag} with payload`, payload)
      return ipcRenderer.invoke(tag, payload)
    }
  }
}
