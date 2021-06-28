const video = document.querySelector('.player')
const canvas = document.querySelector('.photo')
const takePhotoBtn = document.querySelector('.take-photo')
const ctx = canvas.getContext('2d')
const strip = document.querySelector('.strip')
const snap = document.querySelector('.snap')

let height, width
let interval

const getVideo = () => {
  return navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then((localMediaStream) => {
      video.srcObject = localMediaStream
      video.play()
    })
    .catch((err) => {
      alert('Oh no, you denied your web cam! =(')
      console.log(err)
    })
}

const redEffect = (pixels) => {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i] += 100
    pixels.data[i + 1] -= 50
    pixels.data[i + 2] *= 0.5
  }

  return pixels
}

const posterization = (pixels, gradation) => {
  const grads = Array(gradation)
    .fill(0)
    .map((_, index) => [
      Math.round((index * 255) / gradation),
      Math.round(((index + 1) * 255) / gradation),
    ])
  console.log(grads)

  for (let i = 0; i < pixels.data.length; i += 4) {
    const avg = (pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2]) / 3
    const [value, value2] = grads.find((item) => {
      const [min, max] = item
      return avg >= min && avg < max
    })
    pixels.data[i] =
      pixels.data[i + 1] =
      pixels.data[i + 2] =
        (value2 + value) / 2
  }

  return pixels
}

const rgbSwap = (pixels) => {
  for (let i = 0; i < pixels.data.length; i += 4) {
    let temp = pixels.data[i + 0]
    pixels.data[i + 0] = pixels.data[i + 1]
    pixels.data[i + 1] = pixels.data[i + 2]
    pixels.data[i + 2] = temp
  }

  return pixels
}

const greenScreen = (pixels) => {
  let levels = {}

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value
  })

  for (let i = 0; i < pixels.data.length; i += 4) {
    let red = pixels.data[i + 0],
      green = pixels.data[i + 1],
      blue = pixels.data[i + 2],
      alpha = pixels.data[i + 3]

    if (
      red >= levels.rmin &&
      green >= levels.gmin &&
      blue >= levels.bmin &&
      red <= levels.rmax &&
      green <= levels.gmax &&
      blue <= levels.bmax
    ) {
      pixels.data[i + 3] = 0
    }
  }
  return pixels
}

const paintToCanvas = () => {
  if (video.readyState < 2) return

  ctx.drawImage(video, 0, 0, width, height)
  let pixels = ctx.getImageData(0, 0, width, height)

  // pixels = redEffect(pixels)
  // pixels = posterization(pixels, 3)
  // pixels = rgbSwap(pixels)
  pixels = greenScreen(pixels)

  ctx.globalAlpha = 0.75
  ctx.putImageData(pixels, 0, 0)
  window.requestAnimationFrame(paintToCanvas)
}

const takePhoto = () => {
  // play sound
  snap.currenTime = 0
  snap.play()

  // take the data out of the canvas
  const data = canvas.toDataURL('image/jpeg')
  const link = document.createElement('a')
  link.href = data
  link.download = `webcam${new Date()}`
  link.innerHTML = `<img src=${data} alt="Handsome Dude" />`
  strip.prepend(link)
}

takePhotoBtn.addEventListener('click', (e) => {
  setTimeout(takePhoto, 3000)
})

getVideo()
video.addEventListener('canplay', (e) => {
  width = video.videoWidth
  height = video.videoHeight

  canvas.width = width
  canvas.height = height
  paintToCanvas()
})
