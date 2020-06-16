import { forEach } from 'lodash'
import Sprite, { SpriteClass } from './Sprite'
import { getSpriteResiters } from './SpriteRegister'
export type CanvasContext = CanvasRenderingContext2D | null
const stageBox = {
  width: 3840,
  height: 2160
}
const stageRatio = stageBox.width/stageBox.height

export default class Stage{
  private container: HTMLDivElement
  canvas: HTMLCanvasElement
  frontendCanvas: HTMLCanvasElement

  context: CanvasContext
  frontendContext: CanvasContext

  sprites: Array<Sprite>

  constructor(container: HTMLDivElement) {
    this.container = container
    this.canvas = document.createElement('canvas')
    this.frontendCanvas = document.createElement('canvas')

    this.context = this.canvas.getContext('2d')
    this.frontendContext = this.canvas.getContext('2d')
    this.container.append(this.canvas)

    this.sprites = []

    this.init()
  }

  init() {
    this.updateBoxRect()
  }

  draw(){
    this.context!.clearRect(0, 0, stageBox.width, stageBox.height)
    forEach(this.sprites, (sprite: Sprite) => sprite.draw())
  }

  addSprite(props){
    const { type } = props
    const spriteMap = getSpriteResiters()
    const spriteClass: SpriteClass = spriteMap[type]
    const spriteInstance: Sprite = spriteClass.build(props)
    spriteInstance.setStage(this)
    this.sprites.push(spriteInstance)

    this.draw()
  }

  updateBoxRect(){
    const parent = this.container.parentNode as HTMLDivElement
    const { width: maxWidth, height: maxHeight }: DOMRect = parent.getBoundingClientRect()
    const ratio = maxWidth/maxHeight
    let width = maxWidth
    let height = maxWidth/stageRatio
    if(stageRatio < ratio) {
      height = maxHeight
      width = maxHeight * stageRatio
    }

    this.container.style.width = width +'px'
    this.container.style.height = height + 'px'
    
    this.canvas.width = stageBox.width
    this.canvas.height = stageBox.height
  }

  resize() {
    this.updateBoxRect()
    this.draw()
  }

}