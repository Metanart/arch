import { TASK_TYPE } from '@arch/contracts'

type Request<Type extends string, Payload> = {
  type: Type
  payload: Payload
}

type RequestWithId<Type extends string, Payload> = {
  requestId: number
  type: Type
  payload: Payload
}

type Response<Type extends string, Payload> = {
  requestId: number
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
  [K in keyof Operations]: Request<K & string, Operations[K]['request']>
}[keyof Operations]

type RequestWithIdByType = {
  [K in keyof Operations]: RequestWithId<K & string, Operations[K]['request']>
}[keyof Operations]

type ResponseByType = {
  [K in keyof Operations]: Response<K & string, Operations[K]['response']>
}[keyof Operations]

export type TaskWorkerRequest = RequestByType

export type TaskWorkerRequestWithId = RequestWithIdByType

export type TaskWorkerErrorResponse = Response<'error', { message: string }>

export type TaskWorkerResponse = TaskWorkerErrorResponse | ResponseByType
