import { runExecutable } from './runExecutable'

/**
 * Test the integrity of a RAR archive.
 * @param archive - the path to the archive
 * @param password - the password for the archive
 * @param signal - the signal to abort the operation
 * @returns true if the archive is intact, false otherwise
 */
export async function testIntegrity(
  archive: string,
  password?: string,
  signal?: AbortSignal
): Promise<boolean> {
  const pass = password ? `-p${password}` : '-p-'
  try {
    await runExecutable(['t', '-idq', pass, archive], signal)
    return true
  } catch {
    return false
  }
}
