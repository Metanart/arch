import { AppContext } from '@arch/types'
import { AppError, getMessageFromError } from '@arch/utils'

import { constants } from 'fs'
import { access, copyFile, lstat, mkdir, rename, stat, unlink } from 'fs/promises'

import { walkDirectoryTree } from './walkDirectoryTree/walkDirectoryTree'
import { calculateFileHash } from './calculateFileHash'

import { FileSystemErrorCode, NodeJsErrnoException } from './types'

const appContext: AppContext = {
  domain: 'Global',
  layer: 'FileSystem',
  origin: 'FileSystemService'
}

function isErrnoException(error: unknown): error is NodeJsErrnoException {
  return typeof error === 'object' && error !== null
}

async function checkFileExists(path: string): Promise<boolean> {
  try {
    const stats = await stat(path)
    return stats.isFile()
  } catch {
    return false
  }
}

async function checkDirectoryExists(path: string): Promise<boolean> {
  try {
    const stats = await stat(path)
    return stats.isDirectory()
  } catch {
    return false
  }
}

async function checkSymlinkExists(path: string): Promise<boolean> {
  try {
    const stats = await lstat(path)
    return stats.isSymbolicLink()
  } catch {
    return false
  }
}

async function deleteFile(path: string): Promise<boolean> {
  try {
    await unlink(path)
    return true
  } catch {
    return false
  }
}

async function checkDirectoryReadable(dirPath: string): Promise<boolean> {
  try {
    await access(dirPath, constants.R_OK)
    return true
  } catch {
    return false
  }
}

async function checkDirectoryWritable(dirPath: string): Promise<boolean> {
  try {
    await access(dirPath, constants.W_OK)
    return true
  } catch {
    return false
  }
}

async function createDir(dirPath: string, recursive = true): Promise<boolean> {
  try {
    await mkdir(dirPath, { recursive })
    return true
  } catch {
    return false
  }
}

async function copyFileSafe(
  source: string,
  destination: string,
  overwrite = false
): Promise<boolean> {
  const flags = overwrite ? 0 : constants.COPYFILE_EXCL

  try {
    await copyFile(source, destination, flags)
    return true
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const message = `Failed to copy "${source}" → "${destination}": ${getMessageFromError(error)}`
    throw new AppError<FileSystemErrorCode, { source: string; destination: string }>({
      ...appContext,
      code: 'FILE_COPY_FAILED',
      message,
      cause: error,
      details: { source, destination }
    })
  }
}

async function moveFile(source: string, destination: string): Promise<boolean> {
  try {
    await rename(source, destination)
    return true
  } catch (error: unknown) {
    const errorCode = isErrnoException(error) ? error.code : undefined

    if (errorCode !== 'EXDEV') {
      const message = `Failed to move "${source}" → "${destination}": ${getMessageFromError(error)}`

      throw new AppError<FileSystemErrorCode, { source: string; destination: string }>({
        ...appContext,
        code: 'FILE_MOVE_FAILED',
        message,
        cause: error,
        details: { source, destination }
      })
    }

    // EXDEV: fallback copy + delete
    try {
      await copyFile(source, destination)
      await deleteFile(source)
      return true
    } catch (fallbackError: unknown) {
      const message = `Failed to move "${source}" → "${destination}" via copy+delete: ${getMessageFromError(
        fallbackError
      )}`

      throw new AppError<FileSystemErrorCode, { source: string; destination: string }>({
        ...appContext,
        code: 'FILE_MOVE_FALLBACK_FAILED',
        message,
        cause: fallbackError,
        details: { source, destination }
      })
    }
  }
}

export const FileSystemService = {
  checkFileExists,
  checkDirectoryExists,
  checkSymlinkExists,
  checkDirectoryReadable,
  checkDirectoryWritable,
  calculateFileHash,
  walkDirectoryTree,
  copyFileSafe,
  createDir,
  deleteFile,
  moveFile
}
