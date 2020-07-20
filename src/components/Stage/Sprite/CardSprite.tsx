import Sprite, { SpriteBox } from './index';
import { calculateTextRows } from './text'
import { CardType, CardColors, isDataCard, isValueCard, isSceneCard } from '../../../common/Card'
import DataSvg from '../../../assets/images/icons/data.svg'
import ToolSvg from '../../../assets/images/icons/tool.svg'

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
  relatedValueCards?: Array<string>
  weight?: number
  score?: number

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
    cardProps.relatedValueCards = props.relatedValueCards
    cardProps.weight = props.weight
    cardProps.score = props.score
    return cardProps
  }
}

export default class CardSprite extends Sprite<CardProps>{
  static type: string = 'card'
  dataIcon: HTMLImageElement
  toolIcon: HTMLImageElement

  constructor(props: CardProps) {
    super(props)
    this.id = props.id!
    this.props = props
    this.dataIcon = new Image()
    this.dataIcon.src = DataSvg
    this.toolIcon = new Image()
    this.toolIcon.src = ToolSvg
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
    const { width, height, card, content, owner, weight, rate, score, relatedDataCards, relatedToolCards } = this.props
    const cardType = card?.type || CardColors[CardType.VISION]
    const cardColor = CardColors[cardType] ? CardColors[cardType] : CardColors[cardType]
    const padding = 48
    const maxWidth = width - padding * 2
    const fontSize = 48
    const ownerFontSize = 24
    const numberFontSize = 36

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
      this.drawRoundRect(300, 30, 174, 60, '#30c49e')
      this.drawStarGroup(rate)
    } else if(isValueCard(cardType) && weight) {
      this.drawContent(width, height, fontSize, 140, contentRows, -10)

      const weightRows = calculateTextRows(context, maxWidth, weight+' %', numberFontSize)
      this.drawRoundRect(364, 26, 110, 60, '#c9b535')
      context.fillStyle = '#ffffff'
      context.font = `bold ${numberFontSize}px Montserrat, sans-serif`
      this.drawContent(width*2-100, height, numberFontSize, 700, weightRows)
    } else if(isSceneCard(cardType)) {
      this.drawContent(width, height, fontSize, 110, contentRows, -10)
      
      this.drawStar(width/2, 0, cardColor, '#f2a47c', 12, 40, 50, 10)
      const scoreRows = calculateTextRows(context, maxWidth, score, ownerFontSize)
      context.fillStyle = '#ffffff'
      context.font = `normal ${numberFontSize}px Montserrat, sans-serif`
      this.drawContent(width, height, fontSize, height-14, scoreRows)
      
      this.drawRoundRect(364, 26, 110, 60, '#d4764f')
      this.drawSvg(426, 40, this.dataIcon)
      const dataRows = calculateTextRows(context, maxWidth, relatedDataCards?.length, ownerFontSize)
      context.fillStyle = '#ffffff'
      this.drawContent(width*2-160, height, numberFontSize, height-66, dataRows)
      this.drawRoundRect(364, 106, 110, 60, '#d4764f')
      this.drawSvg(426, 120, this.toolIcon)
      const toolRows = calculateTextRows(context, maxWidth, relatedToolCards?.length, ownerFontSize)
      context.fillStyle = '#ffffff'
      this.drawContent(width*2-160, height, numberFontSize, height-146, toolRows)
    } else {
      this.drawContent(width, height, fontSize, 110, contentRows, -10)
    }

    context.restore()
  }

  drawSvg(cx, cy, image) {
    const context = this.stage!.context!
    context.drawImage(image, cx, cy, 30, 30);
  }

  drawStarGroup(rate) {
    const xAxisList = [330, 360, 390, 420, 450]
    for (let index in xAxisList) {
      let color = index < rate ? '#ffffff' : '#a2dfc6'
      this.drawStar(xAxisList[index], 60, color, color, 5, 6, 12)
    }
  }

  drawStar(cx, cy, color, strokeColor, spikes, innerRadius, outerRadius, lineWidth=0){
    const context = this.stage!.context!
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
    context.strokeStyle=strokeColor;
    context.lineWidth = lineWidth;
    context.stroke();
    context.fillStyle=color
    context.fill()
  }

  drawRoundRect(x, y, width, height, fill) {
    const context = this.stage!.context!
    const radius = {tl: 32, tr: 0, br: 0, bl: 32};
    context.beginPath();
    context.moveTo(x + radius.tl, y);
    context.lineTo(x + width - radius.tr, y);
    context.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    context.lineTo(x + width, y + height - radius.br);
    context.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    context.lineTo(x + radius.bl, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    context.lineTo(x, y + radius.tl);
    context.quadraticCurveTo(x, y, x + radius.tl, y);
    context.closePath();
    context.fillStyle=fill
    context.fill();
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