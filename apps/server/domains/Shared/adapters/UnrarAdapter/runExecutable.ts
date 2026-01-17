import { spawn } from 'child_process'

import { AppContext } from '@arch/types'
import { AppError } from '@arch/utils'

import { resolvePathToExecutable } from './resolvePathToExecutable'

import { UnrarServiceErrorCode } from './types'

const appContext: AppContext = {
  domain: 'Global',
  layer: 'FileSystem',
  origin: 'UnrarService.runExecutable'
}

/**
 * Run the unrar executable and return the stdout as a UTF-8 string
 * @param unrarArguments - the arguments to pass to the unrar executable
 * @param abortSignal - the signal to abort the operation
 * @returns the stdout as a UTF-8 string
 */
export function runExecutable(
  unrarArguments: readonly string[],
  abortSignal?: AbortSignal
): Promise<string> {
  const unrarExecutablePath = resolvePathToExecutable()

  return new Promise((resolveOutput, rejectError) => {
    const childProcess = spawn(unrarExecutablePath, unrarArguments, {
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
      signal: abortSignal
    })

    let stdoutText = ''
    let stderrText = ''

    childProcess.stdout.setEncoding('utf8').on('data', (chunk: string) => {
      stdoutText += chunk
    })

    childProcess.stderr.setEncoding('utf8').on('data', (chunk: string) => {
      stderrText += chunk
    })

    childProcess.once('error', rejectError)

    childProcess.once('close', (exitCode: number) => {
      if (exitCode === 0) {
        resolveOutput(stdoutText)
      } else {
        rejectError(
          new AppError<UnrarServiceErrorCode, { exitCode: number }>({
            ...appContext,
            code: 'UNRAR_EXECUTABLE_RUN_FAILED',
            message: `Unrar executable exited with code ${exitCode}: ${stderrText || stdoutText}`,
            cause: new Error(
              `Unrar executable exited with code ${exitCode}: ${stderrText || stdoutText}`
            ),
            details: { exitCode }
          })
        )
      }
    })
  })
}
