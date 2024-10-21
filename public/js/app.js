import { initializeTimer } from './timer.js';
import { initializeProjects } from './projects.js';
import { initializeUI } from './ui.js';
import { initializeTasks } from './tasks.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing app');
    initializeTimer();
    initializeProjects();
    initializeUI();
    initializeTasks();
});

// Service Worker pour PWA
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('Service Worker enregistré', reg))
        .catch(err => console.log('Erreur d\'enregistrement du Service Worker', err));
}
