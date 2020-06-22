import Stage, { stageBox } from '../index'
import Sprite, { SpriteBox } from '../Sprite'
import EventEmitter from '../../../services/EventEmitter'
export type Point = {
  clientX: number
  clientY: number
}
export default class DragManager extends EventEmitter{
  container: HTMLDivElement
  stage: Stage
  dragStartPoint?: Point
  selectedSprite?: Sprite<SpriteBox>
  selectedSpriteBox?: SpriteBox
  constructor(stage: Stage){
    super()
    this.stage = stage
    this.container = stage!.container
    this.stage.setDragManager(this)
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
    const { offsetX, offsetY } = event
    const sprite = this.stage.findSpriteByPoint(offsetX, offsetY)
    if(!sprite) {
      return
    }
    this.fire('click', sprite)
  }
  onDragStart = (event: MouseEvent) => {
    const { clientX, clientY, offsetX, offsetY } = event
    const sprite = this.stage.findSpriteByPoint(offsetX, offsetY)
    if(!sprite) {
      return
    }
    this.dragStartPoint = { clientX, clientY }
    this.selectedSprite = sprite
    const { x, y, width, height } = sprite.props
    this.selectedSpriteBox =  { x, y, width, height }
    this.addDocumentMouseEvent()
    this.fire('dragstart', sprite)
  }
  calculateDragSpriteBox(originBox: SpriteBox, offset: {x: number, y: number}): SpriteBox{
    const { x: offsetX, y: offsetY } = offset
    const spriteBox = this.selectedSprite!.calculateSpriteBox(originBox, 
      { x: offsetX, y: offsetY})
    const { x: boxX, y: boxY, width, height } = spriteBox
    const [ minX, minY ] = [-spriteBox.width/2, -spriteBox.height/2]
    const [ maxX, maxY ] = [ stageBox.width - spriteBox.width/2, stageBox.height - spriteBox.height/2 ]
    
    const spriteX = boxX > maxX ? maxX : (boxX < minX ? minX : boxX)
    const spriteY = boxY > maxY ? maxY : (boxY < minY ? minY : boxY)
    return { x: spriteX, y: spriteY, width, height }
  }
  onDrag = (event: MouseEvent) => {
    const { clientX, clientY } = event
    const { clientX: originClientX, clientY: originClientY } = this.dragStartPoint!
    const offsetX = clientX - originClientX
    const offsetY = clientY - originClientY
    
    const spriteBox = this.calculateDragSpriteBox(this.selectedSpriteBox!, { x: offsetX, y: offsetY})
    this.selectedSprite!.updateBox(spriteBox)

    this.stage.draw()
  }
  onDragEnd = (event: MouseEvent) => {
    this.clearDocumentMouseEvent()
    this.fire('dragend', this.selectedSprite)
  }

  clearMouseEvent(){
    this.container.removeEventListener('mousedown', this.onDragStart)
    this.container.removeEventListener('click', this.onClick)
  }
  clearDocumentMouseEvent(){
    document.removeEventListener('mousemove', this.onDrag)
    document.removeEventListener('mouseup', this.onDragEnd)
  }

  teardown(){
    super.teardown()
    this.clearDocumentMouseEvent()
    this.clearMouseEvent()
  }
}