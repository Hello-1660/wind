const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage } = require('electron')
const path = require('path')
const fs = require('fs')
const fsp = require('fs').promises;







// 系统托盘
let tray = null
// 弹窗
let tip = null
// 主界面
let mainWindow = null
// 设置界面
let settingWindow = null
// 展示界面
let showWindow = null








// 获取窗口大小
const settingFile = readSettingFile()


const winPath = {
    winX: settingFile.winX,
    winY: settingFile.winY,
    winWidth: settingFile.WinWidth,
    winHeight: settingFile.WinHeight
}















// 主界面
const createMainWindow = () => {
    if (mainWindow) {
        return
    }

    mainWindow = new BrowserWindow({
        x: +winPath.winX,
        y: +winPath.winY,
        width: +winPath.winWidth,
        height: +winPath.winHeight,
        frame: false,
        transparent: true,
        resizable: false,
        skipTaskbar: true,
        // icon: path.join(__dirname, 'icon.png'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
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

    mainWindow.on('closed', () => mainWindow = null)

    mainWindow.loadFile(path.join(__dirname, 'index.html'))
}




// 设置界面
const createSettingWindow = () => {
    if (settingWindow) {
        return
    }

    settingWindow = new BrowserWindow({
        width: 900,
        height: 700,
        resizable: false,
        title: '设置',
        icon: path.join(__dirname, './icons/wind.png'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // 隐藏菜单栏
    settingWindow.setMenu(null)
    settingWindow.on('closed', () => settingWindow = null)
    settingWindow.loadFile(path.join(__dirname, './html/setting.html'))
}





// 便签展示界面
const createShowWindow = () => {
    if (showWindow) {
        return
    }


    showWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        resizable: false,
        icon: path.join(__dirname, './icons/wind.png'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // 打开开发者1
    // showWindow.webContents.openDevTools()


    showWindow.setMenu(null)
    showWindow.on('closed', () => showWindow = null)
    showWindow.loadFile(path.join(__dirname, './html/showTodo.html'))
}


// 创建系统托盘
const createTray = () => {
    // 托盘图标
    const iconPath = path.join(__dirname, './icons/wind.png')

    let icon
    try {
        icon = nativeImage.createFromPath(iconPath)
    } catch (error) {
        icon = nativeImage.createEmpty()
    }

    tray = new Tray(icon)

    // 创建上下文菜单
    const contextMenu = Menu.buildFromTemplate([
        {
            label: '设置',
            click: () => {
                createSettingWindow()
            }
        },
        {
            label: '显示/隐藏',
            click: () => {
                if (mainWindow.isVisible()) {
                    mainWindow.hide()
                } else {
                    mainWindow.show()
                }
            }
        },
        {
            label: '添加待办',
            click: () => {

            }
        },
        {
            label: '查看待办',
            click: () => {

            }
        },
        {
            label: '退出',
            click: () => {
                app.quit()
            }
        }
    ])


    // 托盘鼠标悬停
    tray.setToolTip('Salvation lies within')

    // 设置上下文菜单
    tray.setContextMenu(contextMenu)

    // 点击托盘隐藏或显示窗口
    tray.on('click', () => {
        if (mainWindow.isVisible()) {
            mainWindow.hide()
        } else {
            mainWindow.show()
        }
    })
}




// 弹窗
const createTip = (parentWindow) => {
    if (tip) tip.close()

    tip = new BrowserWindow({
        width: 400,
        height: 200,
        frame: false,
        resizable: false,
        icon: path.join(__dirname, 'icon.png'),
        parent: parentWindow,
        modal: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        }
    })


    tip.on('blur', () => {

    })

    tip.on('closed', () => tip = null)

    tip.loadFile(path.join(__dirname, 'html/tip.html'))
}


















app.on('ready', () => {
    createMainWindow()
    createTray()
})


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})



// 获取配置文件信息
ipcMain.handle('getSettingFile', () => {
    return readSettingFile()
})


ipcMain.handle('create-setting-window', () => {
    createSettingWindow()
})

ipcMain.handle('get-setting-model', () => {
    return getSetting()
})


// 创建弹窗
ipcMain.handle('create-tip', async (event) => {
    const parentWindow = BrowserWindow.fromWebContents(event.sender)
    const result = await createTip(parentWindow)
    return result
})


// 创建展示界面
ipcMain.handle('create-show-window', () => {
    createShowWindow()
})


// 关闭弹窗
ipcMain.handle('close-tip', () => {
    tip.close()
    tip = null
})


// 关闭设置界面
ipcMain.handle('close-setting-window', () => {
    settingWindow.close()
    settingWindow = null
})

// 获取父窗口信息
ipcMain.handle('get-tip-parent-info', (event) => {
    const childWindow = BrowserWindow.fromWebContents(event.sender)
    const parentWindow = childWindow.getParentWindow()

    if (parentWindow) {
        return parentWindow.getTitle()
    } else {
        return null
    }
})


// 接受数据
ipcMain.handle(('get-tip-data'), (event, data) => {
    const tipWindow = BrowserWindow.fromWebContents(event.sender)
    const parentWindow = tipWindow.getParentWindow()

    if (parentWindow) parentWindow.webContents.send('tip-data-response', data)

    return { success: true, message: '获取成功' }
})


// 接受配置文件的数据
ipcMain.handle('get-setting-data', (event, data) => {
    // 将数据保存到配置文件
    try {
        // 修正主窗口大小
        let width
        let height

        let timeWidth = +data.ui.timeFontSize * 5
        let timeHeight = +data.ui.timeFontSize
        let dataWidth = +data.ui.timeFontSize * (data.ui.dateContent ? data.ui.dateContent.length : 10)
        let dataHeight = +data.ui.timeFontSize

        width = Math.max(timeWidth, dataWidth) + 20
        height = timeHeight + dataHeight + 80


        // 映射配置数据到setting.properties文件的键名
        const configMap = {
            'WinWidth': width,
            'WinHeight': height,
            'bgc': data.ui.bgc,
            'font': data.ui.font,
            'fontSize': data.ui.fontSize,
            'fontColor': data.ui.fontColor,
            'btnBorderColor': data.ui.btnBorderColor,
            'btnBgColor': data.ui.btnColor,
            'btnFontColor': data.ui.btnFontColor,
            'btnFontSize': data.ui.btnFontSize,
            'textBorderColor': data.ui.textBorderColor,
            'textBgColor': data.ui.textColor,
            'textFontColor': data.ui.textFontColor,
            'textFontSize': data.ui.textFontSize,
            'timeFontColor': data.ui.timeFontColor,
            'timeFontSize': data.ui.timeFontSize,
            'dateFontColor': data.ui.dateFontColor,
            'dateFontSize': data.ui.dateFontSize,
            'dateFormat': data.ui.dateFormat,
            'dateContent': data.ui.dateContent.trim(),
            'tipStyle': data.ui.tipStyle,
            'addTodo': data.Interaction.addTodo,
            'showTodo': data.Interaction.showTodo,
            'updateTodo': data.Interaction.updateTodo,
            'isRemind': data.Interaction.isRemind,
            'isAutoStart': data.Interaction.isAutoStart
        }

        // 写入配置文件
        writeSettingFile(configMap)
    } catch (error) {
        console.error('保存配置文件失败：' + error)
    }
})


// 获取待办事项
ipcMain.handle('get-todo-list', () => {
    return new TodoManager().loadTodos()
})


// 添加待办
ipcMain.on('add-todo', (event, data) => { 
    new TodoManager().addTodo(data)
})


// 修改待办
ipcMain.on('update-todo', (event, data) => { 
    new TodoManager().updateTodo(data)
})


// 删除待办
ipcMain.on('delete-todo', (event, data) => { 
    new TodoManager().deleteTodo(data)
})




















// 修改配置文件
function writeSettingFile(data) {
    try {
        const settingFilePath = path.join(__dirname, 'setting.properties')
        let settingContent = fs.readFileSync(settingFilePath, 'utf-8')

        // 更改配置文件
        for (const [key, value] of Object.entries(data)) {

            const trimmedValue = typeof value === 'string' ? value.trim() : value
            const regex = new RegExp(`(${key}\\s*=\\s*).*`, 'i')

            if (regex.test(settingContent)) {
                settingContent = settingContent.replace(regex, `$1${trimmedValue}`)
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




// 配置数据模型

function getSetting() {
    // 默认配置
    const DEFAULT_CONFIG = {
        ui: {
            // 界面配置
            // 通用
            bgc: '#fff',                  // 背景色
            font: 'Microsoft YaHei',        // 字体
            fontSize: 12,                   // 字体大小
            fontColor: '#000',            // 字体颜色 

            // 按钮
            btnBorderColor: '#000',       // 按钮边框颜色
            btnBgColor: '#fff',           // 按钮背景颜色
            btnFontColor: '#000',         // 按钮字体颜色
            btnFontSize: 12,                // 按钮字体大小

            // 文本框
            textBorderColor: '#000',      // 文本框边框颜色
            textBgColor: '#fff',          // 文本框背景颜色
            textFontColor: '#000',        // 文本框字体颜色
            textFontSize: 12,               // 文本框字体大小

            // 时间
            timeFontColor: '#000',        // 时间字体颜色
            timeFontSize: 12,               // 时间字体大小

            // 日期
            dateFontColor: '#000',        // 日期字体颜色
            dateFontSize: 12,               // 日期字体大小
            dateFormat: 'yyyy-MM-dd',       // 日期格式
            dateContent: '',                // 日期内容自定义

            // 提示
            tipStyle: 'default'             // 提示样式
        },
        Interaction: {
            // 交互
            addTodo: ['w', 'a'],            // 添加任务
            showTodo: ['w', 's'],           // 展示任务
            updateTodo: ['w', 'u'],         // 更新任务

            // 事件到期时间提醒
            isRemind: true,                 // 是否提醒 
            // 开机自启
            isAutoStart: true               // 是否开机自启
        }
    }

    // 解析快捷键配置
    const parseShortcut = (shortcutStr, defaultVal) => {
        if (shortcutStr) {
            return shortcutStr.split('+').map(key => key.trim())
        }
        return defaultVal
    }

    // 解析布尔值配置
    const parseBoolean = (boolStr, defaultVal) => {
        if (boolStr !== undefined) {
            return boolStr === 'true' || boolStr === true
        }
        return defaultVal
    }

    const getConfig = async () => {
        // 获取配置
        try {
            const CONFIG = readSettingFile()

            // 确保 CONFIG 是一个对象，如果不是则使用空对象
            const configData = CONFIG && typeof CONFIG === 'object' ? CONFIG : {}

            const customConfig = {
                ui: {
                    // 界面配置
                    // 通用
                    bgc: configData.bgc || DEFAULT_CONFIG.ui.bgc,
                    font: configData.font || DEFAULT_CONFIG.ui.font,
                    fontSize: configData.fontSize || DEFAULT_CONFIG.ui.fontSize,
                    fontColor: configData.fontColor || DEFAULT_CONFIG.ui.fontColor,

                    // 按钮
                    btnBorderColor: configData.btnBorderColor || DEFAULT_CONFIG.ui.btnBorderColor,
                    btnBgColor: configData.btnBgColor || DEFAULT_CONFIG.ui.btnBgColor,
                    btnFontColor: configData.btnFontColor || DEFAULT_CONFIG.ui.btnFontColor,
                    btnFontSize: configData.btnFontSize || DEFAULT_CONFIG.ui.btnFontSize,

                    // 文本框
                    textBorderColor: configData.textBorderColor || DEFAULT_CONFIG.ui.textBorderColor,
                    textBgColor: configData.textBgColor || DEFAULT_CONFIG.ui.textBgColor,
                    textFontColor: configData.textFontColor || DEFAULT_CONFIG.ui.textFontColor,
                    textFontSize: configData.textFontSize || DEFAULT_CONFIG.ui.textFontSize,

                    // 时间
                    timeFontColor: configData.timeFontColor || DEFAULT_CONFIG.ui.timeFontColor,
                    timeFontSize: configData.timeFontSize || DEFAULT_CONFIG.ui.timeFontSize,

                    // 日期
                    dateFontColor: configData.dateFontColor || DEFAULT_CONFIG.ui.dateFontColor,
                    dateFontSize: configData.dateFontSize || DEFAULT_CONFIG.ui.dateFontSize,
                    dateFormat: configData.dateFormat || DEFAULT_CONFIG.ui.dateFormat,
                    dateContent: configData.dateContent || DEFAULT_CONFIG.ui.dateContent,

                    // 提示
                    tipStyle: configData.tipStyle || DEFAULT_CONFIG.ui.tipStyle
                },
                Interaction: {
                    // 交互
                    addTodo: parseShortcut(configData.addTodo, DEFAULT_CONFIG.Interaction.addTodo),
                    showTodo: parseShortcut(configData.showTodo, DEFAULT_CONFIG.Interaction.showTodo),
                    updateTodo: parseShortcut(configData.updateTodo, DEFAULT_CONFIG.Interaction.updateTodo),

                    // 事件到期时间提醒
                    isRemind: parseBoolean(configData.isRemind, DEFAULT_CONFIG.Interaction.isRemind),

                    // 开机自启
                    isAutoStart: parseBoolean(configData.isAutoStart, DEFAULT_CONFIG.Interaction.isAutoStart)
                }
            }

            return customConfig
        } catch (error) {
            console.error('获取配置失败:', error)
            return DEFAULT_CONFIG
        }
    }

    return getConfig()
}







class TodoManager {
    constructor(storagePath = path.join(__dirname, '../todos.json')) {
        this.storagePath = storagePath
    }


    async loadTodos() {
        try {
            const data = await fsp.readFile(this.storagePath, 'utf8')
            return JSON.parse(data)
        } catch (error) {
            // 文件找不到创建默认结构
            return {
                version: '2.0',
                lastUpdate: Date.now().toString(),
                todos: []
            }
        }
    }




    async saveTodos(todoData) {
        todoData.lastUpdate = Date.now().toString()
        await fsp.writeFile(this.storagePath, JSON.stringify(todoData, null, 2))
    }



    async addTodo(todo) {
        const data = await this.loadTodos()
        todo.id = Date.now().toString()
        data.todos.push(todo)
        await this.saveTodos(data)
        return todo.id
    }


    async updateTodo(id, updates) {
        const data = await this.loadTodos()
        const index = data.todos.findIndex(todo => todo.id === id)

        if (index !== -1) {
            data.todos[index] = {
                ...data.todos[index],
                ...updates
            }

            await this.saveTodos(data)
        }
    }

    async deleteTodo(id) {
        const data = await this.loadTodos()
        data.todos = data.todos.filter(todo => todo.id !== id)
        await this.saveTodos(data)
    }
}