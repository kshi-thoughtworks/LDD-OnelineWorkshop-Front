import Sprite, { SpriteBox } from './index';

const stickyNoteType = 'sticky'
export type StickyNoteType = 'sticky'
export class StickyNoteProps {
  type: string = stickyNoteType
  id?: number
  x!: number
  y!: number
  width!: number
  height!: number
  content!: string
  color!: string
  scale?: { x: number, y: number } = { x: 1, y: 1}

  compare(props: StickyNoteProps): boolean{
    const { x, y, content, color, scale } = props
    const scaleX = scale && scale.x ? scale.x : 1
    const scaleY = scale && scale.y ? scale.y : 1
    const thisScaleX = this.scale && this.scale.x ? this.scale.x : 1
    const thisScaleY = this.scale && this.scale.y ? this.scale.y : 1
    return this.x  === x 
            && this.y === y 
            && this.content === content 
            && this.color === color
            && thisScaleX === scaleX
            && thisScaleY === scaleY;
  }

  toSpriteBox(): SpriteBox{
    return { x: this.x, y: this.y, width: this.width, height: this.height}
  }

  updateSpriteBox(box: SpriteBox){
    this.x = box.x
    this.y = box.y
    this.width = box.width
    this.height = box.height
  }

  static build(props: StickyNoteProps): StickyNoteProps {
    const stickyNoteProps = new StickyNoteProps()
    stickyNoteProps.type = stickyNoteType
    stickyNoteProps.id = props.id
    stickyNoteProps.x = props.x
    stickyNoteProps.y = props.y
    stickyNoteProps.width = props.width
    stickyNoteProps.height = props.height
    stickyNoteProps.content = props.content
    stickyNoteProps.color = props.color
    return stickyNoteProps
  }
}

export default class StickyNoteSprite extends Sprite<StickyNoteProps>{
  static type: string = 'sticky'
  constructor(props: StickyNoteProps) {
    super(props)
    this.props = props
  }
  calculateText(width, height, content): {fontSize: number, rows: Array<string>} {
    const context = this.stage!.context!
    context.save()
    let minFontSize = 40
    let maxFontSize = 320

    let fontSize = minFontSize
    context.font = `bold ${fontSize}px Montserrat, sans-serif`
    const isMultipleRows = context.measureText(content).width > width
    const rows: Array<string> = []
    if(isMultipleRows){
      const getFirstRow = contentString => {
        let startIndex = 0
        let endIndex = contentString.length - 1
        let middleIndex = 0
        while(startIndex < endIndex) {
          middleIndex = Math.round((endIndex - startIndex)/2) + startIndex
          const rowContent = content.substring(0, middleIndex)
          if(context.measureText(rowContent).width > width) {
            if(middleIndex >= endIndex) {
              break
            }
            endIndex = middleIndex
          }else {
            startIndex = middleIndex
          }
        }
        return middleIndex
      }
      
      let contentString = content
      while(contentString.length > 0) {
        if(context.measureText(contentString).width > width) {
          const splitIndex = getFirstRow(contentString)
          const rowContent = contentString.substring(0, splitIndex)
          contentString = contentString.substring(splitIndex, contentString.length)
          rows.push(rowContent)
        } else {
          rows.push(contentString)
          break
        }
      }
    } else {
      rows.push(content)
      while(fontSize < maxFontSize) {
        const size = Math.round((maxFontSize - fontSize)/2) + fontSize
        context.font = `bold ${size}px Montserrat, sans-serif`
        if(context.measureText(content).width > width) {
          if(size >= maxFontSize) {
            break
          }
          maxFontSize = size
        } else {
          fontSize = size
        }
      }
    }
    context.restore()
    return { fontSize, rows}
  }
  drawBackground(){
    const context = this.stage!.context!
    const { color, x, y, width, height } = this.props
    context.save()

    context.shadowBlur = 4
    context.shadowColor = 'rgba(0, 0, 0, 0.6)'
    context.fillStyle = color
    context.fillRect(0, 0, width, height)
    
    context.restore()
  }
  drawText() {
    const context = this.stage!.context!
    context.save()
    const padding = 30
    const { content, width, height } = this.props
    const maxWidth = width - padding * 2
    const maxHeight = height - padding * 2
    const { fontSize, rows } = this.calculateText(maxWidth, maxHeight, content)
    context.textAlign = 'center'
    context.font = `bold ${fontSize}px Montserrat, sans-serif`
    if(rows.length === 1) {
      context.textBaseline = 'middle'
      context.fillText(rows[0], width/2, height/2)
    }else {
      const rowsLength = rows.length
      const textHeight = fontSize * rowsLength
      const textTop = (height - textHeight)/2
      context.textAlign = 'left'
      for(let index = 0; index < rowsLength; index++) {
        const row = rows[index]
        context.fillText(row, padding, textTop + fontSize * (index + 0.5))
      }
    }
    
    context.restore()
  }
  draw() {
    const context = this.stage!.context!
    const { x, y } = this.props
    context.save()
    context.translate(x, y)

    this.drawBackground()
    this.drawText()

    context.restore()
  }
  static build(props: StickyNoteProps) {
    const stickyNoteProps = StickyNoteProps.build(props)
    return new StickyNoteSprite(stickyNoteProps)
  }
}