export enum TASK_TYPE {
  SCAN_SOURCE = 'scan-source',
  EXTRACT_ARCHIVE = 'extract-archive',
  CREATE_ACRHIVE = 'create-archive',
  NORMALIZE_FILES = 'normalize-files'
}

export enum TASK_STATUS {
  PENDING = 'pending',
  RUNNIGN = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export enum TASKS_QUEUE_STATUS {
  PENDING = 'pending',
  RUNNIGN = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}
