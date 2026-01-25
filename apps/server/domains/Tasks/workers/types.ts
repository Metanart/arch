import { TaskWorkerContracts } from './contracts'

export type TaskWorkerRequest = TaskWorkerContracts['request']
export type TaskWorkerResponse = TaskWorkerContracts['response']

export type TaskWorkerRequestByType<TaskType> = Extract<TaskWorkerRequest, { type: TaskType }>

export type TaskWorkerResponseByType<TaskType> = Extract<TaskWorkerResponse, { type: TaskType }>
