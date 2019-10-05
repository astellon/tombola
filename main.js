const { app, BrowserWindow } = require('electron')

const _ = require('electron-reload')(__dirname + '/public')

const path = require('path')
const url = require('url')

function createWindow() {

  // Create the browser window.
  mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      useContentSize: true
  })

  mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'public', 'index.html'),
      protocol: 'file:',
      slashes: true
  }))

  mainWindow.on('closed', function() {
      mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
      app.quit()
  }
})


app.on('activate', function() {
  if (mainWindow === null) {
      createWindow()
  }
})