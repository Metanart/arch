import { mkdir } from 'node:fs/promises'

import { runExecutable } from './runExecutable'

/**
 * Extracts all the contents of the RAR archive to the specified directory.
 * Requires the unrar executable to be installed.
 * For encrypted headers, pass the password.
 */
export async function extract(
  archivePath: string,
  outputDirectory: string,
  options: { overwrite?: boolean; password?: string; signal?: AbortSignal } = {}
): Promise<void> {
  const overwriteFlag = options.overwrite ? '-o+' : '-o-'
  const passwordFlag = options.password ? `-p${options.password}` : '-p-'

  // ensure the output directory exists
  await mkdir(outputDirectory, { recursive: true })

  // x — extract with full paths; -y — auto-yes; -idq — quiet; -scu — UTF-8
  await runExecutable(
    ['x', '-y', overwriteFlag, passwordFlag, '-idq', '-scu', archivePath, outputDirectory],
    options.signal
  )
}
