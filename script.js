let countdown;
const timerDisplay = document.querySelector('.display__time-left');
const startTimeBtn = document.querySelector('[data-action="start"]');
const restartTimeBtn = document.querySelector('[data-action="stop"]');
const endSound = document.querySelector('#end_sound');

function displayTimeLeft(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainderSeconds = seconds % 60;
  const display = `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
  timerDisplay.textContent = display;
}

function playAudio() {
  const sound = new Audio(endSound.src);
  sound.play();
}

function timer(seconds) {
  const now = Date.now();
  const then = now + (seconds * 1000);
  displayTimeLeft(seconds);

  countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000);

    if (secondsLeft < 0) {
      clearInterval(countdown);
      playAudio();
      return;
    }

    displayTimeLeft(secondsLeft);
  }, 1000);
}

startTimeBtn.addEventListener('click', () => {
  if (countdown) return;
  timer(1500);
});

restartTimeBtn.addEventListener('click', () => {
  clearInterval(countdown);
  countdown = undefined;
  timerDisplay.textContent = '25:00';
});
