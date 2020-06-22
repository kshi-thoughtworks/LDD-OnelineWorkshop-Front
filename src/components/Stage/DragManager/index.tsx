import Stage from '../index'
import Sprite, { SpriteBox } from '../Sprite'
export type Point = {
  clientX: number
  clientY: number
}
export default class DragManager {
  container: HTMLDivElement
  stage: Stage
  dragStartPoint?: Point
  selectedSprite?: Sprite
  selectedSpriteBox?: SpriteBox
  constructor(stage: Stage){
    this.stage = stage
    this.container = stage!.container
  }
  setup(){
    this.addMouseEventListeners()
  }
  addMouseEventListeners() {
    this.container.addEventListener('mousedown', this.onDragStart)
    this.container.addEventListener('click', this.onClick)
  }
  addDocumentMouseEvent(){
    document.addEventListener('mousemove', this.onDrag)
    document.addEventListener('mouseup', this.onDragEnd)
  }
  onClick = (event: MouseEvent) => {

  }
  onDragStart = (event: MouseEvent) => {
    const { clientX, clientY, offsetX, offsetY } = event
    const sprite = this.stage.findSpriteByPoint(offsetX, offsetY)
    if(!sprite) {
      return
    }
    this.dragStartPoint = { clientX, clientY }
    this.selectedSprite = sprite
    this.selectedSpriteBox = { x: sprite.x, y: sprite.y, width: sprite.width, height: sprite.height }
    this.addDocumentMouseEvent()
  }
  onDrag = (event: MouseEvent) => {
    const { clientX, clientY } = event
    const { clientX: originClientX, clientY: originClientY } = this.dragStartPoint!
    const offsetX = clientX - originClientX
    const offsetY = clientY - originClientY
    
    const { x, y } = this.selectedSpriteBox!
    this.selectedSprite!.x = x + offsetX / this.stage.ratio
    this.selectedSprite!.y = y + offsetY / this.stage.ratio
    this.stage.draw()
  }
  onDragEnd = (event: MouseEvent) => {
    this.clearDocumentMouseEvent()
  }
  clearMouseEvent(){
    this.container.removeEventListener('mousedown', this.onDragStart)
    this.container.removeEventListener('click', this.onClick)
  }
  clearDocumentMouseEvent(){
    document.removeEventListener('mousemove', this.onDrag)
    document.removeEventListener('mouseup', this.onDragEnd)
  }
}