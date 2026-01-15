import { AppContext } from '@arch/types'
import { AppError } from '@arch/utils'

import StreamZip from 'node-stream-zip'

import { ZipServiceErrorCode } from './types'

const appContext: AppContext = {
  domain: 'Global',
  layer: 'FileSystem',
  origin: 'ZipService.listContents'
}

/**
 * Returns a list of file paths inside the ZIP (without directories).
 * Uses node-stream-zip (async API).
 */
export async function listContents(
  archivePath: string,
  options: {
    password?: string
    signal?: AbortSignal
  } = {}
): Promise<string[]> {
  if (options.signal?.aborted)
    throw new AppError<ZipServiceErrorCode, { archivePath: string }>({
      ...appContext,
      code: 'ZIP_LIST_CONTENTS_ABORTED',
      message: 'ZIP list contents aborted',
      cause: new Error('Aborted'),
      details: { archivePath }
    })

  const zip = new StreamZip.async({
    file: archivePath,
    storeEntries: true
  })

  const abortHandler = (): void => {
    // Close the archive when aborted; ignore errors closing
    try {
      void zip.close()
    } catch {
      // ignore
    }
  }
  options.signal?.addEventListener('abort', abortHandler, { once: true })

  try {
    const entries = await zip.entries()
    const files = Object.values(entries)
      .filter((entry) => !entry.isDirectory)
      .map((entry) => entry.name)
    return files
  } finally {
    options.signal?.removeEventListener('abort', abortHandler)
    await zip.close()
  }
}
