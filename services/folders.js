const path = require('path');
const fs = require('fs');
const os = require('os');

async function getFolders() {
    try {
        const baseFolders = await getSecundaryFolders();
        return await findFolders(baseFolders);
    }
    catch (error) {
        throw error;
    }
}

async function getSecundaryFolders() {
    try {
        const primaryFolders = await getPrimaryFolders();
        const promises = primaryFolders.map(folder => {
            return readFolder(folder.fullPath);
        });
        const folders = await Promise.all(promises);
        return primaryFolders.concat(flat(folders));
    }
    catch (error) {
        throw error;
    }
}

async function findFolders(baseFolders) {
    try {
        let currentBase = baseFolders;

        do {
            const promises = currentBase.map(folder => {
                return readFolder(folder.fullPath);
            });
            const folders = await Promise.all(promises);
            baseFolders = baseFolders.concat(flat(folders));
            currentBase = flat(folders);
        } while(currentBase.length)
        
        return baseFolders.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
    }
    catch (error) {
        throw error;
    }
}

async function getPrimaryFolders() {
    try {
        const home = os.homedir();
        return await readFolder(home);
    }
    catch (error) {
        throw error;
    }
}

function readFolder(folder) {
    return new Promise((resolve, reject) => {
        fs.readdir(folder, { withFileTypes: true }, (error, items) => {
            if(error) reject(error);
            
            const folders = [];
            items.forEach(item => {
                const firstLetter = item.name.split("").shift();
                if(item.isDirectory() && firstLetter !== '.' && firstLetter !== '@') {
                    folders.push({...item, fullPath: `${item.path}${path.sep}${item.name}`});
                }
            })
            resolve(folders);
        });
    })
}

function flat(arr) {
    return arr.reduce((acc, val) => 
        acc.concat(Array.isArray(val) ? flat(val) : val), []);
}

module.exports = getFolders;