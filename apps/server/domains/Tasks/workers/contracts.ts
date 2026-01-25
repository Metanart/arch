import { TASK_TYPE, TaskType } from '@arch/contracts'

import type { DirectoryTree } from '@domains/Shared'

type ErrorResponse = {
  requestId: number
  type: 'error'
  payload: {
    message: string
  }
}

type BaseContract<TType extends TaskType, TRequestPayload, TResponsePayload> = {
  request: {
    requestId: number
    type: TType
    payload: TRequestPayload
  }
  response:
  | {
    requestId: number
    type: TType
    payload: TResponsePayload
  }
  | ErrorResponse
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
