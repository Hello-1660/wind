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
                item.style.backgroundColor = config.ui.btnBgcColor
                item.style.borderColor = config.ui.btnBorderColor
                item.style.color = config.ui.btnFontColor
                item.style.fontSize = config.ui.btnFontSize + 'px'
            }

            // 
            if (item.type === 'text') {
                item.style.backgroundColor = config.ui.textBgcColor
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
        fontFamily.style.width = +config.ui.fontSize * 5 + 40 + 'px'
        tipStyle.style.width = +config.ui.fontSize * 2 + 40 + 'px'
    }




    // 下拉框
    if (fontFamily && fontFamilys) {
        fontFamily.addEventListener('click', (e) => {
            e.stopPropagation()
            fontFamilys.style.display = fontFamilys.style.display === 'none' ? 'block' : 'none'
        })

        // 下拉点击条目
        const fontFamilysItem = fontFamilys.querySelectorAll('div')
        fontFamilysItem.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation()

                if (fontFamilyHead) {
                    fontFamilyHead.innerText = item.innerText 
                }

                fontFamilys.style.display = 'none'
            })
        })
    }

    if (tipStyle && tipStyles) {
        tipStyle.addEventListener('click', (e) => {
            e.stopPropagation()
            tipStyles.style.display = tipStyles.style.display === 'none' ? 'block' : 'none'
        })

        const tipStylesItem = tipStyles.querySelectorAll('div')
        tipStylesItem.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation()

                if (tipStyleHead) {
                    tipStyleHead.innerText = item.innerText 
                }

                tipStyles.style.display = 'none'
            })
        })
    }


    // 点击其他区域关闭
    document.addEventListener('click', () => {
        if (fontFamilys) fontFamilys.style.display = 'none'
        if (tipStyles) tipStyles.style.display = 'none'
    })


    // 防止点击自生是隐藏
    if (tipStyle) {
        tipStyle.addEventListener('click', (e) => {
            e.stopPropagation()
        })
    }

    if (fontFamily) {
        fontFamilys.addEventListener('click', (e) => {
            e.stopPropagation()
        })
    }
})