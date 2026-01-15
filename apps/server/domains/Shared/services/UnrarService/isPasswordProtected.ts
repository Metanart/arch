import { AppContext } from '@arch/types'
import { AppError } from '@arch/utils'

import { runExecutable } from './runExecutable'

import { UnrarServiceErrorCode } from './types'

const appContext: AppContext = {
  domain: 'Global',
  layer: 'FileSystem',
  origin: 'UnrarService.isPasswordProtected'
}

/**
 * Checks if a RAR archive is password protected.
 * Logic: try to execute `unrar t` without a password (-p-).
 * - If the command succeeds → the archive is not password protected.
 * - If it fails with a message about password/encryption → the archive is password protected.
 * - Other errors (corrupted archive, I/O and etc.) are propagated upwards.
 */
export async function isPasswordProtected(
  archivePath: string,
  options: { signal?: AbortSignal } = {}
): Promise<boolean> {
  try {
    // t — test archive; -idq — quiet; -p- — do not ask for a password
    await runExecutable(['t', '-idq', '-p-', archivePath], options.signal)
    return false
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const text = String(error?.message ?? '').toLowerCase()

    // heuristic for unrar messages
    const indicators = [
      'password', // "password required", "wrong password"
      'encrypted', // "encrypted file", "encrypted headers"
      'headers encrypted' // headers encrypted
    ]

    if (indicators.some((kw) => text.includes(kw))) {
      return true
    }

    // other reason (corruption, missing file and etc.) — propagate upwards
    throw new AppError<UnrarServiceErrorCode, { archivePath: string }>({
      ...appContext,
      code: 'UNRAR_PASSWORD_PROTECTTION_CHECK_FAILED',
      message: `Archive ${archivePath} is password protected`,
      cause: error,
      details: { archivePath }
    })
  }
}
