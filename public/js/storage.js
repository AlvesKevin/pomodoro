const PROJECTS_KEY = 'pomodoro_projects';

export function saveProjects(projects) {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

export function loadProjects() {
    const savedProjects = localStorage.getItem(PROJECTS_KEY);
    return savedProjects ? JSON.parse(savedProjects) : [];
}

// Fonction pour sauvegarder les paramètres de l'application
export function saveSettings(settings) {
    localStorage.setItem('pomodoro_settings', JSON.stringify(settings));
}

// Fonction pour charger les paramètres de l'application
export function loadSettings() {
    const savedSettings = localStorage.getItem('pomodoro_settings');
    return savedSettings ? JSON.parse(savedSettings) : {
        workDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        longBreakInterval: 4
    };
}