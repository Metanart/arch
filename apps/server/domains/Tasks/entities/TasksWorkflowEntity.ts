import { BaseEntity, Column, Entity, OneToMany } from 'typeorm'

import { STATUS, type TasksWorkflowStatus } from '@arch/contracts'

import { TaskEntity } from './TaskEntity'

@Entity({ name: 'workflows' })
export class TasksWorkflowEntity extends BaseEntity {
  @Column()
  name!: string

  @Column({ nullable: true })
  sourceId!: string | null

  @Column({ type: 'enum', enum: STATUS })
  status!: TasksWorkflowStatus

  @OneToMany(() => TaskEntity, (task) => task.workflow)
  tasks!: TaskEntity[]
}
