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
  tasksWorkflowDto: TCreateTaskDependencyServerDTO
): Promise<TTaskDependencyServerDTO> {
  return createEntity<TaskDependencyEntity, TTaskDependencyServerDTO>(
    TaskDependencyEntity,
    TaskDependencyServerSchema,
    tasksWorkflowDto
  )
}

async function getAllTaskDependencys(): Promise<TTaskDependencyServerDTO[]> {
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
  tasksWorkflowDto: TUpdateTaskDependencyServerDTO
): Promise<TTaskDependencyServerDTO> {
  return updateEntity<TaskDependencyEntity, TTaskDependencyServerDTO>(
    TaskDependencyEntity,
    TaskDependencyServerSchema,
    { id: tasksWorkflowDto.id },
    tasksWorkflowDto
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
  getAll: getAllTaskDependencys,
  getById: getTaskDependencyById,
  getDependencyTaskIdsByTaskId,
  update: updateTaskDependency,
  remove: removeTaskDependency
}
