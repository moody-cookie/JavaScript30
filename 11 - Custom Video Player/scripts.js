const video = document.querySelector('.player__video')
const playButton = document.querySelector('.player__button')
const playSymbol = '►'
const pauseSymbol = '| |'

const sliderList = document.querySelectorAll('.player__slider')
////////////////////////////
// Video playback
////////////////////////////

// play video
let playing = false
const playToggle = () => {
  playing = !playing

  if (playing) {
    video.play()
  } else {
    video.pause()
  }
}
// render play button
const renderPlayButton = () => {
  if (playing) {
    playButton.textContent = pauseSymbol
  } else {
    playButton.textContent = playSymbol
  }
}

video.addEventListener('click', (e) => {
  playToggle()
  renderPlayButton()
})

video.addEventListener('ended', (e) => {
  playing = false
  renderPlayButton()
})

////////////////////////////
// Video volume and speed
////////////////////////////

sliderList.forEach((slider) => {
  slider.addEventListener('input', (e) => {
    const { name, value } = e.target
    video[name] = value
  })
})

////////////////////////////
// Video position
////////////////////////////

// determine percent of elapsed/remaining video
const progress = document.querySelector('.progress')
const progressFilled = document.querySelector('.progress__filled')
const skipList = document.querySelectorAll('.player__button')

skipList.forEach((element) => {
  element.addEventListener('click', (e) => {
    video.currentTime += parseFloat(e.target.dataset.skip)
  })
})

const determineElapsed = () => {
  const elapsedTime = video.currentTime
  const totalTime = video.duration
  return (elapsedTime / totalTime) * 100
}

const renderVideoTime = () => {
  const progressPercent = determineElapsed()
  progressFilled.style.flexBasis = `${progressPercent}%`
}

const changeVideotime = (e) => {
  const progressWidth = progress.offsetWidth
  const clickedWidth = e.layerX
  const newProgressPersent = clickedWidth / progressWidth
  const newProgress = newProgressPersent * video.duration
  video.currentTime = newProgress
  renderVideoTime()
}

let isTimeChanging = false
progress.addEventListener('mousedown', (e) => {
  isTimeChanging = true
  changeVideotime(e)
})

progress.addEventListener('mousemove', (e) => {
  if (!isTimeChanging) return
  changeVideotime(e)
})

document.body.addEventListener('mouseup', (e) => {
  isTimeChanging = false
})

video.addEventListener('timeupdate', renderVideoTime)
