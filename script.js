let countdown;
const timerDisplay = document.querySelector('.display__time-left');
const startTimeBtn = document.querySelector('[data-action="start"]');
const restartTimeBtn = document.querySelector('[data-action="stop"]');
const resetLocalStorageBtn = document.querySelector('[data-action="reset"]');
const endSound = document.querySelector('#end_sound');
const tableBody = document.querySelector('.table-body');
const entries = JSON.parse(localStorage.getItem('entries')) || [];
let notificationPermission = false;

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

function displayNotification(notificationText) {
  if (!notificationPermission) return;
  const notification = new Notification(notificationText, {
    icon: 'stopwatch.png',
  });

  notification.addEventListener('click', () => {
    window.focus();
  });
}

function makeBreak(hasBreak) {
  if (hasBreak) {
    timer(300, false);
  }
}

function extractHoursMinutes(date) {
  return date.split(' ').splice(4, 1)[0].slice(0, 5);
}

function saveTimeEntryToLocalStorage(startSeconds, endSeconds, type) {
  const startTime = extractHoursMinutes(Date(startSeconds));
  const endTime = extractHoursMinutes(Date(endSeconds));

  const entry = {
    startTime,
    endTime,
    type,
  };
  entries.push(entry);
  localStorage.setItem('entries', JSON.stringify(entries));
}

function retrieveTimeEntryFromLocalStorage() {
  tableBody.innerHTML = entries.map(entry => `
      <tr>
        <td class="mdl-data-table__cell--non-numeric">${entry.startTime}</td>
        <td class="mdl-data-table__cell--non-numeric">${entry.endTime}</td>
        <td class="mdl-data-table__cell--non-numeric">${entry.type}</td>
      </tr>
    `).join('');
}

function timer(seconds, hasBreakAfter = true) {
  const now = Date.now();
  const then = now + (seconds * 1000);
  displayTimeLeft(seconds);

  countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000);

    if (secondsLeft < 0) {
      clearInterval(countdown);
      playAudio();
      makeBreak(hasBreakAfter);
      displayNotification(hasBreakAfter ? 'Time to rest dude!' : 'Time to work dude!');
      saveTimeEntryToLocalStorage(now, then, hasBreakAfter ? 'Pomodoro' : 'Break');
      retrieveTimeEntryFromLocalStorage();
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

resetLocalStorageBtn.addEventListener('click', () => {
  localStorage.clear();
  window.location.reload(true);
});

Notification.requestPermission().then((result) => {
  if (result === 'granted') {
    notificationPermission = true;
  }
});

window.addEventListener('load', retrieveTimeEntryFromLocalStorage);
