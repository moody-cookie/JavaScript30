const timerDisplay = document.querySelector('.display__time-left')
const endTimeDisplay = document.querySelector('.display__end-time')
const buttons = document.querySelectorAll('.timer__button')

const ppTime = time => ('' + time).padStart(2, '0')

const displayTimeLeft = seconds => {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  const strtime = `${ppTime(minutes)}:${ppTime(secs)}`

  timerDisplay.textContent = strtime
  document.title = strtime
}

const displayEndTime = ts => {
  const end = new Date(ts)
  const hours = end.getHours()
  const minutes = end.getMinutes()
  endTimeDisplay.textContent = `Be back at ${ppTime(hours)}:${ppTime(minutes)}`
}

let interval = null
const timer = (seconds) => {
  if (interval) {
    clearInterval(interval)
  }
  const now = Date.now()
  const then = now + seconds * 1000

  displayTimeLeft(seconds)
  displayEndTime(then)

  interval = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000)
    if (secondsLeft <= 0) {
      clearInterval(timer)
      return
    }
    displayTimeLeft(secondsLeft)
  },1000)
}

const startTimer = e => {
  const seconds = parseInt(e.target.dataset.time)
  timer(seconds)
}

buttons.forEach(button => button.addEventListener('click', startTimer))

document.customForm.addEventListener('submit', e => {
  e.preventDefault()
  const mins = e.target.minutes.value
  e.target.reset()
  timer(mins * 60)
})