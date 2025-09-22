document.addEventListener('DOMContentLoaded', async () => {
    const close = document.querySelector('.close')
    const context = document.querySelector('.context')
    const parentTitle = await window.electronAPI.getParentWindowInfo()



    if (parentTitle === '设置') {
        // 填充内容
        context.innerText = '是否确认保存该设置,部分设置需要重启软件才能生效'
    }


    close.addEventListener('click', async () => {
        window.electronAPI.closeTip()
    })


    document.addEventListener('contextmenu', async () => {
        window.electronAPI.closeTip()
    })


    document.addEventListener('dblclick', async () => {
        window.electronAPI.sendTipData(true)
        window.electronAPI.closeTip()
    })
})