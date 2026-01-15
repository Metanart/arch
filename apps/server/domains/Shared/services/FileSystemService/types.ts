export type FileSystemErrorCode =
  | 'FILE_COPY_FAILED'
  | 'FILE_MOVE_FAILED'
  | 'FILE_MOVE_FALLBACK_FAILED'
  | 'FILE_HASH_FAILED'

export type NodeJsErrnoException = {
  code?: string
  message?: string
}
