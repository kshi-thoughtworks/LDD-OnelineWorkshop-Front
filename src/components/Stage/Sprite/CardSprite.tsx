import Sprite, { SpriteBox } from './index';
import { calculateTextRows } from './text'
import { CardType, CardColors, isDataCard } from '../../../common/Card'

type CardInfoType = {
  id: number
  name: string
  description: string
  owner: string
  type: CardType
}
export type SpriteCardType = 'card'

export class CardProps implements SpriteBox {
  id?: number
  x!: number
  y!: number
  width!: number
  height!: number
  scale: { x: number, y: number } = { x: 1, y: 1}

  type: SpriteCardType = 'card'
  content?: string
  card?: CardInfoType
  version?: string
  owner?: string
  rate?: number

  compare<CardProps>(props): boolean{
    const { x, y, content, color, scale, version, owner, rate } = props
    const scaleX = scale && scale.x ? scale.x : 1
    const scaleY = scale && scale.y ? scale.y : 1
    const thisScaleX = this.scale && this.scale.x ? this.scale.x : 1
    const thisScaleY = this.scale && this.scale.y ? this.scale.y : 1
    return this.x  === x 
            && this.y === y 
            && this.content === content 
            && thisScaleX === scaleX
            && thisScaleY === scaleY
            && this.version === version
            && this.owner === owner
            && this.rate === rate;
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
    cardProps.owner = props.owner
    cardProps.rate = props.rate
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

  drawContent(width, height, fontSize, bottom, rows, textOffset = 20) {
    const context = this.stage!.context!
    if(rows.length === 1) {
      context.textAlign = 'center'
      const textTop = height - bottom
      const { content } = rows[0]
      context.fillText(content, width/2, textTop)
    }else {
      const rowsLength = rows.length
      const textHeight = fontSize * rowsLength
      const textTop = height - textHeight * 2 - textOffset
      context.textAlign = 'center'
      for(let index = 0; index < rowsLength; index++) {
        const row = rows[index]
        context.fillText(row.content, width/2, textTop + fontSize * (index + 0.5))
      }
    }
  }

  drawText(){
    const context = this.stage!.context!
    const { width, height, card, content, owner } = this.props
    const cardType = card?.type || CardColors[CardType.VISION]
    const cardColor = CardColors[cardType] ? CardColors[cardType] : CardColors[cardType]
    const padding = 48
    const maxWidth = width - padding * 2
    const fontSize = 35
    const ownerFontSize = 18

    context.save()
    context.textAlign = 'left'
    context.font = `bold ${fontSize}px Montserrat, sans-serif`
    context.fillStyle = cardColor
    
    const contentRows = calculateTextRows(context, maxWidth, content, fontSize)
    if(isDataCard(cardType) && owner) {
      this.drawContent(width, height, fontSize, 140, contentRows, 40)

      context.font = `bold ${ownerFontSize}px Montserrat, sans-serif`
      const ownerRows = calculateTextRows(context, maxWidth, owner, ownerFontSize)
      this.drawContent(width, height, ownerFontSize, 100, ownerRows)
    } else {
      this.drawContent(width, height, fontSize, 110, contentRows)
    }

    context.restore()
  }

  draw(){
    const context = this.stage!.context!
    const { x, y, width, height, scale: { x: scaleX, y: scaleY } = { x: 1, y: 1 }, card } = this.props
    const cardImages = this.stage!.cardImages
    const cardType = (card && card.type) as CardType
    const cardImage = cardImages[cardType] ? cardImages[cardType] : cardImages[CardType.VISION]

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