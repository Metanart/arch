import { TASK_TYPE, TaskType } from '@arch/contracts'

import type { DirectoryTree } from '@domains/Shared'

type ErrorResponse = {
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
  response: BaseResponse<GType, GResponsePayload> | ErrorResponse
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
