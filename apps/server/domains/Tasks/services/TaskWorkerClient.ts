import { resolve } from 'node:path'
import { Worker } from 'node:worker_threads'

import { AppContext } from '@arch/types'
import { AppError, createLogger, isNumber, isObject, isString } from '@arch/utils'

import { createDeferredPromise } from '@domains/Shared'

import { TaskWorkerRequest, TaskWorkerResponse } from '../workers/types'

const appContext: AppContext = { domain: 'Tasks', layer: 'Worker', origin: 'TaskWorkerClient' }

const logger = createLogger(appContext)

function resolveTaskWorkerEntryPath(): string {
  return resolve(__dirname, 'workers', 'task-worker.js')
}

const DEFAULT_REQUEST_TIMEOUT_MS = 5_000

type PendingRequest = {
  request: TaskWorkerRequest
  promise: Promise<TaskWorkerResponse>
  resolve: (response: TaskWorkerResponse) => void
  reject: (error: Error) => void
  timeoutId: NodeJS.Timeout
}

class TaskWorkerClient {
  private worker: Worker
  private isTerminated: boolean = false
  private pendingRequests = new Map<number, PendingRequest>()
  private lastRequestId: number = 0

  constructor() {
    this.worker = new Worker(resolveTaskWorkerEntryPath())
    this.worker.on('message', this.handleWorkerResponse.bind(this))
    this.worker.on('error', this.handleWorkerError.bind(this))
    this.worker.on('exit', this.handleWorkerExit.bind(this))
  }

  private getRequest(requestId: number): PendingRequest | undefined {
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

  private setRequest(requestId: number, request: PendingRequest) {
    if (this.pendingRequests.has(requestId)) {
      throw new AppError({
        ...appContext,
        code: 'WORKER_REQUEST_ALREADY_SET',
        message: `Worker request already set with id ${requestId}`,
        details: { requestId }
      })
    }

    this.pendingRequests.set(requestId, request)

    return this
  }

  public sendRequest(
    request: TaskWorkerRequest,
    timeoutMs: number = DEFAULT_REQUEST_TIMEOUT_MS
  ): Promise<TaskWorkerResponse> {
    if (this.isTerminated) {
      throw new AppError({
        ...appContext,
        code: 'WORKER_TERMINATED',
        message: 'Worker terminated'
      })
    }

    const deferredPromise = createDeferredPromise<TaskWorkerResponse>()

    const { promise, resolve, reject } = deferredPromise

    const requestId = this.lastRequestId++

    const rejectOnTimeout = () => {
      this.failPendingRequest(
        requestId,
        new AppError({
          ...appContext,
          code: 'WORKER_REQUEST_TIMEOUT',
          message: `Worker request timed out after ${timeoutMs}ms`,
          details: { request, timeoutMs }
        })
      )
    }

    const timeoutId = setTimeout(rejectOnTimeout, timeoutMs)

    const newPendingRequest: PendingRequest = {
      request,
      promise,
      resolve,
      reject,
      timeoutId
    }

    const message = { ...request, requestId }

    try {
      this.setRequest(requestId, newPendingRequest)
      this.worker.postMessage(message)
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
    const terminated = await this.worker.terminate()
    this.isTerminated = true
    logger.log('Worker terminated with code', terminated)
  }
}

export const taskWorkerClient = new TaskWorkerClient()
