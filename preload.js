const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    getFiles: (category) => ipcRenderer.invoke('getFiles', category),
    getWindows: () => ipcRenderer.invoke('getWindows'),
})