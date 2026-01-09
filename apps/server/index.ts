import 'dotenv/config'

import { app, BrowserWindow, shell } from 'electron'

import { createLogger } from '@arch/utils'

import { setupSharedIpcHandlers } from '@domains/Shared'

import { AppDataSource } from '@domains/App/Root'
import { setupSettingsIpcListeners } from '@domains/Settings/Root'
import { setupSourcesIpcListeners } from '@domains/Sources/Root'

import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { join } from 'path'

import icon from '../../resources/icon.png?asset'

const logger = createLogger({ domain: 'Global', layer: 'StartApp', origin: 'Server main file' })

logger.log('Starting server')

logger.log('Setting up shared IPC listeners')
setupSharedIpcHandlers()

logger.log('Setting up settings IPC listeners')
setupSettingsIpcListeners()

logger.log('Setting up sources IPC listeners')
setupSourcesIpcListeners()

function createWindow(): void {
  logger.log('Creating main window')

  // Create the browser window.
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
    logger.log('MainWindow webContents setWindowOpenHandler', details)

    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../client/index.html'))
  }

  logger.log('MainWindow loaded')
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Set app user modasync async el id for windows
  logger.log('App ready')

  electronApp.setAppUserModelId('com.electron')
  logger.log('App user model id set')

  try {
    await AppDataSource.initialize()
    logger.log('Database connected at', AppDataSource.options.database)
    await createWindow()
  } catch (err) {
    logger.error('Failed to initialize database:', err)
    app.quit()
  }

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    logger.log('Browser window created', window)
    optimizer.watchWindowShortcuts(window)
  })

  app.on('activate', function () {
    logger.log('App activate')

    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  logger.log('Window all closed')

  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
