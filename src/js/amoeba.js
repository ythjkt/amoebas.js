/* -----------------------------------------------
 * Author: Yuta Hijikata
 * MIT license: http://opensource.org/licenses/MIT
 * GitHub: github.com/ythjkt/amoeba.js
 * v: 0.0.1 (Gamma)
 * -----------------------------------------------
 * DONEs:
 * - Create move method
 * TODOS:
 * - Create parent class Amoebas
 *   - Methods:
 *     - Update
 *     - Render
 *     - Resize
 *     - Init (load method etc)
 * - Move clearRect to parent class
 * - Move all options to option object
 * ----------------------------------------------- */

import random from './random'
import Vector from './Vector'
import palettes from 'nice-color-palettes'

let palette = palettes[Math.floor(Math.random() * 100)]
let color1 = 'rgba(255,255,255,0.1)'
let color2 = false //palette[1]

function setUp(ctx) {
  let biotope = new Biotope(ctx)

  let center = new Vector(ctx.canvas.width / 2, ctx.canvas.height / 2)

  biotope.addAmoeba(center, {
    style: { fillStyle: palette[4] },
    animation: { span: 100, startTime: 40 }
  })
  biotope.addAmoeba(center, {
    style: { fillStyle: palette[0] },
    animation: { startTime: 20 }
  })
  biotope.addAmoeba(center, { style: { fillStyle: palette[1] } })
  biotope.addAmoeba(center, { style: { fillStyle: palette[2] } })
  biotope.update()
  window.biotope = biotope
}

function easeMapping(from, to, span, time) {
  // http://gizma.com/easing/
  // 0 <= time <= span
  let change = to - from
  time /= span / 2
  if (time < 1) return (change / 2) * time * time * time + from
  else {
    time -= 2
    return (change / 2) * (time * time * time + 2) + from
  }
}

function deepExtend(destination, source) {
  for (let property in source) {
    if (
      source[property] &&
      source[property].constructor &&
      source[property].constructor === Object
    ) {
      destination[property] = destination[property] || {}
      deepExtend(destination[property], source[property])
    } else {
      destination[property] = source[property]
    }
  }
  return destination
}

function Biotope(ctx, num) {
  this.amoebas = []
  this.ctx = ctx
}

Biotope.prototype.addAmoeba = function(center, options) {
  this.amoebas.push(new Amoeba(this.ctx, center, options))
  window.amoeba = this.amoebas[0]
}

Biotope.prototype.update = function() {
  const { ctx } = this
  this.amoebas.forEach(amoeba => amoeba.update())
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  this.amoebas.forEach(amoeba => amoeba.render())

  window.requestAnimationFrame(this.update.bind(this))
}

function Amoeba(ctx, center, options) {
  this.ctx = ctx
  this.center = center

  this.options = deepExtend(
    {
      // static options
      shape: {
        numOfPoints: 100,
        radius: 100,
        waveLength: 20, // numOfPoints % waveLength must be 0
        spikyness: 0.5
      },
      style: {
        fillStyle: 'white', // false == nofill
        strokeStyle: false,
        lineWidth: 10
      },
      animation: {
        span: 200,
        startTime: 0,
        wiggle: true,
        movable: true,
        maxSpeed: 0.1
      }
    },
    options
  )

  this.fromPosition = this.center
  this.toPosition = this.center
  this.randomWalk = this.generateRandomWalk()

  // Init
  this.time = this.options.animation.startTime
  this.fromState = this.generateState()
  this.toState = this.generateState()
  this.coords = this.generateCoords()
}

/**
 * Generates random radiuses for polar coordinates
 */
Amoeba.prototype.generateState = function() {
  const { numOfPoints, waveLength, spikyness } = this.options.shape

  let state = [],
    original,
    diff,
    a,
    b

  a = random(-0.5, 0.5)
  b = random(-0.5, 0.5)
  original = diff = a

  state[0] = 1 + diff * spikyness

  // Generate random points at every waveLength
  // and interpolates between those points with easyMapping
  for (let i = 1; i < numOfPoints; i++) {
    if (i + waveLength === numOfPoints) {
      a = b
      b = original
      diff = a
    } else if (i % waveLength === 0) {
      a = b
      b = random(-0.5, 0.5)
      diff = a
    } else {
      diff = easeMapping(a, b, waveLength, i % waveLength)
    }
    state[i] = 1 + diff * spikyness
  }

  return state
}

/**
 * Generate Cartesian coordinates from polar radiuse
 */
Amoeba.prototype.generateCoords = function() {
  const { fromState, toState, time } = this
  const { numOfPoints, radius } = this.options.shape
  const { span, wiggle } = this.options.animation
  let currentState = []

  // Interpolates radiuses from fromState and toState
  for (let i = 0; i < fromState.length; i++) {
    currentState[i] = easeMapping(fromState[i], toState[i], span, time)
  }

  let coords = []
  let unitAng = (2 * Math.PI) / numOfPoints
  for (let i = 0; i < numOfPoints; i++) {
    let ang = unitAng * i

    // if wiggle, shake angle slightly
    if (wiggle) {
      ang += Math.cos(Math.PI * 2 * (time / span) + ang) * 0.2
      ang += Math.cos(Math.PI * 2 * (time / span) * 2 + ang) * 0.05
    }

    coords[2 * i] = currentState[i] * Math.cos(ang) * radius
    coords[2 * i + 1] = currentState[i] * Math.sin(ang) * radius
  }
  return coords
}

Amoeba.prototype.generateRandomWalk = function() {
  const { span, maxSpeed } = this.options.animation

  const newDiff = new Vector(
    maxSpeed * random(-1, 1),
    maxSpeed * random(-1, 1)
  ).mult(span / 2)
  return this.randomWalk
    ? this.randomWalk
        .copy()
        .mult(1 / 2)
        .add(newDiff)
    : newDiff
}

Amoeba.prototype.generatePosition = function() {
  const { radius, spikyness } = this.options.shape

  let newPosition = this.fromPosition.copy().add(this.randomWalk)

  let maxRadius = radius * (1 + spikyness)
  if (newPosition.x > this.ctx.canvas.width - maxRadius)
    newPosition.x = this.ctx.canvas.width - maxRadius
  else if (newPosition.x < 0 + maxRadius) newPosition.x = maxRadius
  if (newPosition.y > this.ctx.canvas.height - maxRadius)
    newPosition.y = this.ctx.canvas.height - maxRadius
  else if (newPosition.y < 0 + maxRadius) newPosition.y = maxRadius

  return newPosition
}

Amoeba.prototype.generateCenter = function() {
  const { fromPosition, toPosition, time } = this
  const { span } = this.options.animation

  const x = easeMapping(fromPosition.x, toPosition.x, span, time)
  const y = easeMapping(fromPosition.y, toPosition.y, span, time)

  return new Vector(x, y)
}

Amoeba.prototype.update = function() {
  const { span, movable } = this.options.animation

  this.time = this.time + 1
  if (this.time >= span) {
    this.fromState = this.toState
    this.toState = this.generateState()

    if (movable) {
      this.fromPosition = this.toPosition
      this.randomWalk = this.generateRandomWalk()
      this.toPosition = this.generatePosition()
    }

    this.time = 0
  }

  this.coords = this.generateCoords()
  if (movable) {
    this.center = this.generateCenter()
  }
}

Amoeba.prototype.render = function() {
  const { ctx, coords } = this
  const { strokeStyle, lineWidth, fillStyle } = this.options.style

  ctx.save()
  ctx.translate(this.center.x, this.center.y)

  ctx.beginPath()

  for (let i = 0; i < coords.length / 2; i++) {
    ctx.lineTo(coords[2 * i], coords[2 * i + 1])
  }
  ctx.lineTo(coords[0], coords[1])
  if (fillStyle) {
    ctx.fillStyle = fillStyle
    ctx.fill()
  }
  if (strokeStyle) {
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = strokeStyle
    ctx.stroke()
  }

  ctx.restore()
}

export default setUp
