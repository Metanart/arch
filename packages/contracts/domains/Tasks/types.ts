import { STATUS } from '../Shared/enums'

import { TASK_TYPE } from './enums'

export type TTaskType = (typeof TASK_TYPE)[keyof typeof TASK_TYPE]

export type TTaskStatus = (typeof STATUS)[keyof typeof STATUS]

export type TTasksWorkflowStatus = (typeof STATUS)[keyof typeof STATUS]
