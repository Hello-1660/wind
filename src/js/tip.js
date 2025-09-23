document.addEventListener('DOMContentLoaded', async () => {
    const close = document.querySelector('.close')
    const context = document.querySelector('.context')
    const parentTitle = await window.electronAPI.getParentWindowInfo()


    if (parentTitle === '设置') {
        context.innerText = '部分配置项需要重启软件才能生效'
    }

    close.addEventListener('click', async () => {
        window.electronAPI.closeTip()
    })


    document.addEventListener('dblclick', async () => {
        window.electronAPI.closeTip()
    })


    document.addEventListener('contextmenu', async () => {
        window.electronAPI.sendTipData(true)
        window.electronAPI.closeTip()
    })
})