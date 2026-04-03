import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm'

import { type TTaskStatus, type TTaskType } from '@arch/contracts'

import { BaseEntity } from '@domains/Shared/entities'

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

  @Column({ type: 'text' })
  type!: TTaskType

  @Column({ type: 'text' })
  status!: TTaskStatus

  @Column({ type: 'simple-json' })
  payload!: unknown

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
  errorCode!: string | null

  @Column({ type: 'text', nullable: true })
  errorMessage!: string | null

  @Column({ type: 'simple-json', nullable: true })
  errorDetails!: unknown | null

  @OneToMany(() => TaskDependencyEntity, (dependency) => dependency.task)
  dependencies!: TaskDependencyEntity[]

  @OneToMany(() => TaskDependencyEntity, (dependency) => dependency.dependsOnTask)
  dependents!: TaskDependencyEntity[]
}
