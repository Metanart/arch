import { Column, Entity, OneToMany } from 'typeorm'

import { TASKS_QUEUE_STATUS, type TasksQueueStatus } from '@arch/contracts'

import { BaseEntity } from '@domains/Shared'

import { TaskEntity } from './TaskEntity'

@Entity({ name: 'tasks_queues' })
export class TasksQueueEntity extends BaseEntity {
  @Column({ type: 'enum', enum: TASKS_QUEUE_STATUS })
  status!: TasksQueueStatus

  @OneToMany(() => TaskEntity, (task) => task.queue, { cascade: false })
  tasks!: TaskEntity[]
}
