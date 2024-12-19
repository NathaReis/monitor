// CONTROL
const $title = document.querySelector("#title");
const $image = document.querySelector("#image");
const $video = document.querySelector("#video");
const $audioBox = document.querySelector("#audio");
const $audio = document.querySelector("audio");
const $play = document.querySelector("#play");
const $pause = document.querySelector("#pause");
const $stop = document.querySelector("#stop");
const $controls = document.querySelector("#controls");
const $modeAudio = document.querySelector("#mode-audio");
const $progressAudio = document.querySelector("#progress-audio");
const $progressAudioVolume = document.querySelector("#progress-audio-volume");

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
                $audioBox.classList.add("remove");

                $stop.classList.add("remove");
                $play.classList.add("remove");
                $pause.classList.add("remove");
                document.querySelector("#controls").classList.remove("remove");
                // Limpando storage de vídeo
                localStorage.removeItem("videoPlay");
                localStorage.removeItem("videoTime");
                break 
            case 'video':
                const player = new Plyr('#video');
                const videoSource = document.querySelector("#video-source");

                videoSource.src = file.path;
                player.source = {
                  type: 'video',
                    sources: [{
                        src: file.path,
                        type: 'video/mp4'
                    }]
                }

                if(active) {
                    document.querySelector("footer").classList.add("active");
                }
                // Habilitar visualização da vídeo - Desabilitar visualização de imagem e áudio
                $video.classList.remove("remove");
                $image.classList.add("remove");
                $audioBox.classList.add("remove");

                document.querySelector("#controls").classList.add("remove");
                break 
            case 'audio':  
                defineDuration();
                $stop.classList.remove("remove");
                $audio.src = file.path;
                // Habilitar visualização da vídeo - Desabilitar visualização de imagem e áudio
                $audioBox.classList.remove("remove");
                $video.classList.add("remove");
                $image.classList.add("remove");
                document.querySelector("#controls").classList.remove("remove");
                // Limpando storage de vídeo
                localStorage.removeItem("videoPlay");
                localStorage.removeItem("videoTime");
                break
        }
    
        localStorage.setItem("control", JSON.stringify({file, files, index}));
    }
}
setControl(JSON.parse(localStorage.getItem("control")));

function backFile() {
    const controlLocal = JSON.parse(localStorage.getItem("control"));
    if(controlLocal) {
        play(false);
        const { files, index } = controlLocal;
        const newIndex = index - 1 < 0 ? files.length - 1 : index - 1;
        setControl({file: files[newIndex], files, index: newIndex});
    }
}
document.querySelector("#backFile").onclick = () => backFile();

function nextFile() {
    const controlLocal = JSON.parse(localStorage.getItem("control"));
    if(controlLocal) {
        play(false);
        const { files, index } = controlLocal;
        const newIndex = index + 1 === files.length ? 0 : index + 1;
        setControl({file: files[newIndex], files, index: newIndex});
    }
}
document.querySelector("#nextFile").onclick = () => nextFile();

function stop() {
    const control = JSON.parse(localStorage.getItem("control"));
    if(control) {
        if(control.file.category === 'audio') {
            localStorage.setItem("stopAudio", 'true');
        }
        else {
            $video.currentTime = 0;
        }
    }
    play(false);
}
$stop.onclick = () => stop()

function play(active) {
    const control = JSON.parse(localStorage.getItem("control"));
    if(control) {
        if(active) {
            $play.classList.add("remove");
            $pause.classList.remove("remove");

            control.file.category === 'audio' ? $audio.play() : $video.play();
        }
        else {
            $play.classList.remove("remove");
            $pause.classList.add("remove");

            control.file.category === 'audio' ? $audio.pause() : $video.pause(); 
        }
    }
}
$play.onclick = () => play(true);
$pause.onclick = () => play(false);

// RENDER AUDIO
function defineDuration() {
    const $duration = document.querySelector("#duration");
    const durationLocal = $audio.duration.toFixed(2);
    $duration.innerHTML = `${formateTime(durationLocal/60)}:${formateTime(durationLocal%60)}`;
    $progressAudio.max = durationLocal;
}

$progressAudio.onmousedown = () => {
    play(false);
}
$progressAudio.onmouseup = () => {
    setTimeout(() => {
        play(true);
    },200);// Esperar para renderizar o novo valor de tempo antes de continuar
}
$progressAudio.oninput = () => {
    $audio.currentTime = $progressAudio.value;
}

$audio.ontimeupdate = () => {
    const $duration = document.querySelector("#duration");
    const $currentTime = document.querySelector("#current-time");
    $currentTime.innerHTML = `${formateTime($audio.currentTime/60)}:${formateTime($audio.currentTime%60)}`;
    $progressAudio.value = $audio.currentTime;

    if($currentTime.innerHTML === $duration.innerHTML) {
        $play.classList.remove("remove");
        $pause.classList.add("remove");
    }
    if($audio.currentTime === $audio.duration) {
        const modeLocal = JSON.parse(localStorage.getItem("modeAudio"));
        if(modeLocal && modeLocal.mode !== 'disabled') {
            if(modeLocal.mode === 'repeat') {
                localStorage.setItem("nextFileAudio", 'true');
            }
            else if(modeLocal.mode === 'repeat-one') {
                $audio.currentTime = 0;
                $audio.play();
            }
            else {
                stopAudio();
            }
        }
        else {
            stopAudio();
        }
    }
}

// Controle do volume
$progressAudioVolume.oninput = () => {
    setVolume();
}
function setVolume() {
    const volume = $progressAudioVolume.value;
    iconVolume(volume);
    $audio.volume = parseFloat(parseInt(volume) / 10);
    $progressAudioVolume.value = volume    
    localStorage.setItem("volumeAudio", volume.toString());
}
function setVolumeLocal() {
    const volume = localStorage.getItem("volumeAudio");
    if(volume) {
        $progressAudioVolume.value = parseInt(volume);
        setVolume();
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

function formateTime(time) {
    time = parseInt(time);
    return time < 10 ? `0${(time)}` : time;
}

// Mode
const modeData = [
    {
        icon: $modeAudio.querySelector("#mode-disabled"),
        action: () => {
            localStorage.setItem("modeAudio", JSON.stringify({index: 0, mode: 'disabled'}));
        }
    },
    {
        icon: $modeAudio.querySelector("#mode-repeat"),
        action: () => {
            localStorage.setItem("modeAudio", JSON.stringify({index: 1, mode: 'repeat'}))
        }
    },    
    {
        icon: $modeAudio.querySelector("#mode-repeat-one"),
        action: () => {
            localStorage.setItem("modeAudio", JSON.stringify({index: 2, mode: 'repeat-one'}));
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
setMode(JSON.parse(localStorage.getItem("modeAudio"))?.index);

function nextMode() {
    let nextModeIndex = JSON.parse(localStorage.getItem("modeAudio")).index;
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
$audioBox.onclick = (e) => {
    e.stopPropagation();
}
$video.onclick = (e) => {
    e.stopPropagation();
}

function propagation(e) {
    e.stopPropagation();
}