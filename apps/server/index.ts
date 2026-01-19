import 'dotenv/config'

import { app, BrowserWindow, shell } from 'electron'

import { createLogger } from '@arch/utils'

import { getDefaultAppPaths, setupSharedIpcHandlers } from '@domains/Shared'

import { createDataSource } from '@domains/App/Root'
import {
  createDefaultSettings,
  SettingsRepo,
  setupSettingsIpcListeners
} from '@domains/Settings/Root'
import { setupSourcesIpcListeners } from '@domains/Sources/Root'

import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { join } from 'path'

import icon from '../../resources/icon.png?asset'

const logger = createLogger({ domain: 'Global', layer: 'StartApp', origin: 'Server main file' })

function createWindow(): BrowserWindow {
  logger.log('Creating main window')

  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    x: 4,
    y: 4,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    logger.log('MainWindow ready to show')
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../client/index.html'))
  }

  return mainWindow
}

async function bootstrap(): Promise<void> {
  logger.log('Waiting for app to be ready...')
  await app.whenReady()

  logger.log('App ready')

  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  logger.log('Initializing database...')
  const appDataSource = createDataSource(getDefaultAppPaths().dbFile)
  await appDataSource.initialize()
  logger.log('Database connected at', appDataSource.options.database)

  const existingSettings = await SettingsRepo.get()
  const defaultAppPaths = getDefaultAppPaths()

  if (!existingSettings) {
    await SettingsRepo.create(
      createDefaultSettings(defaultAppPaths.outputDir, defaultAppPaths.tempDir)
    )
  }

  logger.log('Setting up shared IPC handlers')
  setupSharedIpcHandlers()

  logger.log('Setting up settings IPC listeners')
  setupSettingsIpcListeners()

  logger.log('Setting up sources IPC listeners')
  setupSourcesIpcListeners()

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
}

logger.log('Starting server')

bootstrap().catch((error) => {
  logger.error('Fatal bootstrap error', error)
  app.quit()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
