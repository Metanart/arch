import { app } from 'electron'

import path from 'path'

export type AppPaths = {
  outputDir: string
  tempDir: string
  cacheDir: string
  configDir: string
  dbFile: string
}

export function getDefaultAppPaths(): AppPaths {
  if (!app) {
    throw new Error('Electron app is not available in this context')
  }

  if (!app.isReady()) {
    throw new Error('Electron app is not ready yet')
  }

  const base = path.join(app.getPath('documents'), 'STLOrganizer')

  return {
    outputDir: path.join(base, 'output'),
    tempDir: path.join(base, 'temp'),
    cacheDir: path.join(base, 'cache'),
    configDir: path.join(base, 'config'),
    dbFile: path.join(base, 'stl-organizer.sqlite')
  }
}
