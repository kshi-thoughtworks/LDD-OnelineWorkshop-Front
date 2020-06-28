import Sprite, { SpriteBox } from './index';
import StickyNoteSprite from './StickyNoteSprite'

export enum CardImageType{
  VISION = 'vision',
  SCENE = 'scene'
}

type CardInfoType = {
  id: number
  name: string
  description: string
  type: CardImageType
}
export type CardType = 'card'

export class CardProps implements SpriteBox {
  id?: number
  x!: number
  y!: number
  width!: number
  height!: number
  scale: { x: number, y: number } = { x: 1, y: 1}

  type: CardType = 'card'
  content?: string
  card?: CardInfoType
  version?: string

  compare<CardProps>(props): boolean{
    const { x, y, content, color, scale, version } = props
    const scaleX = scale && scale.x ? scale.x : 1
    const scaleY = scale && scale.y ? scale.y : 1
    const thisScaleX = this.scale && this.scale.x ? this.scale.x : 1
    const thisScaleY = this.scale && this.scale.y ? this.scale.y : 1
    return this.x  === x 
            && this.y === y 
            && this.content === content 
            && thisScaleX === scaleX
            && thisScaleY === scaleY
            && this.version === version;
  }

  static build(props: CardProps): CardProps {
    const cardProps = new CardProps()

    cardProps.type = 'card'
    cardProps.id = props.id
    cardProps.x = props.x
    cardProps.y = props.y
    cardProps.width = props.width
    cardProps.height = props.height
    cardProps.scale = props.scale || { x: 1, y: 1 }

    cardProps.content = props.content
    cardProps.card = props.card
    cardProps.version = props.version
    return cardProps
  }
}

export default class CardSprite extends Sprite<CardProps>{
  static type: string = 'card'

  constructor(props: CardProps) {
    super(props)
    this.id = props.id!
    this.props = props
  }

  draw(){
    const context = this.stage!.context!
    const { x, y, width, height, scale: { x: scaleX, y: scaleY } = { x: 1, y: 1 } } = this.props
    const scaleWidth =  width * scaleX
    const scaleHeight = height * scaleY
    context.drawImage(this.stage!.cardImages.scene, x, y, scaleWidth, scaleHeight)
  }

  static build(props: CardProps) {
    const cardProps = CardProps.build(props)
    return new CardSprite(cardProps)
  }
}