import Stage, { stageBox } from '../index'
import Sprite, { SpriteBox } from '../Sprite'
import EventEmitter from '../../../services/EventEmitter'
export type Point = {
  clientX: number
  clientY: number
}
enum DragType {
  MOVE = 'move',
  ZOOM = 'zoom'
}

enum ZoomOrientation{
  TOPLEFT = 'topLeft',
  TOPRIGHT = 'topRight',
  BOTTOMLEFT = 'bottomLeft',
  BOTTOMRIGHT = 'bottomRight'
}
export default class DragManager extends EventEmitter{
  container: HTMLDivElement
  zoomContainer: HTMLDivElement
  stage: Stage
  dragStartPoint?: Point
  selectedSprite?: Sprite<SpriteBox>
  selectedSpriteBox?: SpriteBox
  dragType: DragType = DragType.MOVE
  orientation?: ZoomOrientation
  dragWithChange: boolean = false
  constructor(stage: Stage){
    super()
    this.stage = stage
    this.container = stage.container
    this.zoomContainer = stage.zoomContainer!
    this.stage.setDragManager(this)
  }
  setup(){
    this.addMouseEventListeners()
  }
  addMouseEventListeners() {
    this.container.addEventListener('mousedown', this.onMoveStart)
    this.zoomContainer.addEventListener('mousedown', this.onZoomMouseDown)
    this.zoomContainer.addEventListener('dblclick', this.onDoubleClick)

    document.addEventListener('mousedown', this.onDocumentMouseDown)
  }
  addDocumentMouseEvent(){
    document.addEventListener('mousemove', this.onDrag)
    document.addEventListener('mouseup', this.onDragEnd)
  }
  resetSelection(){
    this.dragStartPoint = undefined
    this.selectedSprite = undefined
    this.selectedSpriteBox = undefined
    this.fire('resetselection')
  }
  calculateOffset(event: MouseEvent): {offsetX: number, offsetY: number} {
    const { clientX, clientY } = event
    const { x: rectX, y: rectY } = this.container.getBoundingClientRect()
    const offsetX = clientX - rectX
    const offsetY = clientY - rectY
    return { offsetX, offsetY }
  }
  calculateMoveSpriteBox(originBox: SpriteBox, offset: {x: number, y: number}): SpriteBox{
    const { x: offsetX, y: offsetY } = offset
    const spriteBox = this.selectedSprite!.calculateSpriteBox(originBox, 
      { x: offsetX, y: offsetY})
    const { x: boxX, y: boxY, width, height, scale: { x: scaleX, y: scaleY } } = spriteBox
    const scaleWidth = width * scaleX
    const scaleHeight = height * scaleY
    const [ minX, minY ] = [-scaleWidth/2, -scaleHeight/2]
    const [ maxX, maxY ] = [ stageBox.width - scaleWidth/2, stageBox.height - scaleHeight/2 ]
    
    const spriteX = boxX > maxX ? maxX : (boxX < minX ? minX : boxX)
    const spriteY = boxY > maxY ? maxY : (boxY < minY ? minY : boxY)
    return { x: spriteX, y: spriteY, width, height, scale: spriteBox.scale }
  }
  calculateZoomSpriteBox(originBox: SpriteBox, offset: {x: number, y: number}, orientation: ZoomOrientation): SpriteBox{
    const ratio = this.stage.ratio
    const { x: offsetX, y: offsetY } = offset
    const zoomStageOffsetX = offsetX / ratio
    const zoomStageOffsetY = offsetY / ratio

    let { x: left, y: top, width, height, scale: { x: scaleX, y: scaleY } } = originBox
    let right = left + width * scaleX
    let bottom = top + height * scaleY

    let zoomScale = 1
    let latestWidth = 0
    let latestHeight = 0
    switch(orientation) {
      case ZoomOrientation.TOPLEFT:
        top += zoomStageOffsetY
        left += zoomStageOffsetX
        latestWidth = right - left
        latestHeight = bottom - top
        if(latestWidth < width/2 && latestHeight < height/2) {
          top = bottom - width/2
          left = right - height/2
        } else {
          if(latestWidth > latestHeight) {
            top = bottom - latestWidth
          } else {
            left = right - latestHeight
          }
        }
        break;
      case ZoomOrientation.TOPRIGHT:
        top += zoomStageOffsetY
        right += zoomStageOffsetX
        latestWidth = right - left
        latestHeight = bottom - top
        if(latestWidth < width/2 && latestHeight < height/2) {
          top = bottom - width/2
          right = left + height/2
        } else {
          if(latestWidth > latestHeight) {
            top = bottom - latestWidth
          } else {
            right = left + latestHeight
          }
        }
        break;
      case ZoomOrientation.BOTTOMLEFT:
        bottom += zoomStageOffsetY
        left += zoomStageOffsetX
        latestWidth = right - left
        latestHeight = bottom - top
        if(latestWidth < width/2 && latestHeight < height/2) {
          bottom = top + width/2
          left = right - height/2
        } else {
          if(latestWidth > latestHeight) {
            bottom = top + latestWidth
          } else {
            left = right - latestHeight
          }
        }
        break;
      case ZoomOrientation.BOTTOMRIGHT:
        bottom += zoomStageOffsetX
        right += zoomStageOffsetY
        latestWidth = right - left
        latestHeight = bottom - top
        if(latestWidth < width/2 && latestHeight < height/2) {
          bottom = top + width/2
          right = left + height/2
        }
        break;
    }
    latestWidth = right - left
    latestHeight = bottom - top
    zoomScale = latestWidth > latestHeight ? latestWidth / width : latestHeight / height
    
    return { x: left, y: top, width, height, scale: { x: zoomScale, y: zoomScale } }
  }
  onDocumentMouseDown = () => {
    this.resetSelection()
  }
  onZoomMouseDown = (event: MouseEvent) => {
    const { target } = event
    const className = (target as HTMLSpanElement).className
    let isZoomOperation = false
    let isEditOperation = false
    let isMoveOperation = false
    if(!!className.indexOf) {
      isZoomOperation = className.indexOf('zoom-item') !== -1
      isEditOperation = className.indexOf('sprite-edit') !== -1
      isMoveOperation = className.indexOf('sprite-operation-container') !== -1
    }
    if(isZoomOperation) {
      const { target } = event
      const { orientation } = (target as HTMLSpanElement).dataset
      this.orientation = orientation as ZoomOrientation
      this.onZoomStart(event)
    } else if(isEditOperation){
      this.fire('edit-operation', this.selectedSprite)
    }else if(isMoveOperation){
      this.onMoveStart(event)
    } else {
      this.fire('edit-operation', this.selectedSprite)
    }
    event.stopPropagation()
  }
  onDoubleClick = (event: MouseEvent) => {
    this.fire('dblclick', this.selectedSprite)
    event.stopPropagation()
  }
  onMoveStart = (event: MouseEvent) => {
    this.dragType = DragType.MOVE
    this.onDragStart(event)
    event.stopPropagation()
  }
  onZoomStart = (event: MouseEvent) => {
    this.dragType = DragType.ZOOM
    this.onDragStart(event)
  }
  onZoomDrag = (event: MouseEvent) => {
    const { clientX, clientY } = event
    const { clientX: originClientX, clientY: originClientY } = this.dragStartPoint!
    const offsetX = clientX - originClientX
    const offsetY = clientY - originClientY
    
    const spriteBox = this.calculateZoomSpriteBox(this.selectedSpriteBox!, { x: offsetX, y: offsetY}, this.orientation as ZoomOrientation)
    this.selectedSprite!.updateBox(spriteBox)

    this.stage.draw()
    this.fire('drag', this.selectedSprite)
  }
  onMoveDrag = (event: MouseEvent) => {
    const { clientX, clientY } = event
    const { clientX: originClientX, clientY: originClientY } = this.dragStartPoint!
    const offsetX = clientX - originClientX
    const offsetY = clientY - originClientY
    
    const spriteBox = this.calculateMoveSpriteBox(this.selectedSpriteBox!, { x: offsetX, y: offsetY})
    this.selectedSprite!.updateBox(spriteBox)

    this.stage.draw()
    this.fire('drag', this.selectedSprite)
  }
  onDragStart = (event: MouseEvent) => {
    this.dragWithChange = false
    const { clientX, clientY } = event
    const { offsetX, offsetY } = this.calculateOffset(event)
    const sprite = this.stage.findSpriteByPoint(offsetX, offsetY)
    if(!sprite) {
      this.resetSelection()
      return
    }
    this.dragStartPoint = { clientX, clientY }
    this.selectedSprite = sprite
    const { x, y, width, height, scale } = sprite.props
    this.selectedSpriteBox =  { x, y, width, height, scale }

    this.addDocumentMouseEvent()
    this.fire('dragstart', sprite)
  }
  onDrag = (event: MouseEvent) => {
    this.dragWithChange = true
    return this.dragType === DragType.ZOOM ? this.onZoomDrag(event) : this.onMoveDrag(event)
  }
  onDragEnd = (event: MouseEvent) => {
    this.clearDocumentMouseEvent()
    this.fire('dragend', this.selectedSprite, this.dragWithChange)
  }

  clearMouseEvent(){
    this.container.removeEventListener('mousedown', this.onDragStart)

    this.zoomContainer.removeEventListener('mousedown', this.onZoomMouseDown)
    this.zoomContainer.removeEventListener('dblclick', this.onDoubleClick)

    document.removeEventListener('mousedown', this.onDocumentMouseDown)
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