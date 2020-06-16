import Sprite from './index';
import { SpriteBox } from './index'

type StickyNoteProps = SpriteBox & {
  type: 'StickyNoteSprite',
  content: string;
  backgroundColor: string;
}

export default class StickyNoteSprite extends Sprite{
  props: StickyNoteProps
  constructor(props: StickyNoteProps) {
    const { x, y } = props
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
    const { backgroundColor, x, y, width, height } = this.props
    context.save()
    context.fillStyle = backgroundColor
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
    context.textBaseline = 'middle'
    context.textAlign = 'center'
    context.font = `bold ${fontSize}px Montserrat, sans-serif`
    if(rows.length === 1) {
      context.fillText(rows[0], width/2, height/2)
    }else {
      const rowsLength = rows.length
      const textHeight = fontSize * rowsLength
      const textTop = (height - textHeight)/2
      for(let index = 0; index < rowsLength; index++) {
        const row = rows[index]
        const isLastRow = index === rowsLength  - 1
        if(isLastRow) {
          context.textAlign = 'left'
          context.fillText(row, padding, textTop + fontSize * (index + 0.5))
        }else {
          context.fillText(row, width/2, textTop + fontSize * (index + 0.5))
        }
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
    return new StickyNoteSprite(props)
  }
}