const printV = (value) => {
    console.log(value);
}

// THEME
import { ThemeService } from './services/theme.service.js';
const $html = document.querySelector("html");
const $header = document.querySelector("header");
const theme = new ThemeService($header, $html);
theme.getTheme();