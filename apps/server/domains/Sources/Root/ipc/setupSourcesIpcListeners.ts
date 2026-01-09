import { CreateSourceClientDTO, SourceServerDTO, UpdateSourceClientDTO } from '@arch/contracts'
import { SOURCES_IPC_CHANNELS } from '@arch/enums'

import { addIpcListener, addIpcListenerWithPayload } from '@domains/Shared'

import { SourcesIpcListeners } from './SourcesIpcListeners'

export function setupSourcesIpcListeners(): void {
  addIpcListener<SourceServerDTO[]>(SourcesIpcListeners.getAll, SOURCES_IPC_CHANNELS.GET_ALL)

  addIpcListenerWithPayload<SourceServerDTO, CreateSourceClientDTO>(
    SourcesIpcListeners.create,
    SOURCES_IPC_CHANNELS.CREATE
  )

  addIpcListenerWithPayload<SourceServerDTO, UpdateSourceClientDTO>(
    SourcesIpcListeners.update,
    SOURCES_IPC_CHANNELS.UPDATE
  )

  addIpcListenerWithPayload<boolean, string>(
    SourcesIpcListeners.remove,
    SOURCES_IPC_CHANNELS.REMOVE
  )
}
