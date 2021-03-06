import { find, findLast, forEach, orderBy, reduce } from 'lodash'
import Sprite, { SpriteClass, SpriteBox } from './Sprite'
import DragManager from './DragManager'
import { getSpriteResiters } from './SpriteRegister'
import { CardType } from '../../common/Card'
import VisionPng from '../../assets/images/cards/vision.png'
import ScenePng from '../../assets/images/cards/scene.png'
import DataPng from '../../assets/images/cards/data.png'
import ValuePng from '../../assets/images/cards/value.png'
import SubjectPng from '../../assets/images/cards/subject.png'
import TechPng from '../../assets/images/cards/tech.png'
import ClassPng from '../../assets/images/cards/class.png'
import MonetizingPng from '../../assets/images/cards/monetizing.png'
import './index.scss'

export type CanvasContext = CanvasRenderingContext2D | null
export const stageBox = {
  width: 3840,
  height: 2160
}
const stageRatio = stageBox.width/stageBox.height

const cardImagesMap: { [key in CardType]: string} = {
  [CardType.VISION]: VisionPng,
  [CardType.SCENE]: ScenePng,
  [CardType.DATA]: DataPng,
  [CardType.VALUE]: ValuePng,
  [CardType.SUBJECT]: SubjectPng,
  [CardType.TECH]: TechPng,
  [CardType.CLASS]: ClassPng,
  [CardType.MONETIZING]: MonetizingPng,
}

export default class Stage {
  container: HTMLDivElement
  zoomContainer: HTMLDivElement | null
  canvas: HTMLCanvasElement

  context: CanvasContext

  sprites: Array<Sprite<SpriteBox>>
  spriteMap: { [key: number]: Sprite<SpriteBox> }

  dragManager?: DragManager
  
  cardImages!: { [key in CardType]: HTMLImageElement }

  constructor(container: HTMLDivElement) {
    this.container = container
    this.zoomContainer = this.container.querySelector('.sprite-operation-container')

    this.canvas = this.container.querySelector('canvas') as HTMLCanvasElement
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
    this.cardImages = {} as { [key in CardType]: HTMLImageElement }
    for(let key in cardImagesMap) {
      const image = new Image()
      const url = cardImagesMap[key]
      image.src = url
      image.onload = this.draw
      this.cardImages[key] = image
    }
  }

  setDragManager(dragManager: DragManager){
    this.dragManager = dragManager
    this.dragManager.setup()
  }

  resetSelection = () => {
    this.dragManager?.resetSelection()
  }

  findSpriteByPoint(left: number, top: number) : Sprite<SpriteBox>{
    const orderSprites = this.getOrderSpritesByZIndex()
    return findLast(orderSprites, (sprite: Sprite<SpriteBox>) => sprite.pointInSprite(left, top))
  }

  findSpriteById(id): Sprite<SpriteBox>{
    return find(this.sprites, (sprite: Sprite<SpriteBox>) => sprite.id === id)
  }

  getOrderSpritesByZIndex(){
    return orderBy(this.sprites, sprite => sprite.zIndex)
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

    const latestSprites: Array<Sprite<SpriteBox>> = []
    let spritesChanged = spriteProps.length !== this.sprites.length
    forEach(spriteProps, spriteProp => {
      const { id } = spriteProp
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
          const isDragging = dragSpriteId === spriteProp.id && this.dragManager?.dragging
          const spriteInstance: Sprite<SpriteBox> = this.buildSprite(spriteProp)
          // 如果正在拖动，只能改变其内容，位置与scale维持当前操作状态
          if(isDragging) {
            const { x, y, width, height, scale, ...others } = spriteInstance.props
            Object.assign(sprite.props, { ...others })
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

  draw = () => {
    this.context!.clearRect(0, 0, stageBox.width, stageBox.height)
    const orderSprites = this.getOrderSpritesByZIndex()
    forEach(orderSprites, (sprite: Sprite<SpriteBox>) => {
      sprite.draw()
    })
  }

  resize() {
    this.updateBoxRect()
    this.draw()
  }

  destroy() {
    this.dragManager?.teardown()
  }

}