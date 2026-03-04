export interface ITasksOrchestrator {
  start(): Promise<void>

  stop(): Promise<void>

  schedule(): Promise<void>

  onTaskCompleted(taskId: string): Promise<void>

  onTaskFailed(taskId: string, error: string): Promise<void>
}
