import { find, findLast, forEach } from 'lodash'
import Sprite, { SpriteClass, SpriteBox } from './Sprite'
import DragManager from './DragManager'
import { getSpriteResiters } from './SpriteRegister'
import './index.scss'

export type CanvasContext = CanvasRenderingContext2D | null
export const stageBox = {
  width: 3840,
  height: 2160
}
const stageRatio = stageBox.width/stageBox.height

export default class Stage {
  container: HTMLDivElement
  zoomContainer: HTMLDivElement | null
  canvas: HTMLCanvasElement

  context: CanvasContext

  sprites: Array<Sprite<SpriteBox>>

  dragManager?: DragManager

  constructor(container: HTMLDivElement) {
    this.container = container
    const zoomContainer = `
      <div class="sprite-operation-container">
        <span class="zoom-item top-left" data-orientation="topLeft"></span>
        <span class="sprite-edit"></span>
        <span class="zoom-item bottom-left" data-orientation="bottomLeft"></span>
        <span class="zoom-item bottom-right" data-orientation="bottomRight"></span>
      </div>`
    this.container.innerHTML = zoomContainer
    this.zoomContainer = this.container.querySelector('.sprite-operation-container')

    this.canvas = document.createElement('canvas')
    this.context = this.canvas.getContext('2d')
    this.container.append(this.canvas)

    this.sprites = []

    this.init()
  }

  get ratio() {
    const { width }: DOMRect = this.container.getBoundingClientRect()
    return width / stageBox.width
  }

  init() {
    this.updateBoxRect()
  }

  setDragManager(dragManager: DragManager){
    this.dragManager = dragManager
    this.dragManager.setup()
    this.dragManager.addEventListener('resetselection', this.onResetSelection)
    this.dragManager.addEventListener('dragstart', this.updateSelection)
    this.dragManager.addEventListener('drag', this.updateSelection)
  }

  onResetSelection = () => {
    this.zoomContainer!.style.display = 'none'
  }

  updateSelection = () => {
    const sprite = this.dragManager?.selectedSprite
    if(!sprite) {
      return
    }
    const style = this.zoomContainer!.style
    const { x, y, width, height } = sprite.calcaulateSpritePixelBox()
    style.left = `${x}px`
    style.top = `${y}px`
    style.width = `${width}px`
    style.height = `${height}px`
    style.display = 'block'
  }
  
  findSpriteByPoint(left: number, top: number) : Sprite<SpriteBox>{
    return findLast(this.sprites, (sprite: Sprite<SpriteBox>) => sprite.pointInSprite(left, top))
  }

  findSpriteById(id): Sprite<SpriteBox>{
    return find(this.sprites, (sprite: Sprite<SpriteBox>) => sprite.id === id)
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

    this.updateSelection()
  }

  destroy() {
    this.dragManager?.teardown()
  }

}