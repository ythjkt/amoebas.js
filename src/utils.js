export function easeMapping(from, to, span, time) {
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

export function deepExtend(destination, source) {
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

export function random(x, y) {
  return x + Math.random() * (y - x)
}
