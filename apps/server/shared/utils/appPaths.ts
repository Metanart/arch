import { app } from 'electron'
import path from 'path'

export type AppPaths = {
  outputDir: string
  tempDir: string
  cacheDir: string
  configDir: string
  dbFile: string
}

function resolveAppPaths(): AppPaths {
  const base = path.join(app.getPath('documents'), 'STLOrganizer')
  return {
    outputDir: path.join(base, 'output'),
    tempDir: path.join(base, 'temp'),
    cacheDir: path.join(base, 'cache'),
    configDir: path.join(base, 'config'),
    dbFile: path.join(base, 'stl-organizer.sqlite')
  }
}

export const appPaths = resolveAppPaths()
