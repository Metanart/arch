import {
  CreateTaskDependencyServerDTO,
  TaskDependencyServerDTO,
  TaskDependencyServerSchema,
  UpdateTaskDependencyServerDTO
} from '@arch/contracts'

import { getDataSource } from '@domains/App'
import { createEntity, findEntities, findEntity, removeEntity, updateEntity } from '@domains/Shared'

import { TaskDependencyEntity } from '../entities/TaskDependencyEntity'

async function createTaskDependency(
  tasksWorkflowDto: CreateTaskDependencyServerDTO
): Promise<TaskDependencyServerDTO> {
  return createEntity<TaskDependencyEntity, TaskDependencyServerDTO>(
    TaskDependencyEntity,
    TaskDependencyServerSchema,
    tasksWorkflowDto
  )
}

async function getAllTaskDependencys(): Promise<TaskDependencyServerDTO[]> {
  return findEntities<TaskDependencyEntity, TaskDependencyServerDTO>(
    TaskDependencyEntity,
    TaskDependencyServerSchema
  )
}

async function getTaskDependencyById(id: string): Promise<TaskDependencyServerDTO> {
  return findEntity<TaskDependencyEntity, TaskDependencyServerDTO>(
    TaskDependencyEntity,
    TaskDependencyServerSchema,
    { id }
  )
}

async function updateTaskDependency(
  tasksWorkflowDto: UpdateTaskDependencyServerDTO
): Promise<TaskDependencyServerDTO> {
  return updateEntity<TaskDependencyEntity, TaskDependencyServerDTO>(
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
