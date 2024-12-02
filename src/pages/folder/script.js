const $listFolder = document.querySelector("#list-folder");
const category = new URLSearchParams(location.search).get('category');

async function loadFile(sync) {
    try {        
        const files = await getFiles(sync);
        if(files) {
            const $categoryHeader = document.querySelector("#category-header");
            $categoryHeader.innerHTML = category + '/';
            $categoryHeader.href = `./index.html?category=${category}`;
            renderFolders(files);
        }
    }
    catch (error) {
        console.error(error);
    }
}

async function getFiles(sync) {
    try {
        $listFolder.innerHTML = '';
        sync ? localStorage.removeItem(category) : null; // remove cache para atualizar
        const localFiles = JSON.parse(localStorage.getItem(category)); // busca o cache
        const files = localFiles ? localFiles : await api.getFiles(category); // se o cache existir usa ele se não busca do sistema
        !localFiles ? localStorage.setItem(category, JSON.stringify(files)) : null; // se o cache não existe cria ele
        return files;
    }
    catch (error) {
        throw error;
    }
}

function renderFolders(files) {
    for(let folder in files) {
        const box = document.createElement("div");
        box.classList.add("box");
        box.onclick = () => location = `./index.html?category=${category}&folder=${folder}`;

        const svg = 
            `<div class="box-svg">
                <svg xmlns="http://www.w3.org/2000/svg" class="bi bi-folder2" viewBox="0 0 16 16">
                    <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 12.5zM2.5 3a.5.5 0 0 0-.5.5V6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3zM14 7H2v5.5a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5z"/>
                </svg>
            </div>`;
        box.innerHTML += svg;

        const h1 = document.createElement("h1");
        h1.classList.add("titleFolder");
        h1.innerHTML = folder;
        box.appendChild(h1);

        const qtd = document.createElement("h1");
        qtd.innerHTML = `(${files[folder].length})`;
        box.appendChild(qtd);

        $listFolder.appendChild(box);
    }
    setFolder(files);
}

function setFolder(files) {
    const folder = new URLSearchParams(location.search).get('folder');
    if(folder) {
        const $boxes = document.querySelectorAll(".box");
        for(let box of $boxes) {
            if(box.querySelector("h1").innerHTML === folder) {
                const $folderHeader = document.querySelector("#folder-header");
                $folderHeader.innerHTML = folder + '/';
                $folderHeader.href = `./index.html?category=${category}&folder=${folder}`;
                setFiles(files[folder]);
                break;
            }
        }
    }
}

function setFiles(files) {
    $listFolder.innerHTML = '';
    files.forEach(file => {
        const box = document.createElement("div");
        box.classList.add("box");
        box.onclick = () => {
            play(false);
            setControl({file, files, index: files.indexOf(file), active: true});
        }

        let svg;
        switch(category) {
            case 'video': 
                svg = 
                    `<div class="box-svg">
                        <svg xmlns="http://www.w3.org/2000/svg" class="bi bi-file-earmark-play" viewBox="0 0 16 16">
                            <path d="M6 6.883v4.234a.5.5 0 0 0 .757.429l3.528-2.117a.5.5 0 0 0 0-.858L6.757 6.454a.5.5 0 0 0-.757.43z"/>
                            <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
                        </svg>
                    </div>`;
                break;
            case 'image':
                svg = 
                    `<div class="box-svg">
                        <svg xmlns="http://www.w3.org/2000/svg" class="bi bi-file-earmark-image" viewBox="0 0 16 16">
                            <path d="M6.502 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"/>
                            <path d="M14 14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zM4 1a1 1 0 0 0-1 1v10l2.224-2.224a.5.5 0 0 1 .61-.075L8 11l2.157-3.02a.5.5 0 0 1 .76-.063L13 10V4.5h-2A1.5 1.5 0 0 1 9.5 3V1z"/>
                        </svg>
                    </div>`;
                break;
            case 'audio':
                svg = 
                    `<div class="box-svg">
                        <svg xmlns="http://www.w3.org/2000/svg" class="bi bi-file-earmark-music" viewBox="0 0 16 16">
                            <path d="M11 6.64a1 1 0 0 0-1.243-.97l-1 .25A1 1 0 0 0 8 6.89v4.306A2.6 2.6 0 0 0 7 11c-.5 0-.974.134-1.338.377-.36.24-.662.628-.662 1.123s.301.883.662 1.123c.364.243.839.377 1.338.377s.974-.134 1.338-.377c.36-.24.662-.628.662-1.123V8.89l2-.5z"/>
                            <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
                        </svg>
                    </div>`;
                break;
            case 'doc':
                if(file.extension === '.pdf') {
                    svg = 
                        `<div class="box-svg">
                            <svg xmlns="http://www.w3.org/2000/svg" class="bi bi-file-earmark-pdf" viewBox="0 0 16 16">
                                <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
                                <path d="M4.603 14.087a.8.8 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.7 7.7 0 0 1 1.482-.645 20 20 0 0 0 1.062-2.227 7.3 7.3 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .477.365c.088.164.12.356.127.538.007.188-.012.396-.047.614-.084.51-.27 1.134-.52 1.794a11 11 0 0 0 .98 1.686 5.8 5.8 0 0 1 1.334.05c.364.066.734.195.96.465.12.144.193.32.2.518.007.192-.047.382-.138.563a1.04 1.04 0 0 1-.354.416.86.86 0 0 1-.51.138c-.331-.014-.654-.196-.933-.417a5.7 5.7 0 0 1-.911-.95 11.7 11.7 0 0 0-1.997.406 11.3 11.3 0 0 1-1.02 1.51c-.292.35-.609.656-.927.787a.8.8 0 0 1-.58.029m1.379-1.901q-.25.115-.459.238c-.328.194-.541.383-.647.547-.094.145-.096.25-.04.361q.016.032.026.044l.035-.012c.137-.056.355-.235.635-.572a8 8 0 0 0 .45-.606m1.64-1.33a13 13 0 0 1 1.01-.193 12 12 0 0 1-.51-.858 21 21 0 0 1-.5 1.05zm2.446.45q.226.245.435.41c.24.19.407.253.498.256a.1.1 0 0 0 .07-.015.3.3 0 0 0 .094-.125.44.44 0 0 0 .059-.2.1.1 0 0 0-.026-.063c-.052-.062-.2-.152-.518-.209a4 4 0 0 0-.612-.053zM8.078 7.8a7 7 0 0 0 .2-.828q.046-.282.038-.465a.6.6 0 0 0-.032-.198.5.5 0 0 0-.145.04c-.087.035-.158.106-.196.283-.04.192-.03.469.046.822q.036.167.09.346z"/>
                            </svg>
                        </div>`;
                    break;
                }
                svg = 
                    `<div class="box-svg">
                        <svg xmlns="http://www.w3.org/2000/svg" class="bi bi-file-earmark-slides" viewBox="0 0 16 16">
                            <path d="M5 6a.5.5 0 0 0-.496.438l-.5 4A.5.5 0 0 0 4.5 11h3v2.016c-.863.055-1.5.251-1.5.484 0 .276.895.5 2 .5s2-.224 2-.5c0-.233-.637-.429-1.5-.484V11h3a.5.5 0 0 0 .496-.562l-.5-4A.5.5 0 0 0 11 6zm2 3.78V7.22c0-.096.106-.156.19-.106l2.13 1.279a.125.125 0 0 1 0 .214l-2.13 1.28A.125.125 0 0 1 7 9.778z"/>
                            <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
                        </svg>
                    </div>`;
                break;
            default:
                svg = 
                    `<div class="box-svg">
                        <svg xmlns="http://www.w3.org/2000/svg" class="bi bi-file-earmark-fill" viewBox="0 0 16 16">
                            <path d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2m5.5 1.5v2a1 1 0 0 0 1 1h2z"/>
                        </svg>
                    </div>`;
        }
        box.innerHTML += svg;

        const h1 = document.createElement("h1");
        const lengthName = 20;
        const name = file.name.length >= lengthName ? file.name.slice(0,lengthName)+'... ' : file.name;
        h1.innerHTML = name;
        box.appendChild(h1);

        const qtd = document.createElement("h1");
        qtd.classList.add("qtd");
        qtd.innerHTML = `${file.size} mb`;
        box.appendChild(qtd);

        $listFolder.appendChild(box);
    })
}