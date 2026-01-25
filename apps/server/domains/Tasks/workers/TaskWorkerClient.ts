import { resolve } from 'node:path'
import { Worker } from 'node:worker_threads'

import { app } from 'electron'

import { TaskType } from '@arch/contracts'
import { AppContext } from '@arch/types'
import { AppError, createLogger, isNumber, isObject, isString } from '@arch/utils'

import { createDeferredPromise } from '@domains/Shared'

import { TaskWorkerRequestByType, TaskWorkerResponse, TaskWorkerResponseByType } from './types'

const appContext: AppContext = { domain: 'Tasks', layer: 'Worker', origin: 'TaskWorkerClient' }

const logger = createLogger(appContext)

function resolveTaskWorkerEntryPath(): string {
  if (!app.isReady()) {
    throw new Error('Cannot resolve worker path before app is ready')
  }

  return resolve(app.getAppPath(), 'build', 'main', 'workers', 'task-worker.js')
}

const DEFAULT_REQUEST_TIMEOUT_MS = 5_000

type PendingRequest<TType extends TaskType> = {
  request: TaskWorkerRequestByType<TType>
  promise: Promise<TaskWorkerResponseByType<TType>>
  resolve: (value: TaskWorkerResponseByType<TType>) => void
  reject: (error: Error) => void
  timeoutId: NodeJS.Timeout
}

class TaskWorkerClient {
  private isTerminated: boolean = false
  private pendingRequests = new Map<number, PendingRequest<TaskType>>()
  private lastRequestId: number = 0
  private worker: Worker | null = null

  constructor() {
    this.isTerminated = false
  }

  private ensureWorker(): Worker {
    if (this.isTerminated) {
      throw new AppError({ ...appContext, code: 'WORKER_TERMINATED', message: 'Worker terminated' })
    }

    if (this.worker) return this.worker

    const entryPath = resolveTaskWorkerEntryPath()
    logger.log('Starting worker from', entryPath)

    const worker = new Worker(entryPath)

    worker.on('message', (message) => this.handleWorkerResponse(message))
    worker.on('error', (error) => this.handleWorkerError(error))
    worker.on('exit', (code) => this.handleWorkerExit(code))

    this.worker = worker
    return worker
  }

  private getRequest(requestId: number): PendingRequest<TaskType> | undefined {
    return this.pendingRequests.get(requestId)
  }

  private deleteRequest(requestId: number) {
    const pendingRequest = this.getRequest(requestId)

    if (!pendingRequest) {
      logger.error('Worker request not found to delete', requestId)
      return
    }

    clearTimeout(pendingRequest.timeoutId)
    return this.pendingRequests.delete(requestId)
  }

  private setRequest<TType extends TaskType>(
    requestId: number,
    pendingRequest: PendingRequest<TType>
  ) {
    if (this.pendingRequests.has(requestId)) {
      throw new AppError({
        ...appContext,
        code: 'WORKER_REQUEST_ALREADY_SET',
        message: `Worker request already set with id ${requestId}`,
        details: { requestId }
      })
    }

    this.pendingRequests.set(requestId, pendingRequest as unknown as PendingRequest<TaskType>)

    return this
  }

  makeRequest<TType extends TaskType>(
    requestId: number,
    type: TType,
    payload: TaskWorkerRequestByType<TType>['payload']
  ): TaskWorkerRequestByType<TType> {
    // @TODO: Fix later
    // Intentional casting - dont have time to deal with it now
    return { requestId, type, payload } as TaskWorkerRequestByType<TType>
  }

  public sendRequest<TType extends TaskType>(
    type: TType,
    payload: TaskWorkerRequestByType<TType>['payload'],
    timeoutMs: number = DEFAULT_REQUEST_TIMEOUT_MS
  ): Promise<TaskWorkerResponseByType<TType>> {
    const worker = this.ensureWorker()

    const { promise, resolve, reject } = createDeferredPromise<TaskWorkerResponseByType<TType>>()

    const requestId = this.lastRequestId++

    const request = this.makeRequest(requestId, type, payload)

    const rejectOnTimeout = () => {
      this.failPendingRequest(
        requestId,
        new AppError({
          ...appContext,
          code: 'WORKER_REQUEST_TIMEOUT',
          message: `Worker request timed out after ${timeoutMs}ms`,
          details: { request: request, timeoutMs }
        })
      )
    }

    const timeoutId = setTimeout(rejectOnTimeout, timeoutMs)

    const newPendingRequest: PendingRequest<TType> = {
      request: request,
      promise,
      resolve,
      reject,
      timeoutId
    }

    try {
      this.setRequest(requestId, newPendingRequest)
      worker.postMessage(request)
    } catch (error) {
      this.deleteRequest(requestId)
      reject(
        new AppError({
          ...appContext,
          code: 'WORKER_REQUEST_SET_FAILED',
          message: 'Worker request set failed',
          details: { request, error }
        })
      )
    }

    return promise
  }

  private isValidResponse(message: unknown): message is TaskWorkerResponse {
    return (
      isObject(message) &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      isNumber((message as any).requestId) &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      isString((message as any).type) &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      isObject((message as any).payload)
    )
  }

  private handleWorkerResponse(message: unknown) {
    // @TODO: Add ZOD schema validation for the response

    if (!this.isValidResponse(message)) {
      logger.error('Worker response is not valid', message)
      return
    }

    const response: TaskWorkerResponse = message

    if (response.type === 'error') {
      logger.error('Worker response received an error for request with id', response.requestId)
      this.failPendingRequest(
        response.requestId,
        new AppError({
          ...appContext,
          code: 'WORKER_RESPONSE_ERROR',
          message: 'Worker response error',
          details: { response }
        })
      )
      return
    }

    const pendingRequest = this.getRequest(response.requestId)

    if (!pendingRequest) {
      logger.error('Worker response received for unknown request', response)
      return
    }

    this.deleteRequest(response.requestId)
    pendingRequest.resolve(response)
  }

  private failAllPendingRequests(code: number) {
    const error = new AppError({
      ...appContext,
      code: 'WORKER_EXITED',
      message: 'Worker exited',
      details: { code }
    })

    for (const requestId of Array.from(this.pendingRequests.keys())) {
      this.failPendingRequest(requestId, error)
    }
  }

  private failPendingRequest(requestId: number, error: Error) {
    const pendingRequest = this.getRequest(requestId)

    if (!pendingRequest) {
      logger.error('Worker request not found to fail', requestId)
      return
    }

    this.deleteRequest(requestId)
    pendingRequest.reject(error)
  }

  private handleWorkerError(error: Error) {
    logger.error('Worker error', error)
    this.failAllPendingRequests(1)
  }

  private handleWorkerExit(code: number) {
    logger.error('Worker exited with code', code)
    this.failAllPendingRequests(code)
  }

  public async terminate() {
    this.failAllPendingRequests(0)

    const worker = this.worker
    this.worker = null
    this.isTerminated = true

    if (worker) {
      const code = await worker.terminate()
      logger.log('Worker terminated with code', code)
    }
  }
}

export const taskWorkerClient = new TaskWorkerClient()
