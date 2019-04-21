import Biotope from './amoeba'
import palettes from 'nice-color-palettes'

let palette = pick(palettes)
// let palette = ['#aaa', '#e1e1e1', '#eee']
let biotope = Biotope.init('amoeba-js')

let width = biotope.width
let height = biotope.height
let steps = 7

let coords = []

let padding = 100

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
      fillStyle: pick(palette)
    },
    shape: {
      radius: pick([15, 20]),
      spikyness: 0.4,
      numOfPoints: 80,
      waveLength: 10
    },
    animation: {
      span: pick([80]),
      wiggle: true
    }
  })
})
biotope.update()

// biotope.ctx.canvas.style.backgroundColor = pick(palette)

function pick(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function lerp(start, end, pos) {
  return start + (end - start) * pos
}
