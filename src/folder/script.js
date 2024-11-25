const $listFolder = document.querySelector("#list-folder");


(async () => {
    $listFolder.innerHTML = '';
    const category = new URLSearchParams(location.search).get('category');
    const files = await window.api.send('getFiles', category);
    if(files) {
        for(let folder in files) {
            const box = document.createElement("div");
            box.classList.add("box");
            box.onclick = () => {
                getFiles(files[folder]);
            }

            const h1 = document.createElement("h1");
            h1.innerHTML = folder.split("/").pop();
            box.appendChild(h1);

            $listFolder.appendChild(box);
        }
    }
})()

function getFiles(files) {
    console.log(files)
    // $listFolder.innerHTML = '';
    // files.forEach(file => {
    //     const h1 = document.createElement("h1");
    //     h1.innerHTML = file.name + file.extension;
    //     h1.onclick = () => {
    //         console.log(file);
    //     }
    //     $listFolder.appendChild(h1);
    // })
}