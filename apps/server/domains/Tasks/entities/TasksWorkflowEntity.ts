import { Column, Entity, OneToMany } from 'typeorm'

import { STATUS, type TTasksWorkflowStatus } from '@arch/contracts'

import { BaseEntity } from '@domains/Shared'

import { TaskEntity } from './TaskEntity'

@Entity({ name: 'tasks_workflows' })
export class TasksWorkflowEntity extends BaseEntity {
  @Column()
  name!: string

  @Column({ nullable: true })
  sourceId!: string | null

  @Column({ type: 'enum', enum: STATUS })
  status!: TTasksWorkflowStatus

  @OneToMany(() => TaskEntity, (task) => task.workflow)
  tasks!: TaskEntity[]
}
