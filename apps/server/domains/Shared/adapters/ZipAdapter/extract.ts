import { mkdir } from 'node:fs/promises'
import StreamZip from 'node-stream-zip'

import { TAppContext } from '@arch/types'
import { AppError } from '@arch/utils'

import { TZipServiceErrorCode } from './types'

const appContext: TAppContext = {
  domain: 'Global',
  layer: 'FileSystem',
  origin: 'ZipService.extract'
}

/** Extracts all the contents of the ZIP archive to the specified directory */
export async function extract(
  archivePath: string,
  outputDirectory: string,
  options: { signal?: AbortSignal } = {}
): Promise<void> {
  if (options.signal?.aborted)
    throw new AppError<TZipServiceErrorCode, { archivePath: string; outputDirectory: string }>({
      ...appContext,
      code: 'ZIP_EXTRACT_ABORTED',
      message: 'ZIP extract aborted',
      cause: new Error('Aborted'),
      details: { archivePath, outputDirectory }
    })

  await mkdir(outputDirectory, { recursive: true })

  const zip = new StreamZip.async({
    file: archivePath,
    storeEntries: true
  })

  const abortHandler = (): void => {
    try {
      void zip.close()
    } catch {
      // ignore
    }
  }
  options.signal?.addEventListener('abort', abortHandler, { once: true })

  try {
    await zip.extract(null, outputDirectory) // null → extract everything
  } catch (error) {
    if (error instanceof AppError) throw error
    throw new AppError<TZipServiceErrorCode, { archivePath: string; outputDirectory: string }>({
      ...appContext,
      code: 'ZIP_EXTRACT_FAILED',
      message: 'ZIP extract failed',
      cause: error instanceof Error ? error : new Error(String(error)),
      details: { archivePath, outputDirectory }
    })
  } finally {
    options.signal?.removeEventListener('abort', abortHandler)
    await zip.close()
  }
}
