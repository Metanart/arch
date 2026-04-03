import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm'

import { BaseEntity } from '@domains/Shared/entities'

import { TaskEntity } from './TaskEntity'

@Entity({ name: 'tasks_dependencies' })
@Index(['taskId', 'dependsOnTaskId'], { unique: true })
export class TaskDependencyEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  taskId!: string

  @ManyToOne(() => TaskEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'taskId' })
  task!: TaskEntity

  @Column({ type: 'varchar' })
  dependsOnTaskId!: string

  @ManyToOne(() => TaskEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dependsOnTaskId' })
  dependsOnTask!: TaskEntity
}
