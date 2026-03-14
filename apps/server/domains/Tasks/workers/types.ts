import { TTaskWorkerContracts } from './contracts'

export type TTaskWorkerRequest = TTaskWorkerContracts['request']
export type TTaskWorkerResponse = TTaskWorkerContracts['response']

export type TTaskWorkerRequestByType<GTaskType> = Extract<TTaskWorkerRequest, { type: GTaskType }>

export type TTaskWorkerResponseByType<GTaskType> = Extract<TTaskWorkerResponse, { type: GTaskType }>
