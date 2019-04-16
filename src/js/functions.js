export function resizeCanvas(canvas, width, height) {
  canvas.width = width || window.innerWidth
  canvas.height = height || window.innerHeight
}
