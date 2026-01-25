import { TaskWorkerContracts } from './contracts'

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

type RequestByType = {
  [K in keyof TaskWorkerContracts]: Request<K & string, TaskWorkerContracts[K]['request']>
}[keyof TaskWorkerContracts]

type RequestWithIdByType = {
  [K in keyof TaskWorkerContracts]: RequestWithId<K & string, TaskWorkerContracts[K]['request']>
}[keyof TaskWorkerContracts]

type ResponseByType = {
  [K in keyof TaskWorkerContracts]: Response<K & string, TaskWorkerContracts[K]['response']>
}[keyof TaskWorkerContracts]

export type TaskWorkerRequest = RequestByType

export type TaskWorkerRequestWithId = RequestWithIdByType

export type TaskWorkerErrorResponse = Response<'error', { message: string }>

export type TaskWorkerResponse = TaskWorkerErrorResponse | ResponseByType
