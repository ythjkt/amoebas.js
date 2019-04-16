/* -----------------------------------------------
 * Author: Yuta Hijikata
 * MIT license: http://opensource.org/licenses/MIT
 * GitHub: github.com/ythjkt/amoeba.js
 * v: 0.0.1 (Gamma)
 * -----------------------------------------------
 * TODOS:
 * - Create move method
 *   - Options: contained, wrap, avoid etc
 * - Create parent class Amebas
 *   - Methods:
 *     - Update
 *     - Render
 *     - Resize
 *     - Init (load method etc)
 * - Move clearRect to parent class
 * - Move all options to option object
 * ----------------------------------------------- */

import random from './random'
import palettes from 'nice-color-palettes'

let palette = palettes[Math.floor(Math.random() * 100)]
let color1 = palette[0]
let color2 = palette[1]

function setUp(ctx, numOfPoints) {
  let center = [ctx.canvas.width / 2, ctx.canvas.height / 2]
  let ameba = new Ameba(ctx, center, numOfPoints)
  ameba.update()
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

function Ameba(ctx, center, numOfPoints) {
  this.ctx = ctx
  this.center = center

  // Options
  this.numOfPoints = numOfPoints || 100
  this.radius = 100
  this.span = 100
  this.waveLength = 50 // numOfPoints must be divisable by waveLength
  this.spikyness = 0.3
  this.wiggle = true

  this.fillStyle = color1 || false
  this.strokeStyle = color2 || false
  this.lineWidth = 10

  // Init
  this.time = 0
  this.fromState = this.generateState()
  this.toState = this.generateState()
  this.coords = this.generateCoords()
}

/**
 * Generates random radiuses for polar coordinates
 */
Ameba.prototype.generateState = function() {
  const { numOfPoints, waveLength, spikyness } = this

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
Ameba.prototype.generateCoords = function() {
  const { fromState, toState, span, time, numOfPoints, radius, wiggle } = this
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

Ameba.prototype.update = function() {
  const ctx = this.ctx
  this.time = this.time + 1
  if (this.time === this.span) {
    this.fromState = this.toState
    this.toState = this.generateState(this.numOfPoints)
    this.time = 0
  }

  this.coords = this.generateCoords()

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  this.render()
  window.requestAnimationFrame(this.update.bind(this))
}

Ameba.prototype.render = function() {
  const { ctx, coords } = this

  ctx.save()
  ctx.translate(this.center[0], this.center[1])

  ctx.beginPath()
  for (let i = 0; i < this.numOfPoints; i++) {
    ctx.lineTo(coords[2 * i], coords[2 * i + 1])
  }
  ctx.lineTo(coords[0], coords[1])

  if (this.fillStyle) {
    ctx.fillStyle = this.fillStyle
    ctx.fill()
  }
  if (this.strokeStyle) {
    ctx.lineWidth = this.lineWidth
    ctx.strokeStyle = this.strokeStyle
    ctx.stroke()
  }

  ctx.restore()
}

export default setUp
