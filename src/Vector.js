function Vector(x, y) {
  this.x = x || 0
  this.y = y || 0
}

Vector.prototype.copy = function() {
  return new Vector(this.x, this.y)
}

Vector.prototype.add = function(x, y) {
  if (x instanceof Vector) {
    this.x += x.x
    this.y += x.y
  } else {
    this.x += x || 0
    this.y += y || 0
  }

  return this
}

Vector.prototype.sub = function(x, y) {
  if (x instanceof Vector) {
    this.x -= x.x
    this.y -= x.y
  } else {
    this.x -= x || 0
    this.y -= y || 0
  }

  return this
}

Vector.prototype.mult = function(n) {
  if (typeof n === 'number') {
    this.x *= n
    this.y *= n
  }
  return this
}

Vector.prototype.mag = function() {
  return Math.sqrt(this.magSq())
}

Vector.prototype.magSq = function() {
  return this.x * this.x + this.y * this.y
}

Vector.prototype.limit = function(limit) {
  let magSq = this.magSq()
  return magSq > Math.pow(limit, 2) ? this.mult(limit / Math.sqrt(magSq)) : this
}

export default Vector
