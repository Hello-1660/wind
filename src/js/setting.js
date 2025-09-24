document.addEventListener('DOMContentLoaded', async () => {
    // 获取数据模型
    const config = await window.electronAPI.getSettingModel()


    //  渲染配置
    const body = document.body
    const input = document.querySelectorAll('input')
    const a = document.querySelectorAll('a')
    const fontFamily = document.querySelector('.fontFamily')
    const fontFamilys = document.querySelector('#fontFamilys')
    const tipStyle = document.querySelector('.tipStyle')
    const tipStyles = document.querySelector('#tipStyles')

    // 数据回显
    const fontSize = document.querySelector('#fontSize')
    const fontFamilyHead = document.querySelector('#fontFamilyHead')
    const fontColor = document.querySelector('#fontColor')
    const bgc = document.querySelector('#bgc')
    const buttonColor = document.querySelector('#buttonColor')
    const buttonBorderColor = document.querySelector('#buttonBorderColor')
    const buttonFontColor = document.querySelector('#buttonFontColor')
    const buttonFontSize = document.querySelector('#buttonFontSize')
    const textColor = document.querySelector('#textColor')
    const textBorderColor = document.querySelector('#textBorderColor')
    const textFontColor = document.querySelector('#textFontColor')
    const textFontSize = document.querySelector('#textFontSize')
    const timeFontColor = document.querySelector('#timeFontColor')
    const timeFontSize = document.querySelector('#timeFontSize')
    const dateFontColor = document.querySelector('#dateFontColor')
    const dateFontSize = document.querySelector('#dateFontSize')
    const dateFormat = document.querySelector('#dateFormat')
    const dateContent = document.querySelector('#dateContent')
    const tipStyleHead = document.querySelector('#tipStyleHead')
    const addTodo = document.querySelector('#addTodo')
    const showTodo = document.querySelector('#showTodo')
    const updateTodo = document.querySelector('#updateTodo')
    // 是否开机自启
    const enable = document.querySelector('#enable')
    const desable = document.querySelector('#desable')
    let isEnable = enable.checked ? true : false

    // 是否开启提示
    const entip = document.querySelector('#entip')
    const destip = document.querySelector('#destip')
    let isEntip = entip.checked ? true : false

    // 字体样式表
    const fonts = {
        'Microsoft YaHei': '微软雅黑',
        'SimSun': '宋体',
        'SimHei': '黑体',
        'Kai': '楷体',
        'FangSong': '仿宋',
    }

    // 弹窗样式表
    const tips = {
        'default': '默认'
    }


    setConfig()


    // 弹窗返回数据
    const handleTipResponse = (event, data) => {
        if (data === true) {
            let selectFont = 'Microsoft YaHei'
            let selectTip = 'default'

            for (const [key, value] of Object.entries(fonts)) {
                if (value === fontFamilyHead.innerText) {
                    selectFont = key
                    break
                }
            }

            for (const [key, value] of Object.entries(tips)) {
                if (value === tipStyleHead.innerText) {
                    selectTip = key
                    break
                }
            }



            const setConfig = {
                ui: {
                    bgc: bgc.value,
                    font: selectFont,
                    fontSize: fontSize.value,
                    fontColor: fontColor.value,
                    btnBorderColor: buttonBorderColor.value,
                    btnBgColor: buttonColor.value,
                    btnFontColor: buttonFontColor.value,
                    btnFontSize: buttonFontSize.value,
                    textBorderColor: textBorderColor.value,
                    textBgColor: textColor.value,
                    textFontColor: textFontColor.value,
                    textFontSize: textFontSize.value,
                    timeFontColor: timeFontColor.value,
                    timeFontSize: timeFontSize.value,
                    dateFontColor: dateFontColor.value,
                    dateFontSize: dateFontSize.value,
                    dateFormat: dateFormat.value,
                    dateContent: dateContent.value.trim(),
                    tipStyle: selectTip
                },
                Interaction: {
                    addTodo: addTodo.value,
                    showTodo: showTodo.value,
                    updateTodo: updateTodo.value,
                    isRemind: isEnable,
                    isAutoStart: isEntip
                }
            }

            window.electronAPI.sendSettingData(setConfig)
        }

    }
    window.electronAPI.onTipDataResponse(handleTipResponse)





    // 渲染配置
    function setConfig() {
        if (!config) return

        // 通用设置
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

        // a 标签
        a.forEach(item => {
            item.style.color = config.ui.fontColor
        })

        // 下拉框
        const liHeight = document.querySelectorAll('li')[0].offsetHeight

        fontFamily.style.width = +config.ui.fontSize * 5 + 40 + 'px'
        fontFamily.style.left = +config.ui.fontSize * 4 + 'px'
        fontFamilyHead.style.height = liHeight + 'px'
        tipStyle.style.width = +config.ui.fontSize * 2 + 40 + 'px'
        tipStyle.style.left = +config.ui.fontSize * 5 + 'px'
        tipStyleHead.style.height = liHeight + 'px'



        // 配置文件数回显
        fontSize.value = config.ui.fontSize
        fontFamilyHead.innerText = fonts[config.ui.font]
        fontColor.value = config.ui.fontColor
        bgc.value = config.ui.bgc
        buttonColor.value = config.ui.btnBgColor
        buttonBorderColor.value = config.ui.btnBorderColor
        buttonFontColor.value = config.ui.btnFontColor
        buttonFontSize.value = config.ui.btnFontSize
        textColor.value = config.ui.textFontColor
        textBorderColor.value = config.ui.textBorderColor
        textFontColor.value = config.ui.textFontColor
        textFontSize.value = config.ui.textFontSize
        timeFontColor.value = config.ui.timeFontColor
        timeFontSize.value = config.ui.timeFontSize
        dateFontColor.value = config.ui.dateFontColor
        dateFontSize.value = config.ui.dateFontSize
        dateFormat.value = config.ui.dateFormat
        dateContent.value = config.ui.dateContent
        tipStyleHead.innerText = tips[config.ui.tipStyle]
        addTodo.value = config.Interaction.addTodo[0] + '+' + config.Interaction.addTodo[1]
        showTodo.value = config.Interaction.showTodo[0] + '+' + config.Interaction.showTodo[1]
        updateTodo.value = config.Interaction.updateTodo[0] + '+' + config.Interaction.updateTodo[1]

        if (config.Interaction.isRemind == true) {
            enable.checked = true
            desable.checked = false
            isEnable = true
        } else {
            desable.checked = true
            enable.checked = false
            isEnable = false
        }

        if (config.Interaction.isAutoStart == true) {
            entip.checked = true
            destip.checked = false
            isEntip = true
        } else {
            destip.checked = true
            entip.checked = false
            isEntip = false
        }
    }



    // 双击保存
    document.addEventListener('contextmenu', () => {
        window.electronAPI.createTip()
    })


    // 下拉框
    fontFamily.addEventListener('click', (e) => {
        e.stopPropagation()
        fontFamilys.style.maxHeight = 500 + 'px'
    })
  


    // 下拉点击条目
    const fontFamilysItem = fontFamilys.querySelectorAll('div')
    fontFamilysItem.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation()

            fontFamilys.style.maxHeight = 0 + 'px'
            fontFamilyHead.innerText = item.innerText
        })
    })



    tipStyle.addEventListener('click', (e) => {
        e.stopPropagation()
        tipStyles.style.maxHeight = 500 + 'px'
    })


    // 单选按钮点击事件
    enable.addEventListener('click', () => {
        isEnable = true
    })

    desable.addEventListener('click', () => {
        isEnable = false
    })

    entip.addEventListener('click', () => {
        isEntip = true
    })

    destip.addEventListener('click', () => {
        isEntip = false
    })

    const tipStylesItem = tipStyles.querySelectorAll('div')
    tipStylesItem.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation()

            tipStyles.style.maxHeight = 0 + 'px'
            tipStyleHead.innerText = item.innerText
        })
    })



    // 点击其他区域关闭
    document.addEventListener('click', () => {
        fontFamilys.style.maxHeight = 0 + 'px'
        tipStyles.style.maxHeight = 0 + 'px'
    })


    // 防止点击自生是隐藏
    tipStyles.addEventListener('click', (e) => {
        e.stopPropagation()
    })



    fontFamilys.addEventListener('click', (e) => {
        e.stopPropagation()
    })



    document.addEventListener('dblclick', async (e) => {
        window.electronAPI.closeSetting()
    })



    window.addEventListener('beforeunload', () => {
        // 移除之前添加的监听器
        window.electronAPI.removeTipDataResponseListener(handleTipResponse);
    })
})