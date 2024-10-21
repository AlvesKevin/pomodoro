export function updateTimerDisplay(time) {
    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');
    const timeString = `${minutes}:${seconds}`;
    
    const timerElement = document.getElementById('timer');
    if (!timerElement) {
        console.error("L'élément timer n'a pas été trouvé");
        return;
    }

    timerElement.textContent = timeString;
}

// Exemple d'utilisation :
// let time = 1500; // 25 minutes
// const interval = setInterval(() => {
//     updateTimerDisplay(time);
//     time--;
//     if (time < 0) clearInterval(interval);
// }, 1000);
