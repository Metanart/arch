import { resolve } from 'node:path'
import { Worker } from 'node:worker_threads'

import { AppContext } from '@arch/types'
import { AppError, createLogger, isObject, isString } from '@arch/utils'

import { createDeferredPromise } from 'domains/Shared/utils/createDeferredPromise'

import { TaskWorkerRequest, TaskWorkerResponse } from '../workers/types'

const appContext: AppContext = { domain: 'Tasks', layer: 'Worker', origin: 'TaskWorkerClient' }

const logger = createLogger(appContext)

function resolveTaskWorkerEntryPath(): string {
  return resolve(__dirname, 'workers', 'task-worker.js')
}

const DEFAULT_REQUEST_TIMEOUT_MS = 1_000

type PendingRequest = {
  request: TaskWorkerRequest
  promise: Promise<TaskWorkerResponse>
  resolve: (response: TaskWorkerResponse) => void
  reject: (error: Error) => void
  timeoutId: NodeJS.Timeout
}

export class TaskWorkerClient {
  private worker: Worker
  private pendingRequests = new Map<string, PendingRequest>()

  constructor() {
    this.worker = new Worker(resolveTaskWorkerEntryPath())
    this.worker.on('message', this.handleWorkerResponse.bind(this))
    this.worker.on('error', this.handleWorkerError.bind(this))
    this.worker.on('exit', this.handleWorkerExit.bind(this))
  }

  private getRequest(id: string): PendingRequest | undefined {
    return this.pendingRequests.get(id)
  }

  private deleteRequest(id: string) {
    const pendingRequest = this.getRequest(id)

    if (!pendingRequest) {
      logger.error('Worker request not found to delete', id)
      return
    }

    clearTimeout(pendingRequest.timeoutId)
    return this.pendingRequests.delete(id)
  }

  private setRequest(id: string, request: PendingRequest) {
    if (this.pendingRequests.has(id)) {
      throw new AppError({
        ...appContext,
        code: 'WORKER_REQUEST_ALREADY_SET',
        message: `Worker request already set with id ${id}`,
        details: { id }
      })
    }

    this.pendingRequests.set(id, request)

    return this
  }

  public sendWorkerRequest(
    request: TaskWorkerRequest,
    timeoutMs: number = DEFAULT_REQUEST_TIMEOUT_MS
  ): Promise<TaskWorkerResponse> {
    const existingRequest = this.getRequest(request.id)

    if (existingRequest) {
      return existingRequest.promise
    }

    const deferredPromise = createDeferredPromise<TaskWorkerResponse>()

    const { promise, resolve, reject } = deferredPromise

    const rejectOnTimeout = () => {
      this.deleteRequest(request.id)

      reject(
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

    try {
      this.setRequest(request.id, newPendingRequest)
      this.worker.postMessage(request)
    } catch (error) {
      this.deleteRequest(request.id)
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
      isString((message as any).id) &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      isString((message as any).type) &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      isObject((message as any).payload)
    )
  }

  private handleWorkerResponse(response: TaskWorkerResponse) {
    // @TODO: Add ZOD schema validation for the response

    if (!this.isValidResponse(response)) {
      logger.error('Worker response is not valid', response)
      return
    }

    if (response.type === 'error') {
      logger.error('Worker response received an error for request with id', response.id)
      this.failPendingRequest(
        response.id,
        new AppError({
          ...appContext,
          code: 'WORKER_RESPONSE_ERROR',
          message: 'Worker response error',
          details: { response }
        })
      )
      return
    }

    const pendingRequest = this.getRequest(response.id)

    if (!pendingRequest) {
      logger.error('Worker response received for unknown request', response)
      return
    }

    this.deleteRequest(response.id)
    pendingRequest.resolve(response)
  }

  private failAllPendingRequests(code: number) {
    this.pendingRequests.forEach((pendingRequest) => {
      this.failPendingRequest(
        pendingRequest.request.id,
        new AppError({
          ...appContext,
          code: 'WORKER_EXITED',
          message: 'Worker exited',
          details: { code }
        })
      )
    })
  }

  private failPendingRequest(id: string, error: Error) {
    const pendingRequest = this.getRequest(id)

    if (!pendingRequest) {
      logger.error('Worker request not found to fail', id)
      return
    }

    this.deleteRequest(id)
    pendingRequest.reject(error)
  }

  private handleWorkerError(error: Error) {
    this.failAllPendingRequests(1)
    logger.error('Worker error', error)
  }

  private handleWorkerExit(code: number) {
    logger.error('Worker exited with code', code)
    this.failAllPendingRequests(code)
  }

  public async terminateWorker() {
    this.failAllPendingRequests(0)
    const terminated = await this.worker.terminate()
    logger.log('Worker terminated with code', terminated)
  }
}
