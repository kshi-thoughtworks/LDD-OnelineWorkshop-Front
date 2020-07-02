import Vue from 'vue'
import { Component, PropSync } from 'vue-property-decorator'
import DragManager from './DragManager'
import Sprite, { SpriteBox } from './Sprite'
import Stage from './index'

type SpriteId = number | null
interface SpriteCallback{
  (sprite: Sprite<SpriteBox>): void
}
type StageListeners = {
  dragStart: SpriteCallback,
  dragEnd: (sprite: Sprite<SpriteBox>, changed: boolean) => void,
  dblClickSprite: SpriteCallback,
}
@Component
export default class StageComponent extends Vue{

  @PropSync('readonly', { type: Boolean }) readOnly!: boolean

  private stage!: Stage
  private selectedSpriteId: SpriteId = null //没有初始化或初始化值为undefined的属性不会放进data，不会生成监听器
  private menuPosition: { x: number, y: number} | null = { x: -1000, y: -1000 }

  getMenuPosition(): { x: number, y: number } {
    if(this.selectedSpriteId) {
      const sprite = this.stage.findSpriteById(this.selectedSpriteId)
      const { x, y, width } = sprite.calcaulateSpritePixelBox()
      return { x: x + width, y }
    }
    return { x: -1000, y: -1000}
  }

  calculateSelectionBoxStyle(){
    const hideStyle = { display: 'none' }
    const sprite = this.selectedSpriteId && this.stage.findSpriteById(this.selectedSpriteId)
    if(!sprite) {
      return hideStyle
    }
    
    const { x, y, width, height } = sprite.calcaulateSpritePixelBox()
    return { left: `${x}px`, top: `${y}px`, width: `${width}px`, height: `${height}px`, display: 'block' }
  }

  initStage() {
    const { stage } = this.$refs
    this.stage = new Stage(stage as HTMLDivElement)
    if(!this.readOnly) {
      const dragManager = new DragManager(this.stage)
      dragManager.addEventListener('dragstart', this.onDragStart)
      dragManager.addEventListener('drag', this.onDrag)
      dragManager.addEventListener('dragend', this.onDragEnd)
      dragManager.addEventListener('dblclick', this.onDblClickSprite)
      dragManager.addEventListener('edit-operation', this.onToggleMenu)
      dragManager.addEventListener('resetselection', this.onResetSelection)
    }
  }

  setSprites(sprites) {
    this.stage.patchSprites(sprites)
    this.$forceUpdate() // sprites更新并不会触发组件的更新，并没有监听sprites
  }

  getSprite(spriteId){
    return this.stage.findSpriteById(spriteId)
  }

  hideMenu(){
    this.menuPosition = null
  }

  clearSelection() {
    this.stage.resetSelection()
  }

  resetSpriteZIndex(){
    const prevSprite = this.selectedSpriteId && this.stage.findSpriteById(this.selectedSpriteId)
    if(prevSprite) {
      prevSprite.zIndex = 0
    }
  }

  onDragStart(sprite){
    this.resetSpriteZIndex()

    this.selectedSpriteId = sprite.id
    sprite.zIndex = 1
    this.stage.draw()
    
    this.hideMenu()
    const { dragStart } = this.$listeners as StageListeners
    dragStart && dragStart(sprite)
  }

  onDrag(sprite: Sprite<SpriteBox>, spriteBox: SpriteBox){
    sprite.updateBox(spriteBox)
    this.stage.draw()
    this.$forceUpdate()
  }

  onDragEnd(sprite: Sprite<SpriteBox>, changed: boolean){
    if(!changed) {
      return
    }
    const { dragEnd } = this.$listeners as StageListeners
    dragEnd && dragEnd(sprite, changed)
  }

  onDblClickSprite(sprite: Sprite<SpriteBox>){
    const { dblClickSprite } = this.$listeners as StageListeners
    dblClickSprite && dblClickSprite(sprite)
  }

  onToggleMenu(sprite: Sprite<SpriteBox>){
    const { dragStart } = this.$listeners as StageListeners
    dragStart && dragStart(sprite)

    if(this.menuPosition) {
      this.hideMenu()
      return
    }
    this.menuPosition = this.getMenuPosition()
  }

  onResetSelection(){
    this.resetSpriteZIndex()

    this.stage.draw()
    this.selectedSpriteId = null
    this.hideMenu()
  }

  onResize() {
    this.stage.resize()
    this.$forceUpdate()
  }

  mounted() {
    this.initStage()
    window.addEventListener('resize', this.onResize)
  }

  destroyed(){
    window.removeEventListener('resize', this.onResize)
  }

  render(h) {
    const { menu } = this.$slots
    const { x, y } = this.menuPosition || { x: -1000, y: -1000 }
    return (
      <div ref="stage" class="sprite-stage">
        <canvas></canvas>
        <div class="sprite-operation-container" style={this.calculateSelectionBoxStyle()}>
          <span class="zoom-item top-left" data-orientation="topLeft"></span>
          <span class="sprite-edit">
            <svg viewBox="64 64 896 896" data-icon="ellipsis" 
              width="16px" height="16px"
              style="color: white;transform:translate(1px, 8px) rotate(90deg);"
              fill="currentColor" aria-hidden="true" focusable="false" class="">
              <path d="M176 511a56 56 0 1 0 112 0 56 56 0 1 0-112 0zm280 0a56 56 0 1 0 112 0 56 56 0 1 0-112 0zm280 0a56 56 0 1 0 112 0 56 56 0 1 0-112 0z"></path>
            </svg>
          </span>
          <span class="zoom-item bottom-left" data-orientation="bottomLeft"></span>
          <span class="zoom-item bottom-right" data-orientation="bottomRight"></span>
        </div>
        <div class="sprite-edit-menu" style={{ left: `${x}px`, top: `${y}px` }} onMousedown={event => event.stopPropagation()}>
          { menu }
        </div>
      </div>
    )
  }
}