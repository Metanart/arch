import { existsSync } from 'node:fs'
import { join, resolve } from 'node:path'

import { TAppContext } from '@arch/types'
import { AppError } from '@arch/utils'

import { detectPlatform } from '../../utils/platform/detectPlatform'

import { TUnrarServiceErrorCode } from './types'

const appContext: TAppContext = {
  domain: 'Global',
  layer: 'FileSystem',
  origin: 'UnrarService.resolvePathToExecutable'
}

/**
 * Resolve the path to the unrar executable.
 * @returns the path to the unrar executable
 */
export function resolvePathToExecutable(): string {
  const exe: 'unrar.exe' | 'unrar' = process.platform === 'win32' ? 'unrar.exe' : 'unrar'

  // prod (packed app)
  const prod = join(
    (process as unknown as { resourcesPath?: string }).resourcesPath ?? process.cwd(),
    'bin',
    detectPlatform(),
    exe
  )

  if (existsSync(prod)) return prod

  // dev (electron-vite)
  const dev = resolve(process.cwd(), 'resources', 'bin', detectPlatform(), exe)

  if (existsSync(dev)) return dev

  throw new AppError<TUnrarServiceErrorCode, { prod: string; dev: string }>({
    ...appContext,
    code: 'UNRAR_EXECUTABLE_NOT_FOUND',
    message: `Unrar executable not found: ${prod} | ${dev}`,
    cause: new Error(`Unrar executable not found: ${prod} | ${dev}`),
    details: { prod, dev }
  })
}
