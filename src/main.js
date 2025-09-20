const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')

const createMainWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 600,
        height: 600,
        frame: false,
        transparent: false,
        resizable: false,
        skipTaskbar: true,
        icon: path.join(__dirname, 'icon.png'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
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


// 获取配置文件信息
ipcMain.handle('getSettingFile', () => {
    return readSettingFile()
})





// 读取配置文件
const readSettingFile = () => {
    try {
        // 读取 setting.properties 文件
        const settingPath = path.join(__dirname, 'setting.properties')
        const setting = fs.readFileSync(settingPath, 'utf-8')

        // 解析
        const config = {}
        const lines = setting.split('\n')

        lines.forEach(line => {
            line = line.trim()

            // 跳过空行和注释行
            if (line && !line.startsWith('#') && !line.startsWith(';')) {
                const [key, value] = line.split('=')

                if (key && value) {
                    config[key.trim()] = value.trim()
                }
            }
        })

        return config
    } catch (error) {
        console.error('读取配置文件失败：' + error)
        return {}
    }
}