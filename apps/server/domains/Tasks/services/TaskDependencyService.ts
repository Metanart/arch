export interface ITaskDependencyService {
  /**
   * Добавить зависимость между задачами
   * taskId зависит от dependsOnTaskId
   */
  addDependency(input: { taskId: string; dependsOnTaskId: string }): Promise<void>

  /**
   * Добавить несколько зависимостей сразу
   */
  addDependencies(
    dependencies: Array<{
      taskId: string
      dependsOnTaskId: string
    }>
  ): Promise<void>

  /**
   * Получить задачи, от которых зависит указанная задача
   */
  getDependencies(taskId: string): Promise<string[]>

  /**
   * Получить задачи, которые зависят от указанной задачи
   */
  getDependents(taskId: string): Promise<string[]>

  /**
   * Проверить, разрешены ли зависимости задачи
   * (все dependsOnTask имеют status = done)
   */
  areDependenciesResolved(taskId: string): Promise<boolean>

  /**
   * Получить незавершённые зависимости задачи
   */
  getUnresolvedDependencies(taskId: string): Promise<string[]>

  /**
   * Удалить зависимость
   */
  removeDependency(input: { taskId: string; dependsOnTaskId: string }): Promise<void>

  /**
   * Удалить все зависимости задачи
   */
  removeAllDependencies(taskId: string): Promise<void>
}
