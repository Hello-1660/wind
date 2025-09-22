document.addEventListener('DOMContentLoaded', async () => {
    // 获取数据模型
    const config = await window.electronAPI.getSettingModel()


    //  渲染配置
    const body = document.body
    const input = document.querySelectorAll('input')
    const a = document.querySelectorAll('a')
    const fontFamily = document.querySelector('.fontFamily')
    const fontFamilyHead = document.querySelector('#fontFamilyHead')
    const fontFamilys = document.querySelector('#fontFamilys')
    const tipStyle = document.querySelector('.tipStyle')
    const tipStyleHead = document.querySelector('#tipStyleHead')
    const tipStyles = document.querySelector('#tipStyles')




    setConfig(config)

    // 渲染配置
    function setConfig(config) {
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

            // 
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
    }




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

    const tipStylesItem = tipStyles.querySelectorAll('div')
    tipStylesItem.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation()

            tipStyles.style.maxHeight = 0 + 'px'
            tipStyleHead.innerText = item.innerText
        })
    })



    // // 点击其他区域关闭
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
})