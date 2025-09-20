document.addEventListener('DOMContentLoaded', async () => {
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
            return shortcutStr.split(',').map(key => key.trim())
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
            const CONFIG = await window.electronAPI.getSettingFile();

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


    // 渲染配置
    const time = document.querySelector('#time')
    const date = document.querySelector('#date')

    setConfig(await getConfig())
    async function setConfig(config) {
        if (!config) return

        time.style.color = config.ui.timeFontColor
        time.style.fontSize = config.ui.timeFontSize + 'px'
        date.style.color = config.ui.dateFontColor 
        date.style.fontSize = config.ui.dateFontSize + 'px'
 

        setInterval(() => {
            const now = new Date()
            timeList = now.toLocaleTimeString().split(':')
            time.innerHTML = timeList[0] + ':' + timeList[1]
        }, 1000)

        if (config.ui.dateContent) {
            date.innerHTML = config.ui.dateContent
        } else {
            const format = config.ui.dateFormat

            updateDate(format)

            setInterval(() => {
                updateDate(format)
            }, 60000)
        }
    }


    // 日期格式化函数
    function updateDate(format) {
        const now = new Date()
        let formattedDate = ''
        
        // 简单的日期格式化实现
        if (format === 'yyyy-MM-dd') {
            formattedDate = now.getFullYear() + '-' + 
                           String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                           String(now.getDate()).padStart(2, '0')
        } else {
            // 默认格式
            formattedDate = now.toLocaleDateString()
        }
        
        date.innerHTML = formattedDate
    }
})