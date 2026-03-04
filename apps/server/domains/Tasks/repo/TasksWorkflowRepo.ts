import {
  CreateTasksWorkflowServerDTO,
  TasksWorkflowServerDTO,
  TasksWorkflowServerSchema,
  UpdateTasksWorkflowServerDTO
} from '@arch/contracts'

import { createEntity, findEntities, findEntity, removeEntity, updateEntity } from '@domains/Shared'

import { TasksWorkflowEntity } from '../entities/TasksWorkflowEntity'

async function createTasksWorkflow(
  tasksWorkflowDto: CreateTasksWorkflowServerDTO
): Promise<TasksWorkflowServerDTO> {
  return createEntity<TasksWorkflowEntity, TasksWorkflowServerDTO>(
    TasksWorkflowEntity,
    TasksWorkflowServerSchema,
    tasksWorkflowDto
  )
}

async function getAllTasksWorkflows(): Promise<TasksWorkflowServerDTO[]> {
  return findEntities<TasksWorkflowEntity, TasksWorkflowServerDTO>(
    TasksWorkflowEntity,
    TasksWorkflowServerSchema
  )
}

async function getTasksWorkflowById(id: string): Promise<TasksWorkflowServerDTO> {
  return findEntity<TasksWorkflowEntity, TasksWorkflowServerDTO>(
    TasksWorkflowEntity,
    TasksWorkflowServerSchema,
    { id }
  )
}

async function updateTasksWorkflow(
  tasksWorkflowDto: UpdateTasksWorkflowServerDTO
): Promise<TasksWorkflowServerDTO> {
  return updateEntity<TasksWorkflowEntity, TasksWorkflowServerDTO>(
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
