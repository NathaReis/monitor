const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    getFiles: (data) => ipcRenderer.invoke('getFiles', data),
    getWindows: () => ipcRenderer.invoke('getWindows')
})