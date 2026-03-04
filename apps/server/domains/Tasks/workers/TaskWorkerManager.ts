import { TaskType } from '@arch/contracts'

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
  executeTask(input: { taskId: string; type: TaskType; payload: unknown }): Promise<void>

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
