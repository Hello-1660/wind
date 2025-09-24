document.addEventListener('DOMContentLoaded', async () => {
    // 获取数据模型
    const config = await window.electronAPI.getSettingModel()

    // 渲染配置
    const body = document.body
    const input = document.querySelectorAll('input')
    const deleteItemList = document.querySelectorAll('#delete_item')
    const showStatusItemList = document.querySelectorAll('.show_status_item')
    const todoTimeDay = document.querySelector('.todo_time_day')
    const todoTimeMonth = document.querySelector('.todo_time_month')
    const todoContentTitle = document.querySelector('.todo_content_title')
    const todoContentStatus = document.querySelector('.todo_content_status')
    const todoTheme = document.querySelector('#todo_theme')
    const todoContent = document.querySelector('#todo_content')
    const addRemind = document.querySelector('#add_remind')
    const addAddress = document.querySelector('#add_address')
    const addStatus = document.querySelector('#add_status')
    const status = document.querySelector('#status')
    

    setConfig()



    addStatus.addEventListener('mouseenter', () => {
        status.classList.remove('none')
    })


    if (status) {
        status.addEventListener('mouseleave', () => {
            status.classList.add('none')
        })

        status.addEventListener('mouseover', (e) => { 
            status.classList.remove('none')
        })
    }

    if (deleteItemList) {
        deleteItemList.forEach(item => {
            item.addEventListener('click', () => {
                item.parentNode.remove()
            })
        })
    }




    // 渲染配置
    function setConfig() {
        if (!config) return

        // 通用配置
        body.style.fontSize = config.ui.fontSize + 'px'
        body.style.fontFamily = config.ui.font
        body.style.color = config.ui.fontColor
        body.style.backgroundColor = config.ui.bgc


        input.forEach(item => {
            // 按钮属性
            if (item.type === 'button') {
                item.style.backgroundColor = config.ui.btnBgColor
                item.style.borderColor = config.ui.btnBorderColor
                item.style.color = config.ui.btnFontColor
                item.style.fontSize = config.ui.btnFontSize + 'px'
            }

            // 文本框属性
            if (item.type === 'text') {
                item.style.backgroundColor = config.ui.textBgColor
                item.style.borderColor = config.ui.textBorderColor
                item.style.color = config.ui.textFontColor
                item.style.fontSize = config.ui.textFontSize + 'px'
                item.style.height = +config.ui.textFontSize + 5 + 'px'
            }
        })


        // 多行文本框
        todoContent.style.backgroundColor = config.ui.textBgColor
        todoContent.style.borderColor = config.ui.textBorderColor
        todoContent.style.color = config.ui.textFontColor
        todoContent.style.fontSize = config.ui.textFontSize + 'px'
    }
})