const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    send: async (channel, data) => {
        return ipcRenderer.invoke(channel, data);
    }
})