const { app, BrowserWindow, ipcMain, screen } = require('electron');

const path = require('path');
const fs = require('fs');
const os = require('os');

const secundaryDisplay = [];
function createWindow() {
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize

    const win = new BrowserWindow({
        width: width,
        height: height,
        minWidth: 800,
        minHeight: 600,
        transparent: true,
        frame: true,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true
        },
        movable: false
    });
    win.maximize();
    win.webContents.openDevTools();
    win.loadFile(path.join(__dirname, 'src/pages/home/index.html'));
    
    createSecundaryWindows(win);
}

function createSecundaryWindows(windowPrimary) {
    const displays = screen.getAllDisplays();
    const externalDisplay = displays.filter((display) => {
        return display.bounds.x !== 0 || display.bounds.y !== 0;
    });

    if(externalDisplay) {
        externalDisplay.forEach((display) => {
            const win = new BrowserWindow({
                x: display.bounds.x,
                y: display.bounds.y,
                minWidth: display.workAreaSize.width,
                minHeight: display.workAreaSize.height,
                frame: false,
                transparent: true,
                alwaysOnTop: true, // Sempre ativo, sobrepondo as demais telas
                movable: false // Impede que a janela seja arrastada para outra tela
            });
            win.maximize();
            win.loadFile(path.join(__dirname, 'src/pages/monitor/index.html'));
            secundaryDisplay.push({
                window: win,
                id: display.id
            });
        });

        windowPrimary.on('closed', () => {
            secundaryDisplay.forEach((display) => {
                display.window.close();
            });
        });
        // windowPrimary.on('focus', () => {
        //     secundaryDisplay.forEach((display) => {
        //         display.window.focus();
        //     });    
        // });
    }
}

app.on('ready', () => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    })
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') app.quit();
    })

    // Comunicações >>>>>>>>>>>>>>>>>

    ipcMain.handle('getFiles', (event, category='video') => {
        return getFiles(category);
    });
    ipcMain.handle('getWindows', () => {
        return JSON.stringify(secundaryDisplay.map(item => item.id));
    });

    /* EXEMPLO DE COMO ENVIAR UMA MENSAGEM PARA UMA JANELA ESPECÍFICA */
    
    // // Enviando uma mensagem para a janela principal
    // mainWindow.webContents.send('mensagem-do-main', 'Olá do processo principal!');
    // // index.html (renderer)
    // ipcRenderer.on('mensagem-do-main', (event, args) => {
    //     console.log(args); // Irá imprimir "Olá do processo principal!"
    // });
})

// GetFiles
function getFiles(category='video') {
    const homeDirectory = os.homedir();
    let extensions = {
        video: ['.mp4','.mov','.avi','.wmv','.mkv','.flv','.webm'],
        image: ['.jpeg','.jpg','.png','.gif','.bmp','.tiff'],
        audio: ['.mp3','.wav','.aac','.flac','.ogg'],
        doc: ['.ppt','.pptx','.pdf']
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
            const hiddenFolder = fullPath.split("/").pop().split("").shift() == '.';
            const depth = fullPath.split("/").length <= 9;

            if(item.isDirectory() && !hiddenFolder && depth && fs.existsSync(fullPath)) {
                files = files.concat(findFiles(fullPath, allowedExtensions));
            } 
            else {
                const stats = fs.statSync(fullPath);
                const size = stats.size;
                const extname = path.extname(fullPath).toLowerCase();
                if(allowedExtensions.includes(extname)) {
                    files.push({
                        name: path.basename(fullPath, extname),
                        path: fullPath,
                        extension: extname,
                        folder: path.dirname(fullPath),
                        size: size
                    });
                }
            }
        });
    } catch (err) {
        console.error('Erro ao ler o diretório:', err);
    }

    return files;
}