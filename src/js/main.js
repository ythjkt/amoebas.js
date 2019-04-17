import { resizeCanvas } from './functions'
import setUp from './amoeba'
import palettes from 'nice-color-palettes'

const canvas = document.getElementById('myCanvas')

if (canvas.getContext) {
  const ctx = canvas.getContext('2d')

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  setUp(ctx)
}
