import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm'

import { BaseEntity } from '@domains/Shared'

import { TaskEntity } from './TaskEntity'

@Entity({ name: 'task_dependencies' })
@Index(['taskId', 'dependsOnTaskId'], { unique: true })
export class TaskDependencyEntity extends BaseEntity {
  @Column()
  taskId!: string

  @ManyToOne(() => TaskEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'taskId' })
  task!: TaskEntity

  @Column()
  dependsOnTaskId!: string

  @ManyToOne(() => TaskEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'dependsOnTaskId' })
  dependsOnTask!: TaskEntity
}
