// CONTROL
const $title = document.querySelector("#title");
const $image = document.querySelector("#image");
const $video = document.querySelector("#video");
const $play = document.querySelector("#play");
const $pause = document.querySelector("#pause");
const $stop = document.querySelector("#stop");
const $controls = document.querySelector("#controls");

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

                $stop.classList.add("remove");
                $play.classList.add("remove");
                $pause.classList.add("remove");
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

                $stop.classList.remove("remove");
                $play.classList.remove("remove");
                $pause.classList.add("remove");
                break 
            case 'audio':
                localStorage.setItem("renderAudio", JSON.stringify(file));

                const playLocal = localStorage.getItem("play");
                if(playLocal === 'true') {
                    localStorage.setItem("togglePlayAudio", 'true');
                    $pause.classList.remove("remove");  
                    $play.classList.add("remove");
                }
                else {
                    localStorage.setItem("togglePlayAudio", 'false');
                    $play.classList.remove("remove");
                    $pause.classList.add("remove");
                }
                $stop.classList.remove("remove");

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

function stop(e) {
    e.stopPropagation();
    localStorage.setItem("stopAudio", 'true');
    $play.classList.remove("remove");
    $pause.classList.add("remove");
}
$stop.onclick = (e) => stop(e)

function play(e, active) {
    e.stopPropagation();
    localStorage.setItem("togglePlayAudio", active ? 'true' : 'false');
    $play.classList.toggle("remove");
    $pause.classList.toggle("remove");
}
$play.onclick = (e) => play(e, true);
$pause.onclick = (e) => play(e, false);

// Desativar toggle do footer ao clicar no contol
$controls.onclick = (e) => {
    e.stopPropagation();
}