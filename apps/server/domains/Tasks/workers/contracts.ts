import { TASK_TYPE, TaskType } from '@arch/contracts'

import type { DirectoryTree } from '@domains/Shared'

type ErrorResponse = {
  requestId: number
  type: 'error'
  payload: {
    message: string
  }
}

type BaseResponse<TType extends TaskType, TResponsePayload> = {
  requestId: number
  type: TType
  payload: TResponsePayload
}

type BaseRequest<TType extends TaskType, TRequestPayload> = {
  requestId: number
  type: TType
  payload: TRequestPayload
}

type BaseContract<TType extends TaskType, TRequestPayload, TResponsePayload> = {
  request: BaseRequest<TType, TRequestPayload>
  response: BaseResponse<TType, TResponsePayload> | ErrorResponse
}

type MultiplyContract = BaseContract<
  typeof TASK_TYPE.MULTIPLY,
  { value: number },
  { result: number }
>

type ScanSourceContract = BaseContract<
  typeof TASK_TYPE.SCAN_SOURCE,
  { dirPath: string },
  { dirTree: DirectoryTree }
>

export type TaskWorkerContracts = MultiplyContract | ScanSourceContract
