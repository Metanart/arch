import { TASK_TYPE, TTaskType } from '@arch/contracts'

import type { TDirectoryTree } from '@domains/Shared'

type TErrorResponse = {
  requestId: number
  type: 'error'
  payload: {
    message: string
  }
}

type TBaseResponse<GType extends TTaskType, GResponsePayload> = {
  requestId: number
  type: GType
  payload: GResponsePayload
}

type TBaseRequest<GType extends TTaskType, GRequestPayload> = {
  requestId: number
  type: GType
  payload: GRequestPayload
}

type TBaseContract<GType extends TTaskType, GRequestPayload, GResponsePayload> = {
  request: TBaseRequest<GType, GRequestPayload>
  response: TBaseResponse<GType, GResponsePayload> | TErrorResponse
}

type TMultiplyContract = TBaseContract<
  typeof TASK_TYPE.MULTIPLY,
  { value: number },
  { result: number }
>

type TScanSourceContract = TBaseContract<
  typeof TASK_TYPE.SCAN_SOURCE,
  { dirPath: string },
  { dirTree: TDirectoryTree }
>

export type TTaskWorkerContracts = TMultiplyContract | TScanSourceContract
