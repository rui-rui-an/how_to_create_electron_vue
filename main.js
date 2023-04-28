const { app, ipcMain, BrowserWindow } = require('electron')
const createTray = require('./controller/tray.js')
const path = require('path')
// 调整窗口大小以及窗口的最大化，最小化和关闭窗口
require('./controller/changeWindowSize.js')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false, // 不要自带的窗口
    webPreferences: {
      preload: path.join(__dirname, './preload/index.js')
    }
  })

  // 下面的url为自己启动vite项目的url。
  win.loadURL('http://127.0.0.1:5173/')
  // 打开electron的开发者工具
  win.webContents.openDevTools({ mode: 'detach' })
  createTray(app, win) // 系统托盘
}

ipcMain.handle('sent-event', (event, params) => {
  console.log(params)
  return '1111'
})

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
