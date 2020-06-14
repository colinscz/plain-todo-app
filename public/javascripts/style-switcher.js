import { localStorageService } from './services/localstorage-service.js'

const darkButton = document.getElementById('dark');
const lightButton = document.getElementById('light');
const body = document.body;

// Apply the cached theme on reload
const theme = localStorageService.getItem('theme');

if (theme) {
    body.classList.add(theme);
}

// Button Event Handlers

darkButton.onclick = () => {
    body.classList.replace('light', 'dark');
    localStorageService.setItem('theme', 'dark');
};

lightButton.onclick = () => {
    body.classList.replace('dark', 'light');
    localStorageService.setItem('theme', 'light');
};
