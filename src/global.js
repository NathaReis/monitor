import { ThemeService } from './services/theme.service.js';

const $body = document.querySelector("body");
const $html = document.querySelector("html");
const $header = document.querySelector("header");

function createControl() {
    const footer = document.createElement("footer");
    footer.onclick = () => {
        footer.classList.toggle("active");
    }
    $body.appendChild(footer);
}
createControl();


// THEME
const theme = new ThemeService($header, $html);
theme.getTheme();