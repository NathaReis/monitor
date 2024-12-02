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
    if(key === 'volumeAudio') {
        $audio.volume = parseFloat(parseInt(newValue) / 10);
    }
})

function renderAudio(audio) {
    $audio.src = audio.path;
    $audio.volume = 0.5;
    setTimeout(() => {
        localStorage.setItem("durationAudio", $audio.duration.toFixed(2).toString());
        setVolumeLocalAudio();
    }, 1000);
}

function togglePlayAudio(active) {
    active ? $audio.play() : $audio.pause();
}

function stopAudio() {
    $audio.currentTime = 0;
    localStorage.setItem("timeAudio", '0');
    togglePlayAudio(false);
}

// Controle do áudio
$audio.onplay = () => {
    localStorage.setItem("playAudio", 'true');
}

$audio.onpause = () => {
    localStorage.setItem("playAudio", 'false');
}

$audio.ontimeupdate = () => {
    localStorage.setItem("timeAudio", $audio.currentTime.toFixed(2).toString());
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

function setVolumeLocalAudio() {
    const volume = localStorage.getItem("volumeAudio");
    if(volume) {
        $audio.volume = parseFloat(parseInt(volume) / 10);
    }
}
setVolumeLocalAudio();