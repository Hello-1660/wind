const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage, Notification } = require('electron')
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
// 开机自启
const isAutoStart = process.argv.includes('--auto-start');






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
        show: !isAutoStart,
        icon: path.join(__dirname, 'icon.png'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        }
    })

    // 如果是开机自启，确保窗口隐藏并只显示托盘
    if (isAutoStart) {
        mainWindow.hide();
    }


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
            label: '查看待办',
            click: () => {
                createShowWindow()
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

    // 设置应用ID（Windows通知必要）
    app.setAppUserModelId('wind')

    // 设置开机自启
    getSetting().then(settingConfig => {
        const settings = {
            openAtLogin: settingConfig.Interaction.isAutoStart,
            path: process.execPath,
            args: ['--auto-start']
        };
        
        // 只在打包后设置开机自启
        if (app.isPackaged) {
            app.setLoginItemSettings(settings);
            console.log('开机自启设置:', app.getLoginItemSettings());
        }
        
        // 如果是开机自启启动，确保主窗口隐藏
        if (isAutoStart && mainWindow) {
            mainWindow.hide();
        }
    });

    // 延迟加载提醒，确保窗口已创建
    setTimeout(() => {
        notificationManager.loadAllReminders()
    }, 2000)
})


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})


// 应用退出前清理
app.on('before-quit', () => {
    notificationManager.clearAllReminders();
});


// 获取配置文件信息
ipcMain.handle('getSettingFile', () => {
    return readSettingFile()
})


// 创建设置界面
ipcMain.handle('create-setting-window', () => {
    createSettingWindow()
})

// 获取设置数据模型
ipcMain.handle('get-setting-model', () => {
    return getSetting()
})

// 获取原始设置数据模型
ipcMain.handle('get-setting-model-origin', () => {
    return {
        ui: {
            // 界面配置
            // 通用
            bgc: '#ffffff',                  // 背景色
            font: 'Microsoft YaHei',        // 字体
            fontSize: 12,                   // 字体大小
            fontColor: '#000000',            // 字体颜色 

            // 按钮
            btnBorderColor: '#000000',       // 按钮边框颜色
            btnBgColor: '#ffffff',           // 按钮背景颜色
            btnFontColor: '#000000',         // 按钮字体颜色
            btnFontSize: 12,                // 按钮字体大小

            // 文本框
            textBorderColor: '#000000',      // 文本框边框颜色
            textBgColor: '#ffffff',          // 文本框背景颜色
            textFontColor: '#000000',        // 文本框字体颜色
            textFontSize: 12,               // 文本框字体大小

            // 时间
            timeFontColor: '#000000',        // 时间字体颜色
            timeFontSize: 12,               // 时间字体大小

            // 日期
            dateFontColor: '#000000',        // 日期字体颜色
            dateFontSize: 12,               // 日期字体大小
            dateFormat: 'yyyy-MM-dd',       // 日期格式
            dateContent: '',                // 日期内容自定义

            // 提示
            tipStyle: 'default'             // 提示样式
        },
        Interaction: {
            // 交互
            addTodo: ['Ctrl', 'n'],            // 添加任务
            showTodo: ['Ctrl', 'd'],           // 展示任务
            updateTodo: ['Ctrl', 'm'],         // 更新任务

            // 事件到期时间提醒
            isRemind: true,                 // 是否提醒 
            // 开机自启
            isAutoStart: true               // 是否开机自启
        }
    }
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
            'btnBgColor': data.ui.btnBgColor,
            'btnFontColor': data.ui.btnFontColor,
            'btnFontSize': data.ui.btnFontSize,
            'textBorderColor': data.ui.textBorderColor,
            'textBgColor': data.ui.textBgColor,
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
ipcMain.on('update-todo', (event, id, data) => {
    new TodoManager().updateTodo(id, data)
})


// 删除待办
ipcMain.on('delete-todo', (event, id) => {
    new TodoManager().deleteTodo(id)
})

// 重新加载所有提醒
ipcMain.handle('reload-reminders', () => {
    notificationManager.loadAllReminders();
});

// 更新提醒设置
ipcMain.handle('update-reminder-setting', (event, isEnabled) => {
    notificationManager.updateReminderSetting(isEnabled);
});

// 获取提醒状态
ipcMain.handle('get-reminder-status', () => {
    return notificationManager.isRemindEnabled;
});

// 获取咖开机自启状态
ipcMain.on('setting-data', (event, data) => {
    try {
        const configMap = {
            'WinWidth': 300,
            'WinHeight': 200,
            'winX': winPath.winX,
            'winY': winPath.winY,
            'bgc': data.ui.bgc,
            'font': data.ui.font,
            'fontSize': data.ui.fontSize,
            'fontColor': data.ui.fontColor,
            'btnBorderColor': data.ui.btnBorderColor,
            'btnBgColor': data.ui.btnBgColor,
            'btnFontColor': data.ui.btnFontColor,
            'btnFontSize': data.ui.btnFontSize,
            'textBorderColor': data.ui.textBorderColor,
            'textBgColor': data.ui.textBgColor,
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
        
        // 更新开机自启设置
         // 更新开机自启设置 - 修复版本
        const settings = {
            openAtLogin: data.Interaction.isAutoStart,
            path: process.execPath,
            args: ['--auto-start']
        };
        
        if (app.isPackaged) {
            app.setLoginItemSettings(settings);
        }
    } catch (error) {
        console.error('保存配置文件失败：' + error)
    }
})











// 获取设置文件路径
function getSettingFilePath() {
    const { app } = require('electron');
    const userDataPath = app.getPath('userData');
    const path = require('path');
    return path.join(userDataPath, 'setting.properties');
}




// 修改配置文件

// 修改配置文件
// 修改配置文件
function writeSettingFile(data) {
    try {
        const fs = require('fs');
        const path = require('path');
        const { app } = require('electron');
        
        // 确保用户数据目录存在
        const userDataPath = app.getPath('userData');
        if (!fs.existsSync(userDataPath)) {
            fs.mkdirSync(userDataPath, { recursive: true });
        }
        
        // 使用用户数据目录
        const settingFilePath = getSettingFilePath();
        
        // 如果文件不存在，从应用资源目录复制默认文件
        if (!fs.existsSync(settingFilePath)) {
            const defaultSettingPath = path.join(__dirname, 'setting.properties');
            fs.copyFileSync(defaultSettingPath, settingFilePath);
        }
        
        let settingContent = fs.readFileSync(settingFilePath, 'utf-8');

        // 更改配置文件
        for (const [key, value] of Object.entries(data)) {
            const trimmedValue = typeof value === 'string' ? value.trim() : value;
            const regex = new RegExp(`(${key}\\s*=\\s*).*`, 'i');

            if (regex.test(settingContent)) {
                settingContent = settingContent.replace(regex, `$1${trimmedValue}`);
            }
        }

        fs.writeFileSync(settingFilePath, settingContent, 'utf-8');
    } catch (error) {
        console.error('更新配置文件失败：' + error);
    }
}


// 读取配置文件
function readSettingFile() {
  try {
    const fs = require('fs');
    const { app } = require('electron');
    const path = require('path');
    
    // 确保用户数据目录存在
    const userDataPath = app.getPath('userData');
    if (!fs.existsSync(userDataPath)) {
      fs.mkdirSync(userDataPath, { recursive: true });
    }
    
    // 使用用户数据目录
    const settingPath = getSettingFilePath();
    
    // 如果用户数据目录中没有配置文件，则从应用资源目录复制
    if (!fs.existsSync(settingPath)) {
      const defaultSettingPath = path.join(__dirname, 'setting.properties');
      fs.copyFileSync(defaultSettingPath, settingPath);
    }
    
    const setting = fs.readFileSync(settingPath, 'utf-8');

    // 解析
    const config = {};
    const lines = setting.split('\n');

    lines.forEach(line => {
      line = line.trim();

      // 跳过空行和注释行
      if (line && !line.startsWith('#') && !line.startsWith(';')) {
        const [key, value] = line.split('=');

        if (key && value) {
          config[key.trim()] = value.trim();
        }
      }
    });

    return config;
  } catch (error) {
    console.error('读取配置文件失败：' + error);
    return {};
  }
}


// 配置数据模型

function getSetting() {
    // 默认配置
    const DEFAULT_CONFIG = {
        ui: {
            // 界面配置
            // 通用
            bgc: '#ffffff',                  // 背景色
            font: 'Microsoft YaHei',        // 字体
            fontSize: 12,                   // 字体大小
            fontColor: '#000000',            // 字体颜色 

            // 按钮
            btnBorderColor: '#000000',       // 按钮边框颜色
            btnBgColor: '#ffffff',           // 按钮背景颜色
            btnFontColor: '#000000',         // 按钮字体颜色
            btnFontSize: 12,                // 按钮字体大小

            // 文本框
            textBorderColor: '#000000',      // 文本框边框颜色
            textBgColor: '#ffffff',          // 文本框背景颜色
            textFontColor: '#000000',        // 文本框字体颜色
            textFontSize: 12,               // 文本框字体大小

            // 时间
            timeFontColor: '#000000',        // 时间字体颜色
            timeFontSize: 12,               // 时间字体大小

            // 日期
            dateFontColor: '#000000',        // 日期字体颜色
            dateFontSize: 12,               // 日期字体大小
            dateFormat: 'yyyy-MM-dd',       // 日期格式
            dateContent: '',                // 日期内容自定义

            // 提示
            tipStyle: 'default'             // 提示样式
        },
        Interaction: {
            // 交互
            addTodo: ['Ctrl', 'n'],            // 添加任务
            showTodo: ['Ctrl', 'd'],           // 展示任务
            updateTodo: ['Ctrl', 'm'],         // 更新任务

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
    constructor() {
        // 修复打包后文件路径问题
        if (app.isPackaged) {
            // 打包后，数据文件应该放在用户数据目录，而不是安装目录
            this.storagePath = path.join(app.getPath('userData'), 'todos.json');
        } else {
            // 开发时保持原路径
            this.storagePath = path.join(__dirname, '../todos.json');
        }
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

        // 添加成功后设置提醒
        if (todo.remindTime) {
            notificationManager.setTodoReminder(todo);
        }

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


            // 更新提醒设置
            const updatedTodo = data.todos[index];

            // 如果状态变为已完成，取消提醒
            if (updates.status === '已完成') {
                notificationManager.cancelTodoReminder(id);
            }
            // 如果提醒时间改变，更新提醒
            else if (updates.remindTime && updates.remindTime !== oldTodo.remindTime) {
                notificationManager.setTodoReminder(updatedTodo);
            }
            // 如果删除了提醒时间，取消提醒
            else if (updates.remindTime === '' && oldTodo.remindTime) {
                notificationManager.cancelTodoReminder(id);
            }
        }
    }

    async deleteTodo(id) {
        const data = await this.loadTodos()
        data.todos = data.todos.filter(todo => todo.id !== id)
        await this.saveTodos(data)


        // 删除待办时取消提醒
        notificationManager.cancelTodoReminder(id);
    }
}


class NotificationManager {
    constructor() {
        this.reminderTimers = new Map();
        this.isRemindEnabled = true;
        this.loadReminderSetting();
    }

    // 加载提醒设置
    loadReminderSetting() {
        try {
            const setting = readSettingFile();
            this.isRemindEnabled = setting.isRemind !== 'false';
        } catch (error) {
            this.isRemindEnabled = true;
        }
    }

    // 修正时间解析方法
    validateAndFormatTime(remindTime) {
        if (!remindTime) return null;
        
        try {
            let date;
            
            // 处理不同的时间格式
            if (remindTime.includes('T')) {
                // ISO 格式: 2024-01-20T09:00:00Z 或 2025-09-26T22:33:00Z
                if (remindTime.endsWith('Z')) {
                    // UTC 时间，转换为本地时间
                    date = new Date(remindTime);
                } else {
                    // 没有时区信息，假设为本地时间
                    date = new Date(remindTime);
                }
            } else {
                // 简单日期时间格式，添加时区信息
                date = new Date(remindTime + 'Z');
            }
            
            // 检查日期是否有效
            if (isNaN(date.getTime())) {
                console.error('无效的日期格式:', remindTime);
                return null;
            }
            
            return date;
        } catch (error) {
            console.error('时间格式解析错误:', error);
            return null;
        }
    }

    // 发送通知
    sendNotification(title, body, todoId = null) {
        if (!this.isRemindEnabled) return null;

        try {
             

            const notification = new Notification({
                title: title || '便签提醒',
                body: body,
                icon: path.join(__dirname, './icons/wind.png'),
                silent: false,
                timeoutType: 'default'
            });

            console.log('png:', path.join(__dirname, './icons/wind.png'));



            notification.on('click', () => {
                if (showWindow) {
                    showWindow.focus();
                    if (todoId) {
                        showWindow.webContents.send('focus-todo', todoId);
                    }
                }
            });

            notification.show();
            return notification;
        } catch (error) {
            console.error('发送通知失败:', error);
            return null;
        }
    }

    // 设置提醒 - 修正时区问题
    setTodoReminder(todo) {
        if (!todo.remindTime || !this.isRemindEnabled || todo.status === '已完成') {
            return;
        }

        const remindDate = this.validateAndFormatTime(todo.remindTime);
        if (!remindDate) return
    

        const remindTime = remindDate.getTime() - 28800000
        const now = Date.now();
        const delay = remindTime - now;

        // 处理已过期的提醒
        if (delay <= 0) {
            
            // 可选：立即发送过期提醒
            if (delay > -24 * 60 * 60 * 1000) { // 24小时内过期的才提醒
                this.sendNotification(
                    `待办已过期: ${todo.theme || '未命名待办'}`,
                    `该待办应在 ${remindDate.toLocaleString('zh-CN')} 提醒\n内容: ${todo.content || '无内容'}`,
                    todo.id
                );
            }
            return;
        }

        // 清除已有的定时器
        if (this.reminderTimers.has(todo.id)) {
            clearTimeout(this.reminderTimers.get(todo.id));
        }

        // 设置新的定时器
        const timer = setTimeout(() => {
            this.sendNotification(
                `待办提醒: ${todo.theme || '未命名待办'}`,
                `内容: ${todo.content || '无内容'}\n截止时间: ${todo.deadline ? new Date(todo.deadline).toLocaleString('zh-CN') : '无'}`,
                todo.id
            );
            this.reminderTimers.delete(todo.id);
        }, delay);

        this.reminderTimers.set(todo.id, timer);
    }

    cancelTodoReminder(todoId) {
        if (this.reminderTimers.has(todoId)) {
            clearTimeout(this.reminderTimers.get(todoId));
            this.reminderTimers.delete(todoId);
            console.log('取消提醒成功:', todoId);
        }
    }

    async loadAllReminders() {
        try {
            const todoManager = new TodoManager();
            const data = await todoManager.loadTodos();
            
            this.clearAllReminders();
            
            console.log(`开始加载 ${data.todos.length} 个待办的提醒设置`);
            
            let validCount = 0;
            let expiredCount = 0;
            
            data.todos.forEach(todo => {
                if (todo.remindTime && todo.status !== '已完成') {
                    this.setTodoReminder(todo);
                    validCount++;
                }
            });
            
            console.log(`提醒加载完成: ${validCount} 个有效提醒, ${expiredCount} 个已过期`);
        } catch (error) {
            console.error('加载提醒失败:', error);
        }
    }

    clearAllReminders() {
        this.reminderTimers.forEach((timer, todoId) => {
            clearTimeout(timer);
        });
        this.reminderTimers.clear();
        console.log('已清除所有提醒');
    }

    updateReminderSetting(isEnabled) {
        this.isRemindEnabled = isEnabled;
        if (!isEnabled) {
            this.clearAllReminders();
            console.log('提醒功能已禁用');
        } else {
            this.loadAllReminders();
            console.log('提醒功能已启用');
        }
    }
}

// 创建全局通知管理器实例
const notificationManager = new NotificationManager()

