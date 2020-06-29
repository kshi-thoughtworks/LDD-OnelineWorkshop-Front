import Sprite, { SpriteBox } from './index';
import { calculateTextRows } from './text'

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

  drawText(){
    const context = this.stage!.context!
    const { width, height, content } = this.props
    const padding = 48
    const maxWidth = width - padding * 2
    const fontSize = 35

    context.save()
    context.textAlign = 'left'
    context.font = `bold ${fontSize}px Montserrat, sans-serif`
    context.fillStyle='#7825be'
    const rows = calculateTextRows(context, maxWidth, content, fontSize)
    if(rows.length === 1) {
      context.textAlign = 'center'
      const textTop = height - 110
      const { content } = rows[0]
      context.fillText(content, width/2, textTop)
    }else {
      const rowsLength = rows.length
      const textHeight = fontSize * rowsLength
      const textTop = height - textHeight * 2 - 20
      context.textAlign = 'center'
      for(let index = 0; index < rowsLength; index++) {
        const row = rows[index]
        context.fillText(row.content, width/2, textTop + fontSize * (index + 0.5))
      }
    }
    context.restore()
  }

  draw(){
    const context = this.stage!.context!
    const { x, y, width, height, scale: { x: scaleX, y: scaleY } = { x: 1, y: 1 }, card } = this.props
    const cardImages = this.stage!.cardImages
    const cardImageType = (card && card.type) as CardImageType
    const cardImage = cardImages[cardImageType] ? cardImages[cardImageType] : cardImages[CardImageType.VISION]

    context.save()
    context.translate(x, y)
    context.scale(scaleX, scaleY)

    context.drawImage(cardImage, 0, 0, width, height)

    this.drawText()
    context.restore()
  }

  static build(props: CardProps) {
    const cardProps = CardProps.build(props)
    return new CardSprite(cardProps)
  }
}