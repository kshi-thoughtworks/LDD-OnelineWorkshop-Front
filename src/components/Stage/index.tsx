import { find, findLast, forEach, reduce } from 'lodash'
import Sprite, { SpriteClass, SpriteBox } from './Sprite'
import DragManager from './DragManager'
import { getSpriteResiters } from './SpriteRegister'
import { CardImageType } from './Sprite/CardSprite'
import VisionPng from '../../assets/images/cards/vision.png'
import ScenePng from '../../assets/images/cards/scene.png'
import DataPng from '../../assets/images/cards/data.png'
import ValuePng from '../../assets/images/cards/value.png'
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
  spriteMap: { [key: number]: Sprite<SpriteBox> }

  dragManager?: DragManager
  
  cardImages!: { [key in CardImageType]: HTMLImageElement }

  constructor(container: HTMLDivElement) {
    this.container = container
    this.zoomContainer = this.container.querySelector('.sprite-operation-container')

    this.canvas = document.createElement('canvas')
    this.context = this.canvas.getContext('2d')
    this.container.append(this.canvas)

    this.sprites = []
    this.spriteMap = {}

    this.init()
  }

  get ratio() {
    const { width }: DOMRect = this.container.getBoundingClientRect()
    return width / stageBox.width
  }

  init() {
    this.updateBoxRect()
    this.preLoadCardImages()
  }

  preLoadCardImages() {
    const visionImage = new Image()
    const sceneImage = new Image()
    const dataImage = new Image()
    const valueImage = new Image()
    visionImage.src = VisionPng
    sceneImage.src = ScenePng
    dataImage.src = DataPng
    valueImage.src = ValuePng
    this.cardImages = {
      vision: visionImage,
      scene: sceneImage,
      data: dataImage,
      value: valueImage
    }
  }

  setDragManager(dragManager: DragManager){
    this.dragManager = dragManager
    this.dragManager.setup()
    this.dragManager.addEventListener('resetselection', this.onResetSelection)
    this.dragManager.addEventListener('dragstart', this.updateSelection)
    this.dragManager.addEventListener('drag', this.updateSelection)
  }

  onResetSelection = () => {
    this.draw()
  }

  resetSelection = () => {
    this.dragManager?.resetSelection()
  }

  updateSelection = () => {
    const sprite = this.dragManager?.selectedSprite
    const style = this.zoomContainer!.style
    if(!sprite) {
      style.display = 'none'
      return
    }
    const { x, y, width, height } = sprite.calcaulateSpritePixelBox()
    style.left = `${x}px`
    style.top = `${y}px`
    style.width = `${width}px`
    style.height = `${height}px`
    style.display = 'block'
  }
  
  findSpriteByPoint(left: number, top: number) : Sprite<SpriteBox>{
    if(this.dragManager?.selectedSprite?.pointInSprite(left, top)) {
      return this.dragManager.selectedSprite
    }
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

  patchSprites(spriteProps) {
    const toMap = items => {
      return reduce(items, (accumulator, item) => {
        accumulator[item.id] = item
        return accumulator
      }, {})
    }
    const spriteMap = toMap(spriteProps)

    const latestSprites: Array<Sprite<SpriteBox>> = []
    let spritesChanged = spriteProps.length !== this.sprites.length
    forEach(spriteProps, spriteProp => {
      const { id, version } = spriteProp
      const sprite = this.spriteMap[id]
      const notExist = !sprite
      if(notExist) {
        const spriteInstance: Sprite<SpriteBox> = this.buildSprite(spriteProp)
        spriteInstance.setStage(this)
        latestSprites.push(spriteInstance)
        spritesChanged = true
      } else {
        const isSame = sprite.props.compare!<SpriteBox>(spriteProp)
        if(!isSame) {
          const dragSpriteId = this.dragManager?.selectedSprite?.id
          const isDragging = dragSpriteId === spriteProp.id
          const spriteInstance: Sprite<SpriteBox> = this.buildSprite(spriteProp)
          // 如果正在拖动，只能改变其内容，位置与scale维持当前操作状态
          if(isDragging) {
            const { x, y, width, height, scale, ...others } = spriteInstance.props
            Object.assign(sprite.props, {...others})
          } else {
            sprite.updateProps(spriteInstance.props)
          }
          spritesChanged = true
        }
        latestSprites.push(sprite)
      }
    })
    if(!spritesChanged) {
      return
    }
    this.sprites = latestSprites
    this.spriteMap = toMap(latestSprites)

    if(this.dragManager?.selectedSprite && !spriteMap[this.dragManager.selectedSprite.id]) {
      this.dragManager.resetSelection()
    }    
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
    forEach(this.sprites, (sprite: Sprite<SpriteBox>) => {
      if(sprite === this.dragManager?.selectedSprite) {
        return
      }
      sprite.draw()
    })
    this.dragManager?.selectedSprite?.draw()
    this.updateSelection()
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