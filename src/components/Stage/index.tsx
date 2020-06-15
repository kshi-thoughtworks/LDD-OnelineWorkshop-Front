export type CanvasContext = CanvasRenderingContext2D | null
const stageBox = {
  width: 3840,
  height: 2160
}

export default class Stage{
  private container: HTMLDivElement
  canvas: HTMLCanvasElement
  frontendCanvas: HTMLCanvasElement

  context: CanvasContext
  frontendContext: CanvasContext

  constructor(container: HTMLDivElement) {
    this.container = container
    this.canvas = document.createElement('canvas')
    this.frontendCanvas = document.createElement('canvas')

    this.context = this.canvas.getContext('2d')
    this.frontendContext = this.canvas.getContext('2d')
  }

  init() {
    this.canvas.width = stageBox.width
    this.canvas.height = stageBox.height
  }

  resize() {

  }

}