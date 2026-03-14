import { TTaskType } from '@arch/contracts'

import { TaskWorkerClient } from './TaskWorkerClient'

type TQueuedTask = { taskId: string; type: TTaskType; payload: unknown }
type TBusyEntry = { taskId: string; startMs: number }

export interface ITaskWorkerManager {
  /**
   * Запустить пул воркеров
   */
  start(): Promise<void>

  /**
   * Остановить пул воркеров
   */
  stop(): Promise<void>

  /**
   * Проверить есть ли свободный воркер
   */
  hasAvailableWorker(): boolean

  /**
   * Получить количество активных воркеров
   */
  getActiveWorkerCount(): number

  /**
   * Получить максимальное количество воркеров
   */
  getMaxWorkers(): number

  /**
   * Отправить задачу на выполнение
   */
  executeTask(input: { taskId: string; type: TTaskType; payload: unknown }): Promise<void>

  /**
   * Подписаться на событие успешного выполнения задачи
   */
  onTaskCompleted(
    handler: (event: { taskId: string; result?: unknown; durationMs: number }) => Promise<void>
  ): void

  /**
   * Подписаться на событие ошибки выполнения задачи
   */
  onTaskFailed(
    handler: (event: { taskId: string; error: Error; durationMs: number }) => Promise<void>
  ): void

  /**
   * Подписаться на прогресс выполнения задачи
   */
  onTaskProgress(
    handler: (event: {
      taskId: string
      step?: string
      progressCurrent?: number
      progressTotal?: number
    }) => Promise<void>
  ): void
}

const DEFAULT_MAX_WORKERS = 4

type TCompletedHandler = (event: {
  taskId: string
  result?: unknown
  durationMs: number
}) => Promise<void>
type TFailedHandler = (event: {
  taskId: string
  error: Error
  durationMs: number
}) => Promise<void>
type TProgressHandler = (event: {
  taskId: string
  step?: string
  progressCurrent?: number
  progressTotal?: number
}) => Promise<void>

export class TaskWorkerManager implements ITaskWorkerManager {
  private readonly maxWorkers: number
  private workers: TaskWorkerClient[] = []
  private busy = new Map<TaskWorkerClient, TBusyEntry>()
  private taskQueue: TQueuedTask[] = []
  private completedHandlers: TCompletedHandler[] = []
  private failedHandlers: TFailedHandler[] = []
  private progressHandlers: TProgressHandler[] = []
  private started = false

  constructor(options: { maxWorkers?: number } = {}) {
    this.maxWorkers = options.maxWorkers ?? DEFAULT_MAX_WORKERS
  }

  async start(): Promise<void> {
    if (this.started) return
    this.workers = Array.from({ length: this.maxWorkers }, () => new TaskWorkerClient())
    this.started = true
  }

  async stop(): Promise<void> {
    if (!this.started) return
    await Promise.all(this.workers.map((w) => w.terminate()))
    this.workers = []
    this.busy.clear()
    this.taskQueue = []
    this.started = false
  }

  hasAvailableWorker(): boolean {
    return this.started && this.busy.size < this.workers.length
  }

  getActiveWorkerCount(): number {
    return this.busy.size
  }

  getMaxWorkers(): number {
    return this.maxWorkers
  }

  executeTask(input: { taskId: string; type: TTaskType; payload: unknown }): Promise<void> {
    if (!this.started || this.workers.length === 0) {
      return Promise.resolve()
    }
    if (this.hasAvailableWorker()) {
      this.runOnIdleWorker(input)
      return Promise.resolve()
    }
    this.taskQueue.push(input)
    return Promise.resolve()
  }

  onTaskCompleted(
    handler: (event: { taskId: string; result?: unknown; durationMs: number }) => Promise<void>
  ): void {
    this.completedHandlers.push(handler)
  }

  onTaskFailed(
    handler: (event: { taskId: string; error: Error; durationMs: number }) => Promise<void>
  ): void {
    this.failedHandlers.push(handler)
  }

  onTaskProgress(
    handler: (event: {
      taskId: string
      step?: string
      progressCurrent?: number
      progressTotal?: number
    }) => Promise<void>
  ): void {
    this.progressHandlers.push(handler)
  }

  private getIdleWorker(): TaskWorkerClient | undefined {
    return this.workers.find((w) => !this.busy.has(w))
  }

  private runOnIdleWorker(input: TQueuedTask): void {
    const worker = this.getIdleWorker()
    if (!worker) return
    const startMs = Date.now()
    this.busy.set(worker, { taskId: input.taskId, startMs })
    worker
      .sendRequest(input.type, input.payload as object)
      .then((response) => {
        const entry = this.busy.get(worker)
        this.busy.delete(worker)
        const durationMs = Date.now() - startMs
        const result = 'payload' in response ? (response as { payload: unknown }).payload : undefined
        this.emitCompleted({
          taskId: entry?.taskId ?? input.taskId,
          result,
          durationMs
        })
        this.processQueue()
      })
      .catch((error) => {
        const entry = this.busy.get(worker)
        this.busy.delete(worker)
        const durationMs = Date.now() - startMs
        this.emitFailed({
          taskId: entry?.taskId ?? input.taskId,
          error: error instanceof Error ? error : new Error(String(error)),
          durationMs
        })
        this.processQueue()
      })
  }

  private processQueue(): void {
    while (this.taskQueue.length > 0 && this.hasAvailableWorker()) {
      const next = this.taskQueue.shift()
      if (next) this.runOnIdleWorker(next)
    }
  }

  private emitCompleted(event: {
    taskId: string
    result?: unknown
    durationMs: number
  }): void {
    for (const h of this.completedHandlers) {
      h(event).catch(() => {})
    }
  }

  private emitFailed(event: {
    taskId: string
    error: Error
    durationMs: number
  }): void {
    for (const h of this.failedHandlers) {
      h(event).catch(() => {})
    }
  }
}
