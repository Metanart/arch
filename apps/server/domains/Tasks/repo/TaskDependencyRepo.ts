import {
  TaskDependencyServerSchema,
  TCreateTaskDependencyServerDTO,
  TTaskDependencyServerDTO,
  TUpdateTaskDependencyServerDTO
} from '@arch/contracts'

import {
  createEntity,
  findEntities,
  findEntity,
  removeEntity,
  updateEntity
} from '@domains/Shared/repo'

import { getDataSource } from '@domains/App/database'

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
  const taskDependencyRepository = getDataSource().getRepository(TaskDependencyEntity)
  const dependencyRows = await taskDependencyRepository.find({ where: { taskId } })
  return dependencyRows.map((dependencyRow) => dependencyRow.dependsOnTaskId)
}

export const TaskDependencyRepo = {
  create: createTaskDependency,
  getAll: getAllTaskDependencies,
  getById: getTaskDependencyById,
  getDependencyTaskIdsByTaskId,
  update: updateTaskDependency,
  remove: removeTaskDependency
}
