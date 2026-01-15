import { runExecutable } from './runExecutable'

/**
 * Returns a list of file paths inside the RAR (one path per line).
 * Requires the unrar executable to be installed.
 * For encrypted headers, pass the password.
 */
export async function listContents(
  archivePath: string,
  options: {
    password?: string
    signal?: AbortSignal
  } = {}
): Promise<string[]> {
  const passwordFlag = options.password ? `-p${options.password}` : '-p-'
  // lb — bare list; -idq — тихий вывод; -scu — UTF-8 для консоли (если поддерживается)
  const rawStdout = await runExecutable(
    ['lb', '-idq', '-scu', passwordFlag, archivePath],
    options.signal
  )
  return rawStdout.split(/\r?\n/).filter(Boolean)
}
