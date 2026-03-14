import {
  TCreateTasksWorkflowServerDTO,
  TTasksWorkflowServerDTO,
  TasksWorkflowServerSchema,
  TUpdateTasksWorkflowServerDTO
} from '@arch/contracts'

import { createEntity, findEntities, findEntity, removeEntity, updateEntity } from '@domains/Shared'

import { TasksWorkflowEntity } from '../entities/TasksWorkflowEntity'

async function createTasksWorkflow(
  tasksWorkflowDto: TCreateTasksWorkflowServerDTO
): Promise<TTasksWorkflowServerDTO> {
  return createEntity<TasksWorkflowEntity, TTasksWorkflowServerDTO>(
    TasksWorkflowEntity,
    TasksWorkflowServerSchema,
    tasksWorkflowDto
  )
}

async function getAllTasksWorkflows(): Promise<TTasksWorkflowServerDTO[]> {
  return findEntities<TasksWorkflowEntity, TTasksWorkflowServerDTO>(
    TasksWorkflowEntity,
    TasksWorkflowServerSchema
  )
}

async function getTasksWorkflowById(id: string): Promise<TTasksWorkflowServerDTO> {
  return findEntity<TasksWorkflowEntity, TTasksWorkflowServerDTO>(
    TasksWorkflowEntity,
    TasksWorkflowServerSchema,
    { id }
  )
}

async function updateTasksWorkflow(
  tasksWorkflowDto: TUpdateTasksWorkflowServerDTO
): Promise<TTasksWorkflowServerDTO> {
  return updateEntity<TasksWorkflowEntity, TTasksWorkflowServerDTO>(
    TasksWorkflowEntity,
    TasksWorkflowServerSchema,
    { id: tasksWorkflowDto.id },
    tasksWorkflowDto
  )
}

async function removeTasksWorkflow(id: string): Promise<boolean> {
  return removeEntity<TasksWorkflowEntity>(TasksWorkflowEntity, { id })
}

export const TasksWorkflowRepo = {
  create: createTasksWorkflow,
  getAll: getAllTasksWorkflows,
  getById: getTasksWorkflowById,
  update: updateTasksWorkflow,
  remove: removeTasksWorkflow
}
