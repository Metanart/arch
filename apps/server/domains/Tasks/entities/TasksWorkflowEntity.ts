import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'

import { type TTasksWorkflowStatus } from '@arch/contracts'

import { BaseEntity } from '@/Shared/entities'
import { SourceEntity } from '@/Sources/entities'

import { TaskEntity } from './TaskEntity'

@Entity({ name: 'tasks_workflows' })
export class TasksWorkflowEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  name!: string

  @Column({ type: 'varchar', nullable: true })
  sourceId!: string | null

  @ManyToOne(() => SourceEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'sourceId' })
  source!: SourceEntity | null

  @Column({ type: 'text' })
  status!: TTasksWorkflowStatus

  @OneToMany(() => TaskEntity, (task) => task.workflow)
  tasks!: TaskEntity[]
}
