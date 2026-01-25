import { TASK_TYPE } from '@arch/contracts'

import { type DirectoryTree } from '@domains/Shared'

export type TaskWorkerContracts = {
  [TASK_TYPE.MULTIPLY]: {
    request: { value: number }
    response: { result: number }
  }
  [TASK_TYPE.SCAN_SOURCE]: {
    request: { dirPath: string }
    response: { dirTree: DirectoryTree }
  }
}
