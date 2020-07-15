import Sprite, { SpriteBox } from './index';
import { calculateTextRows } from './text'
import { CardType, CardColors, isDataCard, isValueCard } from '../../../common/Card'

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
  description?: string
  relatedDataCards?: Array<string>
  relatedToolCards?: Array<string>
  weight?: number

  compare<CardProps>(props): boolean{
    const { x, y, content, color, scale, version, owner, rate, weight } = props
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
            && this.rate === rate
            && this.weight === weight;
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
    cardProps.description = props.description
    cardProps.relatedDataCards = props.relatedDataCards
    cardProps.relatedToolCards = props.relatedToolCards
    cardProps.weight = props.weight
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
    const { width, height, card, content, owner, weight, rate } = this.props
    const cardType = card?.type || CardColors[CardType.VISION]
    const cardColor = CardColors[cardType] ? CardColors[cardType] : CardColors[cardType]
    const padding = 48
    const maxWidth = width - padding * 2
    const fontSize = 48
    const ownerFontSize = 24

    context.save()
    context.textAlign = 'left'
    context.font = `bold ${fontSize}px Montserrat, sans-serif`
    context.fillStyle = cardColor
    
    const contentRows = calculateTextRows(context, maxWidth, content, fontSize)
    if(isDataCard(cardType) && owner) {
      this.drawContent(width, height, fontSize, 140, contentRows, 25)

      context.font = `bold ${ownerFontSize}px Montserrat, sans-serif`
      const ownerRows = calculateTextRows(context, maxWidth, owner, ownerFontSize)
      this.drawContent(width, height, ownerFontSize, 100, ownerRows)
      this.drawStarGroup(rate)
    } else if(isValueCard(cardType) && weight) {
      this.drawContent(width, height, fontSize, 140, contentRows, -10)

      context.font = `bold ${ownerFontSize}px Montserrat, sans-serif`
      const ownerRows = calculateTextRows(context, maxWidth, weight+' %', ownerFontSize)
      this.drawContent(width*2-100, height, ownerFontSize, 700, ownerRows)
    } else {
      this.drawContent(width, height, fontSize, 110, contentRows, -10)
    }

    context.restore()
  }

  drawStarGroup(rate) {
    const xAxisList = [330, 360, 390, 420, 450]
    for (let index in xAxisList) {
      let color = index < rate ? '#ffffff' : '#a2dfc6'
      this.drawStar(xAxisList[index], 60, color)
    }
  }

  drawStar(cx, cy, color){
    const context = this.stage!.context!
    const spikes = 5
    const outerRadius = 8
    const innerRadius = 4
    var rot=Math.PI/2*3
    var x=cx
    var y=cy
    var step=Math.PI/spikes

    context.beginPath()
    context.moveTo(cx,cy-outerRadius)
    for(let i=0;i<spikes;i++){
      x=cx+Math.cos(rot)*outerRadius
      y=cy+Math.sin(rot)*outerRadius
      context.lineTo(x,y)
      rot+=step

      x=cx+Math.cos(rot)*innerRadius
      y=cy+Math.sin(rot)*innerRadius
      context.lineTo(x,y)
      rot+=step
    }
    context.lineTo(cx,cy-outerRadius)
    context.closePath()
    context.lineWidth=5
    context.strokeStyle=color
    context.stroke()
    context.fillStyle=color
    context.fill()
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