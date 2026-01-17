import { WORKER_MESSAGE_TYPE } from './enums'

export type WorkerMessage = { type: WORKER_MESSAGE_TYPE.SCAN; payload: { dir: string } }

export type WorkerResponse =
  | { type: WORKER_MESSAGE_TYPE.SCAN; payload: { dirTree: string } }
  | { type: WORKER_MESSAGE_TYPE.ERROR; payload: { message: string } }
