import { TaskWorkerContracts } from './contracts'

export type TaskWorkerRequest = TaskWorkerContracts['request']
export type TaskWorkerResponse = TaskWorkerContracts['response']

export type TaskWorkerRequestByType<GTaskType> = Extract<TaskWorkerRequest, { type: GTaskType }>

export type TaskWorkerResponseByType<GTaskType> = Extract<TaskWorkerResponse, { type: GTaskType }>
