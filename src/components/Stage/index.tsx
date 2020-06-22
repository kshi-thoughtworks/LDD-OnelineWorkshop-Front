import { findLast, forEach } from 'lodash'
import Sprite, { SpriteClass, SpriteBox } from './Sprite'
import DragManager from './DragManager'
import { getSpriteResiters } from './SpriteRegister'
export type CanvasContext = CanvasRenderingContext2D | null
export const stageBox = {
  width: 3840,
  height: 2160
}
const stageRatio = stageBox.width/stageBox.height

export default class Stage {
  container: HTMLDivElement
  canvas: HTMLCanvasElement
  frontendCanvas: HTMLCanvasElement

  context: CanvasContext
  frontendContext: CanvasContext

  sprites: Array<Sprite<SpriteBox>>

  dragManager?: DragManager

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

  get ratio() {
    const { width }: DOMRect = this.container.getBoundingClientRect()
    return width / stageBox.width
  }

  setDragManager(dragManager: DragManager){
    this.dragManager = dragManager
    this.dragManager.setup()
  }

  init() {
    this.updateBoxRect()
  }
  
  findSpriteByPoint(left: number, top: number) : Sprite<SpriteBox>{
    return findLast(this.sprites, (sprite: Sprite<SpriteBox>) => sprite.pointInSprite(left, top))
  }

  readSprites(spriteProps) {
    this.sprites = []
    forEach(spriteProps, props => {
      const spriteInstance = this.buildSprite(props)
      
      spriteInstance.setStage(this)
      this.sprites.push(spriteInstance)
    })
    this.draw()
  }

  addSprite(props){
    const spriteInstance: Sprite<SpriteBox> = this.buildSprite(props)
    spriteInstance.setStage(this)
    this.sprites.push(spriteInstance)

    this.draw()
  }

  buildSprite(props) {
    const { type } = props
    const spriteMap = getSpriteResiters()
    const spriteClass: SpriteClass = spriteMap[type]
    const spriteInstance: Sprite<SpriteBox> = spriteClass.build(props)
    spriteInstance.setStage(this)
    return spriteInstance
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

  draw(){
    this.context!.clearRect(0, 0, stageBox.width, stageBox.height)
    forEach(this.sprites, (sprite: Sprite<SpriteBox>) => sprite.draw())
  }

  resize() {
    this.updateBoxRect()
    this.draw()
  }

  destroy() {
    this.dragManager?.teardown()
  }

}