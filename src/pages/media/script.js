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
        stopAudio();
    }
}