// CONTROL
const $title = document.querySelector("#title");
const $image = document.querySelector("#image");
const $video = document.querySelector("#video");
const $audio = document.querySelector("#audio");

// const $play = document.querySelector("#play");
// const $pause = document.querySelector("#pause");
// const $stop = document.querySelector("#stop");
// const $controls = document.querySelector("#controls");

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
                toggleBox([$image],[$audio, $video]);
                break 
            case 'video':
                $video.src = file.path;
                toggleBox([$video],[$audio, $image]);
                break 
            case 'audio':  
                $audio.src = file.path;
                toggleBox([$audio],[$video, $image]);
                break
        }

        if(active) {
            document.querySelector("footer").classList.add("active");
        }
    
        localStorage.setItem("control", JSON.stringify({file, files, index}));
    }
}
setControl(JSON.parse(localStorage.getItem("control")));

function toggleBox(active, disble) {
    active.map(ac => ac.classList.remove("remove"));
    disble.map(ds => ds.classList.add("remove"));
}

function backFile() {
    const controlLocal = JSON.parse(localStorage.getItem("control"));
    if(controlLocal) {
        play(false);
        const { files, index } = controlLocal;
        const newIndex = index - 1 < 0 ? files.length - 1 : index - 1;
        setControl({file: files[newIndex], files, index: newIndex});
    }
}
// document.querySelector("#backFile").onclick = () => backFile();

function nextFile() {
    const controlLocal = JSON.parse(localStorage.getItem("control"));
    if(controlLocal) {
        play(false);
        const { files, index } = controlLocal;
        const newIndex = index + 1 === files.length ? 0 : index + 1;
        setControl({file: files[newIndex], files, index: newIndex});
    }
}
// document.querySelector("#nextFile").onclick = () => nextFile();

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
// $stop.onclick = () => stop()

function play(active) {
    const control = JSON.parse(localStorage.getItem("control"));
    if(control) {
        if(active) {
            // $play.classList.add("remove");
            // $pause.classList.remove("remove");

            control.file.category === 'audio' ? $audio.play() : $video.play();
        }
        else {
            // $play.classList.remove("remove");
            // $pause.classList.add("remove");

            control.file.category === 'audio' ? $audio.pause() : $video.pause(); 
        }
    }
}
// $play.onclick = () => play(true);
// $pause.onclick = () => play(false);

function toggleFooter() {
    document.querySelector('footer').classList.toggle('active');
}