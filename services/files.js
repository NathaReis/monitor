const fs = require('fs');
const os = require('os');
const path = require('path');

// GetFiles
function getFiles(category='video') {
    let extensions = {
        video: ['.mp4','.mov','.avi','.wmv','.mkv','.flv','.webm'],
        image: ['.jpeg','.jpg','.png','.gif','.bmp','.tiff'],
        audio: ['.mp3','.wav','.aac','.flac','.ogg'],
        doc: ['.ppt','.pptx','.pdf']
    }
    const files = findFiles(os.homedir(), extensions[category]);
    const folders = [...new Set(files.map(file => file.folder))].sort((a, b) => a.split(path.sep).pop() < b.split(path.sep).pop() ? -1 : 1);
    let result = {};
    folders.forEach(folder => {
        const filesFolder = files.filter(file => file.folder === folder);
        result[folder] = filesFolder;
    })
    return result;
}

function findFiles(directory, allowedExtensions) {
    let files = [];

    try {
        const items = fs.readdirSync(directory, { withFileTypes: true });

        items.forEach(item => {
            const fullPath = path.join(directory, item.name);
            const hiddenFolder = fullPath.split(path.sep).pop().split("").shift() == '.';
            const depth = fullPath.split(path.sep).length <= 9;

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
                        folder: path.dirname(fullPath).split(path.sep).pop(),
                        size: (size / (1024 ** 2)).toFixed(2)
                    });
                }
            }
        });
    } catch (err) {
        console.error('Erro ao ler o diretório:', err);
    }

    return files;
}

module.exports = getFiles;