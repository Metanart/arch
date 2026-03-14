import {
  TCreateTaskServerDTO,
  TTaskServerDTO,
  TaskServerSchema,
  TUpdateTaskServerDTO
} from '@arch/contracts'

import { getDataSource } from '@domains/App'
import { createEntity, findEntity, removeEntity, updateEntity } from '@domains/Shared'

import { TaskEntity } from '../entities/TaskEntity'

async function createTask(taskQueueDto: TCreateTaskServerDTO): Promise<TTaskServerDTO> {
  return createEntity<TaskEntity, TTaskServerDTO>(TaskEntity, TaskServerSchema, taskQueueDto)
}

async function getTaskById(id: string): Promise<TTaskServerDTO> {
  return findEntity<TaskEntity, TTaskServerDTO>(TaskEntity, TaskServerSchema, { id })
}

async function getByIdOrNull(id: string): Promise<TaskEntity | null> {
  const repo = getDataSource().getRepository(TaskEntity)
  return repo.findOne({ where: { id } })
}

async function getByWorkflowId(workflowId: string): Promise<TaskEntity[]> {
  const repo = getDataSource().getRepository(TaskEntity)
  return repo.find({ where: { workflowId } })
}

async function updateTask(taskQueueDto: TUpdateTaskServerDTO): Promise<TTaskServerDTO> {
  return updateEntity<TaskEntity, TTaskServerDTO>(
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
