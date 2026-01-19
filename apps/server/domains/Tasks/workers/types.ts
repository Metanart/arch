import { TASK_TYPE } from '@arch/contracts'

type BaseMessage = {
  requestId: string
}

type Message<Type extends string, Payload> = BaseMessage & {
  type: Type
  payload: Payload
}

type Operations = {
  [TASK_TYPE.MULTIPLY]: {
    request: { value: number }
    response: { result: number }
  }
  [TASK_TYPE.SCAN_SOURCE]: {
    request: { dirPath: string }
    response: { dirTree: string }
  }
}

type RequestByType = {
  [K in keyof Operations]: Message<K & string, Operations[K]['request']>
}[keyof Operations]

type ResponseByType = {
  [K in keyof Operations]: Message<K & string, Operations[K]['response']>
}[keyof Operations]

export type TaskWorkerRequest = RequestByType

export type TaskWorkerErrorResponse = Message<'error', { message: string }>

export type TaskWorkerResponse = TaskWorkerErrorResponse | ResponseByType
