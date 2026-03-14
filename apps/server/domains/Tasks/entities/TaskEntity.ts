import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm'

import { STATUS, TASK_TYPE, type TTaskStatus, type TTaskType } from '@arch/contracts'

import { BaseEntity } from '@domains/Shared'

import { TaskDependencyEntity } from './TaskDependencyEntity'
import { TasksWorkflowEntity } from './TasksWorkflowEntity'

@Entity({ name: 'tasks' })
@Index(['status', 'priority'])
@Index(['leaseUntil'])
@Index(['takenBy'])
@Index(['nextRunAt'])
export class TaskEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  workflowId!: string

  @ManyToOne(() => TasksWorkflowEntity, (workflow) => workflow.tasks, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'workflowId' })
  workflow!: TasksWorkflowEntity

  @Column({ type: 'enum', enum: TASK_TYPE })
  type!: TTaskType

  @Column({ type: 'enum', enum: STATUS })
  status!: TTaskStatus

  @Column({ type: 'json' })
  payload!: string

  @Column({ type: 'int', default: 0 })
  priority!: number

  @Column({ type: 'float', default: 0 })
  predictedWeight!: number

  @Column({ type: 'varchar', nullable: true })
  takenBy!: string | null

  @Column({ type: 'datetime', nullable: true })
  leaseUntil!: Date | null

  @Column({ type: 'int', default: 0 })
  attempts!: number

  @Column({ type: 'int', default: 3 })
  maxAttempts!: number

  @Column({ type: 'datetime', nullable: true })
  nextRunAt!: Date | null

  @Column({ type: 'varchar', nullable: true })
  step!: string | null

  @Column({ type: 'int', default: 0 })
  progressCurrent!: number

  @Column({ type: 'int', default: 0 })
  progressTotal!: number

  @Column({ type: 'text', nullable: true })
  error!: string | null

  @OneToMany(() => TaskDependencyEntity, (dependency) => dependency.task)
  dependencies!: TaskDependencyEntity[]

  @OneToMany(() => TaskDependencyEntity, (dependency) => dependency.dependsOnTask)
  dependents!: TaskDependencyEntity[]
}
