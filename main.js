const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const getFiles = require(path.join(__dirname, 'services/files.js'));

app.on('ready', () => {
    const monitors = createWindow();

    // Comunicações >>>>>>>>>>>>>>>>>
    ipcMain.handle('getFiles', async (event, category='video') => {
        try {
            return await getFiles(category);
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    });
    ipcMain.handle('getWindows', () => {
        return JSON.stringify(monitors.map(monitor => monitor.id));
    });
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
})

function createWindow() {
    const win = new BrowserWindow({
        // minWidth: 800,
        // minHeight: 600,
        frame: true,
        autoHideMenuBar: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
        },
        enableLargerThanScreen: false, // Redimensionar para um tamanho maior que o da tela
    });
    win.maximize();
    // win.webContents.openDevTools();
    win.loadFile(path.join(__dirname, 'src/pages/home/index.html'));
    
    return { monitors: [], displayMedia: createHiddenWindow(win) };
    return { monitors: createSecundaryWindows(win), displayMedia: createHiddenWindow(win) };
}

function createHiddenWindow(windowPrimary) {
    const win = new BrowserWindow()
    // win.hide();
    win.loadFile(path.join(__dirname, 'src/pages/media/index.html'));

    windowPrimary.on('closed', () => {
        win.close();
    });
    return win
}

function createSecundaryWindows(windowPrimary) {
    const displays = screen.getAllDisplays();
    const monitors = displays.filter((display) => {
        return display.bounds.x !== 0 || display.bounds.y !== 0;
    });

    if(monitors) {
        let monitorsAux = [];
        monitors.forEach((monitor) => {
            const win = new BrowserWindow({
                x: monitor.bounds.x,
                y: monitor.bounds.y,
                minWidth: monitor.workAreaSize.width,
                minHeight: monitor.workAreaSize.height,
                frame: false, // Barra superior
                webPreferences: {
                    preload: path.join(__dirname, 'preload.js'),
                    nodeIntegration: true,
                },
                transparent: true, // Fundo transparente
                alwaysOnTop: true, // Sempre em primeiro plano
                movable: false, // Pode mover a janela
                skipTaskbar: true, // Ocultar da barra de tarefas
            });
            win.maximize();
            win.loadFile(path.join(__dirname, 'src/pages/monitor/index.html'));

            win.on('closed', () => {
                monitorsAux = [];
                windowPrimary.close();
            });

            monitorsAux.push({
                window: win,
                id: monitor.id
            });
        });

        windowPrimary.on('closed', () => {
            monitorsAux.forEach((display) => {
                display.window.close();
            });
        });
        windowPrimary.on('focus', () => {
            monitorsAux.forEach((display) => {
                display.window.focus();
            });    
        });
        return monitorsAux;
    }
}