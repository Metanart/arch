import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'

import { STATUS, type TTasksWorkflowStatus } from '@arch/contracts'

import { BaseEntity } from '@domains/Shared'

import { SourceEntity } from '@domains/Sources'

import { TaskEntity } from './TaskEntity'

@Entity({ name: 'tasks_workflows' })
export class TasksWorkflowEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  name!: string

  @ManyToOne(() => SourceEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'sourceId' })
  source!: SourceEntity | null

  @Column({ type: 'enum', enum: STATUS })
  status!: TTasksWorkflowStatus

  @OneToMany(() => TaskEntity, (task) => task.workflow)
  tasks!: TaskEntity[]

  get sourceId(): string | null {
    return this.source?.id ?? null
  }
}
