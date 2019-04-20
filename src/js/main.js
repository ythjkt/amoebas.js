import init from './amoeba'
import palettes from 'nice-color-palettes'

let palette = pick(palettes)
window.palette = palette
init('amoeba-js')

let width = biotope.width
let height = biotope.height
let steps = 8

let coords = []

let padding = 80

for (let i = 0; i < steps; i++) {
  for (let j = 0; j < steps; j++) {
    coords.push([i / (steps - 1), j / (steps - 1)])
  }
}

coords.forEach(([x, y]) => {
  x = lerp(padding, width - padding, x)
  y = lerp(padding, height - padding, y)

  biotope.addAmoeba([x, y], {
    style: {
      fillStyle: pick(palette),
      strokeStyle: pick(palette),
      lineWidth: 6
    },
    shape: { radius: pick([10, 15]), spikyness: 0.3, numOfPoints: 40 }
  })
})
biotope.update()

function pick(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function lerp(start, end, pos) {
  return start + (end - start) * pos
}
