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

import Vector from './Vector'
import { random, easeMapping, deepExtend } from './utils'

/*------- Biotope Class: Controls Amoeba Class -------*/
export default function Biotope(ctx, options) {
  this.amoebas = []
  this.ctx = ctx
  this.width = ctx.canvas.width / 2
  this.height = ctx.canvas.height / 2
}

Biotope.init = function(tagId = 'amoeba-js', options) {
  let targetEl = document.querySelector(`#${tagId}`)

  if (targetEl) {
    let width = targetEl.clientWidth || 600
    let height = targetEl.clientHeight || 300
    let canvas = document.createElement('canvas')

    canvas.width = width * 2
    canvas.height = height * 2
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'
    let ctx = canvas.getContext('2d')
    ctx.scale(2, 2)
    targetEl.appendChild(canvas)

    return new Biotope(ctx, options)
  }
}

Biotope.prototype.addAmoeba = function(center, options) {
  center = center || [this.width / 2, this.height / 2]

  this.amoebas.push(new Amoeba(this.ctx, center, options))
}

Biotope.prototype.removeAmoeba = function(idx) {
  if (idx) {
    return this.amoebas.splice(num, 1)[0]
  } else {
    return this.amoebas.pop()
  }
}

Biotope.prototype.update = function() {
  const { ctx } = this
  this.amoebas.forEach(amoeba => amoeba.update())

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  this.amoebas.forEach(amoeba => amoeba.render())

  window.requestAnimationFrame(this.update.bind(this))
}

/*------- Amoeba Class -------*/
export function Amoeba(ctx, center, options) {
  this.ctx = ctx

  if (typeof center === 'undefined') {
    center = new Vector(0, 0)
  } else if (center.constructor === Array) {
    center = new Vector(center[0], center[1])
  }
  this.center = center
  this.width = ctx.canvas.width / 2
  this.height = ctx.canvas.height / 2

  // static properties
  this.options = deepExtend(
    {
      shape: {
        numOfPoints: 100,
        radius: 40,
        waveLength: 20, // numOfPoints % waveLength must be 0
        spikyness: 0.5,
        scaleX: 1,
        scaleY: 1
      },
      style: {
        fillStyle: 'rgba(0,0,0,0.1)', // false == nofill
        strokeStyle: false,
        lineWidth: 10
      },
      animation: {
        enabled: true,
        span: 200,
        startTime: 0,
        wiggle: true
      },
      move: {
        enabled: false,
        maxSpeed: 2,
        contain: true,
        padding: 10
      }
    },
    options
  )

  // Init
  this.time = this.options.animation.startTime
  this.fromState = this.generateState()
  this.toState = this.generateState()
  this.coords = this.generateCoords()
  this.center = center
  this.velocity = new Vector(0, 0)
}

Amoeba.prototype.updateOptions = function(options) {
  this.options = deepExtend(this.options, options)
}

Amoeba.prototype.stopAnimation = function() {
  this.updateOptions({ animation: { enabled: false } })
}

Amoeba.prototype.stopMove = function() {
  this.updateOptions({ move: { enabled: false } })
}

/* Generates random radiuses for polar coordinates */
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

/* Generate Cartesian coordinates from polar radiuse */
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

Amoeba.prototype.move = function() {
  let { velocity, center, ctx, width, height } = this

  let { radius, scaleX, scaleY } = this.options.shape
  let { maxSpeed, contain, padding } = this.options.move

  let speedBump = maxSpeed / 100
  velocity.add(random(-0.01, 0.01), random(-0.01, 0.01)).limit(maxSpeed)

  // If contain is true, keep amoeba within canvas
  if (contain) {
    let paddingX = radius * scaleX + padding,
      paddingY = radius * scaleY + padding
    if (center.x < 0 + paddingX) {
      velocity.add(speedBump, 0).limit(maxSpeed)
    } else if (center.x > width - paddingX * 2) {
      velocity.add(-speedBump, 0).limit(maxSpeed)
    }

    if (this.center.y < 0 + paddingY * 2) {
      this.velocity.add(0, speedBump).limit(maxSpeed)
    } else if (this.center.y > height - paddingY) {
      this.velocity.add(0, -speedBump).limit(maxSpeed)
    }
  }

  center.add(velocity)
}

Amoeba.prototype.update = function() {
  const { animation, move } = this.options

  this.time += 1
  if (animation.enabled) {
    if (this.time >= animation.span) {
      this.fromState = this.toState
      this.toState = this.generateState()
      this.time = 0
    }
    this.coords = this.generateCoords()
  }

  if (move.enabled) this.move()
}

Amoeba.prototype.render = function() {
  const { ctx, coords } = this
  const {
    strokeStyle,
    lineWidth,
    fillStyle,
    scaleX,
    scaleY
  } = this.options.style

  ctx.save()
  ctx.translate(this.center.x, this.center.y)
  ctx.scale(scaleX, scaleY)
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
