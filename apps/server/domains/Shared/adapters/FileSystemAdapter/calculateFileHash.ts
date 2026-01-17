import { createReadStream } from 'fs'
import { createHash } from 'crypto'

import { AppContext } from '@arch/types'
import { AppError, getMessageFromError } from '@arch/utils'

import { FileSystemErrorCode } from './types'

const appContext: AppContext = {
  domain: 'Global',
  layer: 'FileSystem',
  origin: 'calculateFileHash'
}

export async function calculateFileHash(
  filePath: string,
  options: {
    algorithm?: 'sha256' | 'sha1' | 'md5'
    encoding?: 'hex' | 'base64'
    signal?: AbortSignal
  } = {}
): Promise<string> {
  const algorithm = options.algorithm ?? 'sha256'
  const encoding = options.encoding ?? 'hex'

  try {
    const hash = createHash(algorithm)
    const stream = createReadStream(filePath, { signal: options.signal })

    for await (const chunk of stream) {
      hash.update(chunk as Buffer)
    }

    return hash.digest(encoding)
  } catch (error: unknown) {
    const message = `Failed to hash "${filePath}" with ${algorithm}: ${getMessageFromError(error)}`
    throw new AppError<FileSystemErrorCode, { filePath: string; algorithm: string }>({
      ...appContext,
      code: 'FILE_HASH_FAILED',
      message,
      cause: error,
      details: { filePath, algorithm }
    })
  }
}
