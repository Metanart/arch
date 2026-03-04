import { TaskType } from '@arch/contracts'

import { TaskEntity } from '../../entities/TaskEntity'

export interface ITaskService {
  /**
   * Создать одну задачу в рамках workflow
   */
  createTask(input: {
    workflowId: string
    type: TaskType
    payload: unknown
    priority?: number
    predictedWeight?: number
    maxAttempts?: number
    dependsOnTaskIds?: string[]
  }): Promise<TaskEntity>

  /**
   * Создать несколько задач атомарно (например, DAG одного архива)
   */
  createTasksBatch(input: {
    workflowId: string
    tasks: Array<{
      type: TaskType
      payload: unknown
      priority?: number
      predictedWeight?: number
      maxAttempts?: number
      dependsOnTaskIds?: string[]
    }>
  }): Promise<TaskEntity[]>

  /**
   * Попытаться забрать следующую runnable задачу
   * Учитывает:
   * - status = queued
   * - nextRunAt <= now
   * - lease expired
   * - dependencies resolved
   */
  claimNextRunnableTask(input: {
    workerId: string
    now: Date
    leaseDurationMs: number
  }): Promise<TaskEntity | null>

  /**
   * Продлить lease активной задачи
   */
  heartbeat(input: {
    taskId: string
    workerId: string
    now: Date
    leaseDurationMs: number
  }): Promise<void>

  /**
   * Отметить задачу как завершённую
   */
  completeTask(input: { taskId: string; workerId: string; finishedAt: Date }): Promise<void>

  /**
   * Отметить задачу как упавшую
   * Должна:
   * - увеличить attempts
   * - вычислить nextRunAt (backoff)
   * - если attempts >= maxAttempts → статус failed
   */
  failTask(input: { taskId: string; workerId: string; error: string; now: Date }): Promise<void>

  /**
   * Поставить задачу на паузу
   * Пауза должна быть допустима только в определённых состояниях
   */
  pauseTask(taskId: string): Promise<void>

  /**
   * Возобновить paused задачу
   */
  resumeTask(taskId: string): Promise<void>

  /**
   * Отменить задачу
   * Может переводить в canceling или сразу в failed/canceled
   */
  cancelTask(taskId: string): Promise<void>

  /**
   * Получить задачу по id
   */
  getTaskById(taskId: string): Promise<TaskEntity | null>

  /**
   * Получить все задачи workflow
   */
  getTasksByWorkflow(workflowId: string): Promise<TaskEntity[]>

  /**
   * Проверить, разрешены ли зависимости для задачи
   */
  areDependenciesResolved(taskId: string): Promise<boolean>
}
