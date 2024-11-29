const fs = require('fs');
const path = require("path");
const getFolders = require(path.join(__dirname, 'folders'));
const extensions = {
    video: ['.mp4','.mov','.avi','.wmv','.mkv','.flv','.webm'],
    image: ['.jpeg','.jpg','.png','.gif','.bmp','.tiff'],
    audio: ['.mp3','.wav','.aac','.flac','.ogg', '.m4a'],
    doc: ['.ppt','.pptx','.pdf']
}

async function getFiles(category) {
    try {
        const folders = await getFolders();
        
        const promises = folders.map(folder => {
            return readFiles(folder.fullPath, category);
        });
        const files = await Promise.all(promises);
        
        return getFilesByFolder(folders, files, category);
    }
    catch (error) {
        throw error;
    }
}

function readFiles(folder, category) {
    return new Promise((resolve, reject) => {
        fs.readdir(folder, { withFileTypes: true }, (error, items) => {
            if(error) reject(error);
            
            const files = items.map(item => {
                if(item.isFile()) {
                    const fullPath = path.join(folder, item.name);
                    const stats = fs.statSync(fullPath);
                    const extname = path.extname(fullPath).toLowerCase();
                    return {
                        name: path.basename(fullPath, extname),
                        path: fullPath,
                        extension: extname,
                        size: (stats.size / (1024 ** 2)).toFixed(2), // mb
                        category
                    };
                }
                return 'folder';
            })
            const isFiles = files.filter(file => file !== 'folder');
            resolve(isFiles);
        });
    })
}

function getFilesByFolder(folders, files, category) {
    const allowedExtensions = extensions[category];
    
    const filesByFolder = {};
    folders.map((folder, index) => {
        filesByFolder[folder.name] = files[index]
        .filter(file => allowedExtensions.includes(file.extension));
    })

    const clearList = {};
    for(let folder in filesByFolder) {
        if(filesByFolder[folder].length > 0) {
            clearList[folder] = filesByFolder[folder];
        }
    }
    
    return clearList;
}

module.exports = getFiles;