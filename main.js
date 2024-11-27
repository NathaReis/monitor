const { app, BrowserWindow, ipcMain, screen } = require('electron');

const path = require('path');

const getFiles = require(path.join(__dirname, 'services/files.js'));

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 800,
        minHeight: 600,
        frame: true,
        autoHideMenuBar: true,
        icon: path.join(__dirname, 'favicon.svg'),
        title: 'Monitor',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
        },
        center: true, // Centralizar a janela
        enableLargerThanScreen: false, // Redimensionar para um tamanho maior que o da tela
    });
    win.maximize();
    win.webContents.openDevTools();
    win.loadFile(path.join(__dirname, 'src/pages/home/index.html'));
    
    return [] // createSecundaryWindows(win);
}

function createSecundaryWindows(windowPrimary) {
    const displays = screen.getAllDisplays();
    const monitors = displays.filter((display) => {
        return display.bounds.x !== 0 || display.bounds.y !== 0;
    });

    if(monitors) {
        const monitorsAux = [];
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

app.on('ready', () => {
    const monitors = createWindow();

    // Comunicações >>>>>>>>>>>>>>>>>
    ipcMain.handle('getFiles', (event, category='video') => {
        return getFiles(category);
    });
    ipcMain.handle('getWindows', () => {
        return JSON.stringify(monitors.map(monitor => monitor.id));
    });

    /* EXEMPLO DE COMO ENVIAR UMA MENSAGEM PARA UMA JANELA ESPECÍFICA */
    
    // // Enviando uma mensagem para a janela principal
    // mainWindow.webContents.send('mensagem-do-main', 'Olá do processo principal!');
    // // index.html (renderer)
    // ipcRenderer.on('mensagem-do-main', (event, args) => {
    //     console.log(args); // Irá imprimir "Olá do processo principal!"
    // });
})
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
})
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
})