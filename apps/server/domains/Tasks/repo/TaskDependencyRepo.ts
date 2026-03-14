import {
  TaskDependencyServerSchema,
  TCreateTaskDependencyServerDTO,
  TTaskDependencyServerDTO,
  TUpdateTaskDependencyServerDTO
} from '@arch/contracts'

import { createEntity, findEntities, findEntity, removeEntity, updateEntity } from '@domains/Shared'

import { getDataSource } from '@domains/App'

import { TaskDependencyEntity } from '../entities/TaskDependencyEntity'

async function createTaskDependency(
  taskDependencyDto: TCreateTaskDependencyServerDTO
): Promise<TTaskDependencyServerDTO> {
  return createEntity<TaskDependencyEntity, TTaskDependencyServerDTO>(
    TaskDependencyEntity,
    TaskDependencyServerSchema,
    taskDependencyDto
  )
}

async function getAllTaskDependencies(): Promise<TTaskDependencyServerDTO[]> {
  return findEntities<TaskDependencyEntity, TTaskDependencyServerDTO>(
    TaskDependencyEntity,
    TaskDependencyServerSchema
  )
}

async function getTaskDependencyById(id: string): Promise<TTaskDependencyServerDTO> {
  return findEntity<TaskDependencyEntity, TTaskDependencyServerDTO>(
    TaskDependencyEntity,
    TaskDependencyServerSchema,
    { id }
  )
}

async function updateTaskDependency(
  taskDependencyDto: TUpdateTaskDependencyServerDTO
): Promise<TTaskDependencyServerDTO> {
  return updateEntity<TaskDependencyEntity, TTaskDependencyServerDTO>(
    TaskDependencyEntity,
    TaskDependencyServerSchema,
    { id: taskDependencyDto.id },
    taskDependencyDto
  )
}

async function removeTaskDependency(id: string): Promise<boolean> {
  return removeEntity<TaskDependencyEntity>(TaskDependencyEntity, { id })
}

async function getDependencyTaskIdsByTaskId(taskId: string): Promise<string[]> {
  const repo = getDataSource().getRepository(TaskDependencyEntity)
  const rows = await repo.find({ where: { taskId } })
  return rows.map((r) => r.dependsOnTaskId)
}

export const TaskDependencyRepo = {
  create: createTaskDependency,
  getAll: getAllTaskDependencies,
  getById: getTaskDependencyById,
  getDependencyTaskIdsByTaskId,
  update: updateTaskDependency,
  remove: removeTaskDependency
}
