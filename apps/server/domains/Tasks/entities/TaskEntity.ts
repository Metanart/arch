import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'

import { TASK_STATUS, TASK_TYPE, type TaskStatus, type TaskType } from '@arch/contracts'

import { BaseEntity } from '@domains/Shared'

import { TasksQueueEntity } from './TasksQueueEntity'

@Entity({ name: 'tasks' })
export class TaskEntity extends BaseEntity {
  @Column({ type: 'enum', enum: TASK_TYPE })
  type!: TaskType

  @Column({ type: 'enum', enum: TASK_STATUS })
  status!: TaskStatus

  @Column({ type: 'text' })
  payload!: string

  @ManyToOne(() => TasksQueueEntity, (queue) => queue.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'queueId' })
  queue!: TasksQueueEntity
}
