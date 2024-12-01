// CONTROL
const $title = document.querySelector("#title");
const $image = document.querySelector("#image");
const $video = document.querySelector("#video");
const $audio = document.querySelector("#audio");
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
                $audio.classList.add("remove");
                playAudio(false, true);

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
                $audio.classList.add("remove");
                playAudio(false, true);

                $stop.classList.remove("remove");
                $play.classList.remove("remove");
                $pause.classList.add("remove");
                break 
            case 'audio':  
                const playLocal = localStorage.getItem("play");
                const controlLocal = JSON.parse(localStorage.getItem("control"));

                if(playLocal === 'true' && file.path === controlLocal.file.path) {
                    $pause.classList.remove("remove");  
                    $play.classList.add("remove");
                }
                else {
                    localStorage.setItem("renderAudio", JSON.stringify(file));
                    $play.classList.remove("remove");
                    $pause.classList.add("remove");
                }
                $stop.classList.remove("remove");
                renderAudio(file);


                // Habilitar visualização da vídeo - Desabilitar visualização de imagem e áudio
                $audio.classList.remove("remove");
                $video.classList.add("remove");
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

function stopAudio() {
    localStorage.setItem("stopAudio", 'true');
    $play.classList.remove("remove");
    $pause.classList.add("remove");
}
$stop.onclick = () => stopAudio()

function playAudio(active, disable=false) {
    localStorage.setItem("togglePlayAudio", active ? 'true' : 'false');
    if(!disable) {
        $play.classList.toggle("remove");
        $pause.classList.toggle("remove");
    }// Validação quando a função é chamada pela categoria de imagem ou vídeo (validar sua necessidade quando renderizar o vídeo)
}
$play.onclick = () => playAudio(true);
$pause.onclick = () => playAudio(false);

// RENDER AUDIO
const $progressAudio = document.querySelector("#progress-audio");
const $progressAudioVolume = document.querySelector("#progress-audio-volume");

function renderAudio() {
    const $duration = document.querySelector("#duration");
    $duration.innerHTML = '00:00';
    setTimeout(() => {
        const durationLocal = Number(localStorage.getItem("duration")).toFixed(2);
        $duration.innerHTML = `${formateTime(durationLocal/60)}:${formateTime(durationLocal%60)}`;
        $progressAudio.max = durationLocal;
    }, 1100); // Esperar um segundo, porque a media espera um segundo para configurar a duração
}

$progressAudio.onmousedown = () => {
    playAudio(false);
}
$progressAudio.onmouseup = () => {
    setTimeout(() => {
        playAudio(true);
    },200);// Esperar para renderizar o novo valor de tempo antes de continuar
}
$progressAudio.oninput = () => {
    localStorage.setItem("newTimeAudio", $progressAudio.value.toString());
}

window.addEventListener("storage", (event) => {
    const { newValue, key } = event;
    if(key === 'time') {
        const $duration = document.querySelector("#duration");
        const $currentTime = document.querySelector("#current-time");
        $currentTime.innerHTML = `${formateTime(newValue/60)}:${formateTime(newValue%60)}`;
        $progressAudio.value = newValue;

        if($currentTime.innerHTML === $duration.innerHTML) {
            setControl(JSON.parse(localStorage.getItem("control")));
        }
    }
})

function formateTime(time) {
    time = parseInt(time);
    return time < 10 ? `0${(time)}` : time;
}

// Desativar toggle do footer ao clicar no contol
$controls.onclick = (e) => {
    e.stopPropagation();
}
$audio.onclick = (e) => {
    e.stopPropagation();
}