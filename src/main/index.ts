import { app, shell, BrowserWindow, ipcMain, Tray, Menu } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/logo.png?asset'
import dotenv from 'dotenv'
dotenv.config()
import getData from './getData'

let mainWindow: BrowserWindow
let tray: Tray

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 336,
    height: 140,
    show: false,
    autoHideMenuBar: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

ipcMain.handle('on-get-data', async () => {
  try {
    const res = await getData({
      email: process.env.MAIN_VITE_USERNAME!,
      passwd: process.env.MAIN_VITE_PASSWORD!
    })
    return res
  } catch (e) {
    console.error('获取流量失败', e)
    throw e
  }
})

app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  createWindow()

  const traffic = await getData({
    email: process.env.MAIN_VITE_USERNAME!,
    passwd: process.env.MAIN_VITE_PASSWORD!
  })

  tray = new Tray(icon) // 准备一个图标
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示/隐藏',
      click: () => (mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show())
    },
    { label: '退出', click: () => app.quit() }
  ])

  tray.setTitle(`${traffic?.left}`)
  tray.setContextMenu(contextMenu)

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  setInterval(
    async () => {
      try {
        const traffic = await getData({
          email: process.env.MAIN_VITE_USERNAME!,
          passwd: process.env.MAIN_VITE_PASSWORD!
        })
        tray.setTitle(`${traffic?.left}`)
      } catch (e) {
        console.error('获取流量失败', e)
      }
    },
    5 * 60 * 1000
  )

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
