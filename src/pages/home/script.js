function readFolders(category) {
    location = '../folder/index.html?category='+category;
}

const $title = document.querySelector("#title");
const $image = document.querySelector("#image");
const $video = document.querySelector("#video");
function setControl(control) {
    if(control) {
        const { file, files, index, active } = control;

        // Configurando título
        $title.innerHTML = file.name;
        
        switch(file.category) {
            case 'image':          
                $image.src = file.path;
                $image.onclick = (e) => {
                    e.stopPropagation();
                    $image.classList.toggle("full");
                }

                if(active) {
                    document.querySelector("footer").classList.add("active");
                }
                // Habilitar visualização da imagem - Desabilitar visualização de vídeo e áudio
                $image.classList.remove("remove");
                $video.classList.add("remove");
                break 
            case 'video':
                $video.src = file.path;
                $video.onclick = (e) => {
                    e.stopPropagation();
                    $video.classList.toggle("full");
                }

                if(active) {
                    document.querySelector("footer").classList.add("active");
                }
                // Habilitar visualização da vídeo - Desabilitar visualização de imagem e áudio
                $video.classList.remove("remove");
                $image.classList.add("remove");
                break 
        }
    
        localStorage.setItem("control", JSON.stringify({file, files, index}));
    }
}
setControl(JSON.parse(localStorage.getItem("control")));

function backFile(e) {
    e.stopPropagation();
    const controlLocal = JSON.parse(localStorage.getItem("control"));
    if(controlLocal) {
        const { files, index } = controlLocal;
        const newIndex = index - 1 < 0 ? files.length - 1 : index - 1;
        setControl({file: files[newIndex], files, index: newIndex});
    }
}
document.querySelector("#backFile").onclick = (e) => backFile(e);
function nextFile(e) {
    e.stopPropagation();
    const controlLocal = JSON.parse(localStorage.getItem("control"));
    if(controlLocal) {
        const { files, index } = controlLocal;
        const newIndex = index + 1 === files.length ? 0 : index + 1;
        setControl({file: files[newIndex], files, index: newIndex});
    }
}
document.querySelector("#nextFile").onclick = (e) => nextFile(e);