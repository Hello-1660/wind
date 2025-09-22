const { contextBridge, ipcRenderer } = require('electron')


contextBridge.exposeInMainWorld('electronAPI', {
    getSettingFile: () => ipcRenderer.invoke('getSettingFile'),
    getSettingModel: () => ipcRenderer.invoke('get-setting-model'),
    createSettingWindow: () => ipcRenderer.invoke('create-setting-window'),
    createTip: (event) => ipcRenderer.invoke('create-tip'),
    closeSetting: () => ipcRenderer.invoke('close-setting-window'),
    closeTip: () => ipcRenderer.invoke('close-tip'),
    sendTipData: (data) => ipcRenderer.invoke('get-tip-data', data),
    sendSettingData: (data) => ipcRenderer.invoke('get-setting-data', data),
    getParentWindowInfo: () => ipcRenderer.invoke('get-tip-parent-info'),
    onTipDataResponse: (callback) => ipcRenderer.on('tip-data-response', callback),
    removeTipDataResponseListener: (callback) => ipcRenderer.removeListener('tip-data-response', callback)
})