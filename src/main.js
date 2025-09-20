const { app, BrowserWindow } = require('electron')
const path = require('path')

const createMainWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 1000,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    })

    mainWindow.loadFile(path.join(__dirname, 'index.html')) 
}



app.on('ready', () => {
    createMainWindow()
})


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})