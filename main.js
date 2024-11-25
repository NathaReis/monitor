const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

function createWindow() {
  const win = new BrowserWindow({
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true
    }
  });
  win.maximize();
//   win.webContents.openDevTools();

  win.loadFile(path.join(__dirname, 'src/home/index.html'));
}

app.on('ready', () => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    })
})
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
})



// Comunicações
ipcMain.handle('getFiles', (event, category='video') => {
    return getFiles(category);
});

// GetFiles
function getFiles(category='video') {
    const homeDirectory = os.homedir();
    let extensions = {
        video: ['.mp4','.mov','.avi','.wmv','.mkv','.flv','.webm'],
        image: ['.jpeg','.jpg','.png','.gif','.bmp','.tiff'],
        audio: ['.mp3','.wav','.aac','.flac','.ogg'],
        doc: ['.ppt','.pptx']
    }
    const files = findFiles(homeDirectory, extensions[category]);
    const folders = [...new Set(files.map(file => file.folder))].sort((a, b) => a.split("/").pop() < b.split("/").pop() ? -1 : 1);
    let result = {};
    folders.forEach(folder => {
        const filesFolder = files.filter(file => file.folder === folder);
        result[folder] = filesFolder;
    })
    return result;
}
getFiles()

function findFiles(directory, allowedExtensions) {
    let files = [];

    try {
        const items = fs.readdirSync(directory, { withFileTypes: true });

        items.forEach(item => {
            const fullPath = path.join(directory, item.name);

            const hiddenFolder = item.name.split("").shift() === '.';
            const depth = fullPath.split("/").length <= 9;
            if(item.isDirectory() && !hiddenFolder && depth) {
                files = files.concat(findFiles(fullPath, allowedExtensions));
            } 
            else {
                const extname = path.extname(fullPath).toLowerCase();
                if(allowedExtensions.includes(extname)) {
                    files.push({
                        name: path.basename(fullPath, extname),
                        path: fullPath,
                        extension: extname,
                        folder: path.dirname(fullPath)
                    });
                }
            }
        });
    } catch (err) {
        console.error('Erro ao ler o diretório:', err);
    }

    return files;
}