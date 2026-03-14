import {
  CreateTaskServerDTO,
  TaskServerDTO,
  TaskServerSchema,
  UpdateTaskServerDTO
} from '@arch/contracts'

import { getDataSource } from '@domains/App'
import { createEntity, findEntity, removeEntity, updateEntity } from '@domains/Shared'

import { TaskEntity } from '../entities/TaskEntity'

async function createTask(taskQueueDto: CreateTaskServerDTO): Promise<TaskServerDTO> {
  return createEntity<TaskEntity, TaskServerDTO>(TaskEntity, TaskServerSchema, taskQueueDto)
}

async function getTaskById(id: string): Promise<TaskServerDTO> {
  return findEntity<TaskEntity, TaskServerDTO>(TaskEntity, TaskServerSchema, { id })
}

async function getByIdOrNull(id: string): Promise<TaskEntity | null> {
  const repo = getDataSource().getRepository(TaskEntity)
  return repo.findOne({ where: { id } })
}

async function getByWorkflowId(workflowId: string): Promise<TaskEntity[]> {
  const repo = getDataSource().getRepository(TaskEntity)
  return repo.find({ where: { workflowId } })
}

async function updateTask(taskQueueDto: UpdateTaskServerDTO): Promise<TaskServerDTO> {
  return updateEntity<TaskEntity, TaskServerDTO>(
    TaskEntity,
    TaskServerSchema,
    { id: taskQueueDto.id },
    taskQueueDto
  )
}

async function removeTask(id: string): Promise<boolean> {
  return removeEntity<TaskEntity>(TaskEntity, { id })
}

export const TaskRepo = {
  create: createTask,
  getById: getTaskById,
  getByIdOrNull,
  getByWorkflowId,
  update: updateTask,
  remove: removeTask
}
