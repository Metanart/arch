import { TTasksWorkflowStatus } from '@arch/contracts'

import { TasksWorkflowEntity } from '../entities/TasksWorkflowEntity'

export interface ITasksWorkflowService {
  /**
   * Создать новый workflow
   */
  createWorkflow(input: { name: string; sourceId?: string | null }): Promise<TasksWorkflowEntity>

  /**
   * Получить workflow по id
   */
  getWorkflowById(workflowId: string): Promise<TasksWorkflowEntity | null>

  /**
   * Получить workflow вместе с задачами
   */
  getWorkflowWithTasks(workflowId: string): Promise<TasksWorkflowEntity | null>

  /**
   * Получить все workflow
   */
  listWorkflows(input?: {
    status?: TTasksWorkflowStatus
    sourceId?: string
    limit?: number
    offset?: number
  }): Promise<TasksWorkflowEntity[]>

  /**
   * Обновить статус workflow
   */
  updateWorkflowStatus(workflowId: string, status: TTasksWorkflowStatus): Promise<void>

  /**
   * Отменить workflow
   * (обычно переводит задачи в canceling / canceled)
   */
  cancelWorkflow(workflowId: string): Promise<void>

  /**
   * Удалить workflow
   * (каскадно удаляет задачи)
   */
  deleteWorkflow(workflowId: string): Promise<void>
}
