const $audio = document.querySelector("audio");
$audio.currentTime = +localStorage.getItem("time");

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
    localStorage.setItem("play", active ? 'true': 'false');
    active ? $audio.play() : $audio.pause();
}

function stopAudio() {
    $audio.currentTime = 0;
    togglePlayAudio(false);
}

// Função para salvar o tempo no localStorage
const saveTime = () => {
    localStorage.setItem("time", $audio.currentTime.toString());
};

// Função para carregar o tempo do localStorage
const loadTime = () => {
    const savedTime = localStorage.getItem("time");
    if (savedTime) {
        $audio.currentTime = parseFloat(savedTime);
    }
};

// Salvar o tempo sempre que houver uma atualização
$audio.ontimeupdate = () => {
    if($audio.currentTime === 0) {
        loadTime();
    }
    else {
        saveTime();
    }
};