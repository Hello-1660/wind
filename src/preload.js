const { contextBridge, ipcRenderer } = require('electron')


contextBridge.exposeInMainWorld('electronAPI', {
    getSettingFile: () => ipcRenderer.invoke('getSettingFile'),
    getSettingModel: () => ipcRenderer.invoke('get-setting-model'),
    createSettingWindow: () => ipcRenderer.invoke('create-setting-window'),
})