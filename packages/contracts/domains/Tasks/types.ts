import { TASK_STATUS, TASK_TYPE, TASKS_QUEUE_STATUS } from './enums'

export type TaskType = (typeof TASK_TYPE)[keyof typeof TASK_TYPE]

export type TaskStatus = (typeof TASK_STATUS)[keyof typeof TASK_STATUS]

export type TasksQueueStatus = (typeof TASKS_QUEUE_STATUS)[keyof typeof TASKS_QUEUE_STATUS]
