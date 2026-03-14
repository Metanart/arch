import { TTaskWorkerContracts } from './contracts'

export type TTaskWorkerRequest = TTaskWorkerContracts['request']
export type TTaskWorkerResponse = TTaskWorkerContracts['response']

export type TaskWorkerRequestByType<GTaskType> = Extract<TTaskWorkerRequest, { type: GTaskType }>

export type TaskWorkerResponseByType<GTaskType> = Extract<TTaskWorkerResponse, { type: GTaskType }>
