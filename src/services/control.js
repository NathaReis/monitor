// CONTROL
const $title = document.querySelector("#title");
const $image = document.querySelector("#image");
const $video = document.querySelector("#video");
const $audio = document.querySelector("#audio");
const $play = document.querySelector("#play");
const $pause = document.querySelector("#pause");
const $stop = document.querySelector("#stop");
const $controls = document.querySelector("#controls");
const $modeAudio = document.querySelector("#mode-audio");

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
                }
                renderAudio();
                $stop.classList.remove("remove");

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

function backFile() {
    const controlLocal = JSON.parse(localStorage.getItem("control"));
    if(controlLocal) {
        playAudio(false);
        const { files, index } = controlLocal;
        const newIndex = index - 1 < 0 ? files.length - 1 : index - 1;
        setControl({file: files[newIndex], files, index: newIndex});
    }
}
document.querySelector("#backFile").onclick = () => backFile();

function nextFile() {
    const controlLocal = JSON.parse(localStorage.getItem("control"));
    if(controlLocal) {
        playAudio(false);
        const { files, index } = controlLocal;
        const newIndex = index + 1 === files.length ? 0 : index + 1;
        setControl({file: files[newIndex], files, index: newIndex});
    }
}
document.querySelector("#nextFile").onclick = () => nextFile();

function stopAudio() {
    localStorage.setItem("stopAudio", 'true');
    playAudio(false);
}
$stop.onclick = () => stopAudio()

function playAudio(active) {
    localStorage.setItem("togglePlayAudio", active ? 'true' : 'false');
    if(active) {
        $play.classList.add("remove");
        $pause.classList.remove("remove");
    }
    else {
        $play.classList.remove("remove");
        $pause.classList.add("remove");
    }
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

// Controle do volume
$progressAudioVolume.oninput = () => {
    const volume = $progressAudioVolume.value;
    setVolume(volume);
}
function setVolume(volume) {
    iconVolume(volume);
    localStorage.setItem("volume", volume.toString());
    $progressAudioVolume.value = volume
}
function setVolumeLocal() {
    const volume = localStorage.getItem("volume");
    if(volume) {
        iconVolume(parseInt(volume));
        $progressAudioVolume.value = parseInt(volume);
    }
}
setVolumeLocal();

function iconVolume(volume) {
    const $mute = document.querySelector("#volume-audio-mute");
    const $down = document.querySelector("#volume-audio-down");
    const $up = document.querySelector("#volume-audio-up");

    if(volume == 0) {
        $mute.classList.remove("remove");
        $down.classList.add("remove");
        $up.classList.add("remove");
    }
    else if(volume < 6) {
        $mute.classList.add("remove");
        $down.classList.remove("remove");
        $up.classList.add("remove"); 
    }
    else {
        $mute.classList.add("remove");
        $down.classList.add("remove");
        $up.classList.remove("remove");
    }
}

// Controle de eventos storage
window.addEventListener("storage", (event) => {
    const { newValue, key } = event;
    if(key === 'time') {
        const $duration = document.querySelector("#duration");
        const $currentTime = document.querySelector("#current-time");
        $currentTime.innerHTML = `${formateTime(newValue/60)}:${formateTime(newValue%60)}`;
        $progressAudio.value = newValue;

        if($currentTime.innerHTML === $duration.innerHTML) {
            $play.classList.remove("remove");
            $pause.classList.add("remove");
        }
    }
    if(key === 'nextFile') {
        nextFile();
        setTimeout(() => {
            playAudio(true);
        },200);
        localStorage.removeItem(key);
    }
})

function formateTime(time) {
    time = parseInt(time);
    return time < 10 ? `0${(time)}` : time;
}

// Mode
const modeData = [
    {
        icon: $modeAudio.querySelector("#mode-disabled"),
        action: () => {
            localStorage.setItem("mode", JSON.stringify({index: 0, mode: 'disabled'}));
        }
    },
    {
        icon: $modeAudio.querySelector("#mode-repeat"),
        action: () => {
            localStorage.setItem("mode", JSON.stringify({index: 1, mode: 'repeat'}))
        }
    },    
    {
        icon: $modeAudio.querySelector("#mode-repeat-one"),
        action: () => {
            localStorage.setItem("mode", JSON.stringify({index: 2, mode: 'repeat-one'}));
        }
    }
]
function setMode(modeIndex) {
    if(!modeIndex) {
        modeIndex = 0;
    }
    const allIcons = $modeAudio.querySelectorAll("svg");
    allIcons.forEach(icon => icon.classList.add("remove"));

    modeData[modeIndex].icon.classList.remove("remove");
    modeData[modeIndex].action();
}
setMode(JSON.parse(localStorage.getItem("mode"))?.index);

function nextMode() {
    let nextModeIndex = JSON.parse(localStorage.getItem("mode")).index;
    if(++nextModeIndex === modeData.length) {
        nextModeIndex = 0;
    }
    setMode(nextModeIndex);
}

$modeAudio.onclick = () => nextMode();

// Desativar toggle do footer ao clicar no contol
$controls.onclick = (e) => {
    e.stopPropagation();
}
$audio.onclick = (e) => {
    e.stopPropagation();
}