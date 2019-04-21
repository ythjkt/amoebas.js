/*------- Biotope Class: Controls Amoeba Class -------*/
import Amoeba from './Amoeba'

function Biotope(ctx, options) {
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

export default Biotope
