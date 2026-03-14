import { TASK_TYPE, TaskType } from '@arch/contracts'

import type { TDirectoryTree } from '@domains/Shared'

type TErrorResponse = {
  requestId: number
  type: 'error'
  payload: {
    message: string
  }
}

type BaseResponse<GType extends TaskType, GResponsePayload> = {
  requestId: number
  type: GType
  payload: GResponsePayload
}

type BaseRequest<GType extends TaskType, GRequestPayload> = {
  requestId: number
  type: GType
  payload: GRequestPayload
}

type BaseContract<GType extends TaskType, GRequestPayload, GResponsePayload> = {
  request: BaseRequest<GType, GRequestPayload>
  response: BaseResponse<GType, GResponsePayload> | TErrorResponse
}

type TMultiplyContract = BaseContract<
  typeof TASK_TYPE.MULTIPLY,
  { value: number },
  { result: number }
>

type TScanSourceContract = BaseContract<
  typeof TASK_TYPE.SCAN_SOURCE,
  { dirPath: string },
  { dirTree: TDirectoryTree }
>

export type TTaskWorkerContracts = TMultiplyContract | TScanSourceContract
