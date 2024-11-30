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
})

function renderAudio(audio) {
    $audio.src = audio.path;
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