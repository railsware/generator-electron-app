electron = require('electron')
app = electron.app

app.on 'ready', ->
  mainWindow = new electron.BrowserWindow width: 600, height: 400
  mainWindow.loadURL "file://#{__dirname}/index.html"
