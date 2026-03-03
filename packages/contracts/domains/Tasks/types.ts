import { STATUS } from '../Shared/enums'

import { TASK_TYPE } from './enums'

export type TaskType = (typeof TASK_TYPE)[keyof typeof TASK_TYPE]

export type TaskStatus = (typeof STATUS)[keyof typeof STATUS]

export type TasksWorkflowStatus = (typeof STATUS)[keyof typeof STATUS]
