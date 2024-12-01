const $audio = document.querySelector("audio");

window.addEventListener("storage", (event) => {
    const { newValue, key } = event;
    if(key === 'renderAudio') {
        renderAudio(JSON.parse(newValue));
        localStorage.removeItem(key);
    }
    if(key === 'togglePlayAudio') {
        togglePlayAudio(newValue === 'true');
        localStorage.removeItem(key);
    }
    if(key === 'stopAudio') {
        stopAudio();
        localStorage.removeItem(key);
    }
    if(key === 'newTimeAudio') {
        $audio.currentTime = newValue;
        localStorage.removeItem(key);
    }
    if(key === 'volume') {
        $audio.volume = parseFloat(parseInt(newValue) / 10);
    }
})

function renderAudio(audio) {
    $audio.src = audio.path;
    $audio.volume = 0.5;
    setTimeout(() => {
        localStorage.setItem("duration", $audio.duration.toFixed(2).toString());
    }, 1000);
}

function togglePlayAudio(active) {
    active ? $audio.play() : $audio.pause();
}

function stopAudio() {
    $audio.currentTime = 0;
    togglePlayAudio(false);
}

// Controle do áudio
$audio.onplay = () => {
    localStorage.setItem("play", 'true');
}

$audio.onpause = () => {
    localStorage.setItem("play", 'false');
}

$audio.ontimeupdate = () => {
    localStorage.setItem("time", $audio.currentTime.toFixed(2).toString());
    if($audio.currentTime === $audio.duration) {
        const modeLocal = JSON.parse(localStorage.getItem("mode"));
        if(modeLocal && modeLocal.mode !== 'disabled') {
            if(modeLocal.mode === 'repeat') {
                localStorage.setItem("nextFile", 'true');
                return
            }
            if(modeLocal.mode === 'repeat-one') {
                $audio.currentTime = 0;
                $audio.play();
                return
            }
        }
        stopAudio();
    }
}

function setVolumeLocal() {
    const volume = localStorage.getItem("volume");
    if(volume) {
        $audio.volume = parseFloat(parseInt(volume) / 10);
    }
}
setVolumeLocal();