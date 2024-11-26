const $listFolder = document.querySelector("#list-folder");

(async () => {
    $listFolder.innerHTML = '';
    const category = new URLSearchParams(location.search).get('category');
    const files = await window.api.send('getFiles', category);

    if(files) {
        const $categoryHeader = document.querySelector("#category-header");
        $categoryHeader.innerHTML = category + '/';
        $categoryHeader.href = `./index.html?category=${category}`;

        for(let folder in files) {
            const box = document.createElement("div");
            box.classList.add("box");
            box.onclick = () => {
                const $folderHeader = document.querySelector("#folder-header");
                $folderHeader.innerHTML = folder.split("/").pop() + '/';
                $folderHeader.href = `./index.html?category=${category}&folder=${folder}`;
        
                getFiles(files[folder]);
            }

            const svg = 
                `<div class="box-svg">
                    <svg xmlns="http://www.w3.org/2000/svg" class="bi bi-folder2" viewBox="0 0 16 16">
                        <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 12.5zM2.5 3a.5.5 0 0 0-.5.5V6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3zM14 7H2v5.5a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5z"/>
                    </svg>
                </div>`;
            box.innerHTML += svg;

            const h1 = document.createElement("h1");
            h1.innerHTML = folder.split("/").pop();
            box.appendChild(h1);

            $listFolder.appendChild(box);
        }

        const folder = new URLSearchParams(location.search).get('folder');
        if(folder) {
            const $boxes = document.querySelectorAll(".box");
            for(let box of $boxes) {
                if(box.querySelector("h1").innerHTML === folder.split("/").pop()) {
                    const $folderHeader = document.querySelector("#folder-header");
                    $folderHeader.innerHTML = folder.split("/").pop() + '/';
                    $folderHeader.href = `./index.html?category=${category}&folder=${folder}`;
                    getFiles(files[folder]);
                    break;
                }
            }
        }
    }
})()

function getFiles(files) {
    $listFolder.innerHTML = '';
    files.forEach(file => {
        const box = document.createElement("div");
        box.classList.add("box");
        box.onclick = () => {
            console.log(file);
        }

        const svg = 
            `<div class="box-svg">
                <svg xmlns="http://www.w3.org/2000/svg" class="bi bi-file-earmark-music" viewBox="0 0 16 16">
                    <path d="M11 6.64a1 1 0 0 0-1.243-.97l-1 .25A1 1 0 0 0 8 6.89v4.306A2.6 2.6 0 0 0 7 11c-.5 0-.974.134-1.338.377-.36.24-.662.628-.662 1.123s.301.883.662 1.123c.364.243.839.377 1.338.377s.974-.134 1.338-.377c.36-.24.662-.628.662-1.123V8.89l2-.5z"/>
                    <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
                </svg>
            </div>`;
        box.innerHTML += svg;

        const h1 = document.createElement("h1");
        h1.innerHTML = file.name;
        box.appendChild(h1);

        $listFolder.appendChild(box);
    })
}