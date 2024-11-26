import { ThemeService } from './services/theme.service.js';
import { ControlService } from './services/control.service.js';

const $body = document.querySelector("body");
const $html = document.querySelector("html");
const $header = document.querySelector("header");

// CONTROL
const control = new ControlService($body);
control.createControl();


// THEME
const theme = new ThemeService($header, $html);
theme.getTheme();