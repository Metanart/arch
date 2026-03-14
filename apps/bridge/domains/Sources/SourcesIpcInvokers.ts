import { TCreateSourceClientDTO, TSourceClientDTO, TUpdateSourceClientDTO } from '@arch/contracts'
import { SOURCES_IPC_CHANNELS } from '@arch/enums'

import { createIpcInvoker, createIpcInvokerWithPayload } from '@domains/Shared'

export const sourcesIpcInvokers = {
  [SOURCES_IPC_CHANNELS.GET_ALL]: createIpcInvoker<TSourceClientDTO[]>(
    SOURCES_IPC_CHANNELS.GET_ALL
  ),
  [SOURCES_IPC_CHANNELS.CREATE]: createIpcInvokerWithPayload<
    TSourceClientDTO,
    TCreateSourceClientDTO
  >(SOURCES_IPC_CHANNELS.CREATE),
  [SOURCES_IPC_CHANNELS.UPDATE]: createIpcInvokerWithPayload<
    TSourceClientDTO,
    TUpdateSourceClientDTO
  >(SOURCES_IPC_CHANNELS.UPDATE),
  [SOURCES_IPC_CHANNELS.REMOVE]: createIpcInvokerWithPayload<boolean, string>(
    SOURCES_IPC_CHANNELS.REMOVE
  )
} as const

export type TSourcesIpcInvokers = typeof sourcesIpcInvokers
