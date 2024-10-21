let timer;
let isWorking = true;
let totalTime = 1500; // 25 minutes
let timeLeft = totalTime;
let cycles = 0;
let isRunning = false;

const timerDisplay = document.getElementById('timer');
const timerLabel = document.getElementById('timer-label');
const startPauseButton = document.getElementById('start-pause');
const resetButton = document.getElementById('reset');

const MAX_LABEL_LENGTH = 15; // Réduire la longueur maximale du label à 15 caractères

export function initializeTimer() {
    updateTimerDisplay();
    setupTimerControls();
}

function updateTimer() {
    if (isRunning && timeLeft > 0) {
        timeLeft--;
        updateTimerDisplay();
        updateTimerProgress();
    } else if (timeLeft === 0) {
        completePomodoro();
    }
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const seconds = (timeLeft % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;
}

function setupTimerControls() {
    startPauseButton.addEventListener('click', toggleTimer);
    resetButton.addEventListener('click', resetTimer);
}

export function toggleTimer() {
    if (isRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
}

function startTimer() {
    isRunning = true;
    startPauseButton.textContent = 'PAUSE';
    timer = setInterval(updateTimer, 1000);
}

function pauseTimer() {
    isRunning = false;
    startPauseButton.textContent = 'START';
    clearInterval(timer);
}

function resetTimer() {
    pauseTimer();
    timeLeft = totalTime;
    updateTimerDisplay();
    updateTimerProgress();
}

function completePomodoro() {
    cycles++;
    if (isWorking) {
        if (cycles % 4 === 0) {
            totalTime = 900; // 15 minutes long break
            timerLabel.textContent = 'LONG BREAK';
        } else {
            totalTime = 300; // 5 minutes short break
            timerLabel.textContent = 'SHORT BREAK';
        }
        isWorking = false;
    } else {
        totalTime = 1500; // 25 minutes work
        timerLabel.textContent = 'FOCUS';
        isWorking = true;
    }
    timeLeft = totalTime;
    updateTimerDisplay();
    updateTimerProgress();
    startTimer();
}

function updateTimerProgress() {
    const progress = ((totalTime - timeLeft) / totalTime) * 100;
    document.documentElement.style.setProperty('--progress', `${progress}%`);
}

function updateTimerLabel(taskName) {
    if (timerLabel) {
        if (taskName.length > MAX_LABEL_LENGTH) {
            timerLabel.textContent = taskName.substring(0, MAX_LABEL_LENGTH - 3) + '...';
            timerLabel.title = taskName; // Ajoute le nom complet comme titre pour l'infobulle
        } else {
            timerLabel.textContent = taskName;
            timerLabel.title = ''; // Supprime le titre s'il n'est pas nécessaire
        }
    }
}

export function setTimerDuration(seconds, taskName) {
    totalTime = seconds;
    timeLeft = totalTime;
    updateTimerDisplay();
    updateTimerProgress();
    updateTimerLabel(taskName);
}

// Autres fonctions liées au timer...
