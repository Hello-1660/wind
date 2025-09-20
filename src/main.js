const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')














// 获取窗口大小
const settingFile = readSettingFile()


const winPath = {
    winX: settingFile.winX,
    winY: settingFile.winY,
    winWidth: settingFile.WinWidth,
    winHeight: settingFile.WinHeight
}















const createMainWindow = () => {


    const mainWindow = new BrowserWindow({
        x: +winPath.winX,
        y: +winPath.winY,
        width: +winPath.winWidth,
        height: +winPath.winHeight,
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

    mainWindow.on('move', () => {
        const position = mainWindow.getPosition()
        winPath.winX = position[0]
        winPath.winY = position[1]

        // 保存位置
        writeSettingFile({
            winX: position[0],
            winY: position[1]
        })
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












// 修改配置文件
function writeSettingFile(data) {
    try {
        const settingFilePath = path.join(__dirname, 'setting.properties')
        let settingContent = fs.readFileSync(settingFilePath, 'utf-8')

        // 更改配置文件
        for (const [key, value] of Object.entries(data)) {
            const regex = new RegExp(`(${key}\\s*=\\s*).*`, 'i')

            if (regex.test(settingContent)) {
                settingContent = settingContent.replace(regex, `$1${value}`)
            }
        }

        fs.writeFileSync(settingFilePath, settingContent, 'utf-8')
    } catch (error) {
        console.error('更新配置文件失败：' + error)
    }
}











// 读取配置文件
function readSettingFile() {
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


// 窗口数据模型
class WindowModel {
    constructor(winX, winY, winWidth, winHeight, theme, font, fontSize, fontColor, btnBorderColor, btnBgColor, btnFontColor, btnFontSize, textBorderColor, textBgColor, textFontColor, textFontSize, timeFontColor, timeFontSize, dateFontColor, dateFontSize, dateFormat, dateContent, tipStyle, addTodo, showTodo, updateTodo, isRemind, isAutoStart) {
        this.winX = winX
        this.winY = winY
        this.winWidth = winWidth
        this.winHeight = winHeight
        this.theme = theme
        this.font = font
        this.fontSize = fontSize
        this.fontColor = fontColor
        this.btnBorderColor = btnBorderColor
        this.btnBgColor = btnBgColor
        this.btnFontColor = btnFontColor
        this.btnFontSize = btnFontSize
        this.textBorderColor = textBorderColor
        this.textBgColor = textBgColor
        this.textFontColor = textFontColor
        this.textFontSize = textFontSize
        this.timeFontColor = timeFontColor
        this.timeFontSize = timeFontSize
        this.dateFontColor = dateFontColor
        this.dateFontSize = dateFontSize
        this.dateFormat = dateFormat
        this.dateContent = dateContent
        this.tipStyle = tipStyle
        this.addTodo = addTodo
        this.showTodo = showTodo
        this.updateTodo = updateTodo
        this.isRemind = isRemind
        this.isAutoStart = isAutoStart
    }
}
