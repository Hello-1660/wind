const { contextBridge, ipcRenderer } = require('electron')


contextBridge.exposeInMainWorld('electronAPI', {
    getSettingFile: () => ipcRenderer.invoke('getSettingFile'),

})