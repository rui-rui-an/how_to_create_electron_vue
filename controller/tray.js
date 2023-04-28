// 创建系统托盘
const { Tray, Menu } = require('electron')
// const { ipcRenderer } = require('electron')
const path = require('path')

function createTray(app, win) {
  let tray = new Tray(path.join(__dirname, '../public/favicon.ico'))
  // if (process.env.NODE_ENV === 'development') {
  // tray = new Tray(path.join(__dirname, '../public/favicon.ico'))
  // } else {
  // tray = new Tray(path.join(path.dirname(app.getPath('exe')), '/resources/public/logo.ico'))
  // }
  tray.setToolTip('示例平台') // 鼠标放在托盘图标上的提示信息
  tray.on('click', (e) => {
    if (e.shiftKey) {
      app.quit()
    } else {
      win.show()
    }
  })
  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: '退出',
        click: () => {
          // 先把用户的登录状态和用户的登录信息给清楚掉,再退出
          app.quit()
        }
      }
    ])
  )
}
module.exports = createTray
