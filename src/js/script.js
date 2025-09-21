document.addEventListener('DOMContentLoaded', async () => {
   // 获取设置数据模型
   const config = await window.electronAPI.getSettingModel()


    // 渲染配置
    const time = document.querySelector('#time')
    const date = document.querySelector('#date')

    setConfig(config)
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