import {
  TasksWorkflowServerSchema,
  TCreateTasksWorkflowServerDTO,
  TTasksWorkflowServerDTO,
  TUpdateTasksWorkflowServerDTO
} from '@arch/contracts'
import { AppError } from '@arch/utils'

import { getDataSource } from '@/Shared/database'
import { createEntity, removeEntity, updateEntity } from '@/Shared/repo'

import { TasksWorkflowEntity } from '../entities/TasksWorkflowEntity'

function mapCreateDtoToEntityPayload(dto: TCreateTasksWorkflowServerDTO): {
  name: string
  status: TCreateTasksWorkflowServerDTO['status']
  source?: { id: string }
} {
  const { sourceId, ...rest } = dto
  return {
    ...rest,
    ...(sourceId != null ? { source: { id: sourceId } } : {})
  }
}

async function createTasksWorkflow(
  tasksWorkflowDto: TCreateTasksWorkflowServerDTO
): Promise<TTasksWorkflowServerDTO> {
  return createEntity<TasksWorkflowEntity, TTasksWorkflowServerDTO>(
    TasksWorkflowEntity,
    TasksWorkflowServerSchema,
    mapCreateDtoToEntityPayload(tasksWorkflowDto)
  )
}

async function getAllTasksWorkflows(): Promise<TTasksWorkflowServerDTO[]> {
  const tasksWorkflowRepository = getDataSource().getRepository(TasksWorkflowEntity)
  const entities = await tasksWorkflowRepository.find({ relations: ['source'] })
  return entities.map((entity) => TasksWorkflowServerSchema.parse(entity))
}

async function getTasksWorkflowById(id: string): Promise<TTasksWorkflowServerDTO> {
  const tasksWorkflowRepository = getDataSource().getRepository(TasksWorkflowEntity)
  const entity = await tasksWorkflowRepository.findOne({ where: { id }, relations: ['source'] })
  if (!entity) {
    throw new AppError({
      domain: 'Tasks',
      layer: 'Database',
      origin: 'getTasksWorkflowById',
      message: 'Workflow not found',
      code: 'DB_ENTITY_NOT_FOUND'
    })
  }
  return TasksWorkflowServerSchema.parse(entity)
}

function mapUpdateDtoToEntityPayload(dto: TUpdateTasksWorkflowServerDTO): {
  status: TUpdateTasksWorkflowServerDTO['status']
  name?: string
  source?: { id: string } | null
} {
  const { sourceId, ...rest } = dto
  return {
    ...rest,
    ...(sourceId !== undefined ? { source: sourceId != null ? { id: sourceId } : null } : {})
  }
}

async function updateTasksWorkflow(
  tasksWorkflowDto: TUpdateTasksWorkflowServerDTO
): Promise<TTasksWorkflowServerDTO> {
  return updateEntity<TasksWorkflowEntity, TTasksWorkflowServerDTO>(
    TasksWorkflowEntity,
    TasksWorkflowServerSchema,
    { id: tasksWorkflowDto.id },
    mapUpdateDtoToEntityPayload(tasksWorkflowDto)
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
