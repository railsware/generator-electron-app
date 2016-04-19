var app, electron

electron = require('electron')

app = electron.app

app.on('ready', function () {
  var mainWindow
  mainWindow = new electron.BrowserWindow({
    width: 600,
    height: 400
  })
  return mainWindow.loadURL('file://' + __dirname + '/index.html')
})
