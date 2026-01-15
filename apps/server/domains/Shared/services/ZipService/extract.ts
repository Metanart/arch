import { mkdir } from 'node:fs/promises'

import { AppContext } from '@arch/types'
import { AppError } from '@arch/utils'

import StreamZip from 'node-stream-zip'

import { ZipServiceErrorCode } from './types'

const appContext: AppContext = {
  domain: 'Global',
  layer: 'FileSystem',
  origin: 'ZipService.extract'
}

/** Extracts all the contents of the ZIP archive to the specified directory */
export async function extract(
  archivePath: string,
  outputDirectory: string,
  options: { password?: string; signal?: AbortSignal } = {}
): Promise<void> {
  if (options.signal?.aborted)
    throw new AppError<ZipServiceErrorCode, { archivePath: string; outputDirectory: string }>({
      ...appContext,
      code: 'ZIP_EXTRACT_FAILED',
      message: 'ZIP extract failed',
      cause: new Error('Failed to extract ZIP archive'),
      details: { archivePath, outputDirectory }
    })

  await mkdir(outputDirectory, { recursive: true })

  const zip = new StreamZip.async({
    file: archivePath,
    storeEntries: true
  })

  const onAbort = (): void => {
    try {
      void zip.close()
    } catch {
      // ignore
    }
  }
  options.signal?.addEventListener('abort', onAbort, { once: true })

  try {
    await zip.extract(null, outputDirectory) // null → extract everything
  } finally {
    options.signal?.removeEventListener('abort', onAbort)
    await zip.close()
  }
}
