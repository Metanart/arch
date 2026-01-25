export type FileNode = {
  path: string
  name: string
  size: number
  ext: string
}

export type DirectoryNode = {
  path: string
  name: string
  files: FileNode[]
  subdirs: DirectoryNode[]
}

export type WalkOptions = {
  /** Max depth (0 — only root, 1 — root + its children, etc.). Absent — no limit */
  maxDepth?: number
  /** true — enter directory; false — skip completely */
  dirPredicate?: (dirName: string) => boolean
  /** true — include file */
  filePredicate?: (fileName: string, fileSize: number) => boolean
  /** true — count file as key for further processing (keyFiles counter) */
  keyFilePredicate?: (fileName: string, fileSize: number) => boolean
  /** Max number of files to prevent memory overflow */
  maxFiles?: number
  /** Max recursion depth to prevent stack overflow */
  maxRecursionDepth?: number
}

export type DirectoryTree = {
  tree: DirectoryNode
  totalFiles: number // total number of included files
  keyFiles: number // total number of included key files
  nonKeyFiles: number // totalFiles - keyFiles
  errors: string[] // errors that occurred during the walk
}
