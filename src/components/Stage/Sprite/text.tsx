export const calculateTextRows = (context, maxWidth, content, fontSize): Array<string> => {
  context.save()
  context.font = `bold ${fontSize}px Montserrat, sans-serif`
  const isMultipleRows = context.measureText(content).width > maxWidth
  const rows: Array<string> = []
  if(isMultipleRows) {
    const getFirstRow = contentString => {
      let startIndex = 0
      let endIndex = contentString.length - 1
      while(startIndex < endIndex) {
        const middleIndex = Math.round((endIndex - startIndex)/2) + startIndex
        const rowContent = contentString.substring(0, middleIndex)
        const rowContentWidth = context.measureText(rowContent).width
        if(middleIndex >= endIndex) {
          break
        } 
        
        if(rowContentWidth > maxWidth) {
          endIndex = middleIndex
        }else {
          startIndex = middleIndex
        }
      }
      return startIndex
    }
    
    let contentString = content
    while(contentString.length > 0) {
      const contentWidth = context.measureText(contentString).width
      if(contentWidth > maxWidth) {
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
  }
  context.restore()
  return rows
}

export const calculateFontSize = (context, maxWidth, content, minFontSize, maxFontSize): number => {
  let fontSize = minFontSize
  while(fontSize < maxFontSize) {
    const size = Math.round((maxFontSize - fontSize)/2) + fontSize
    context.font = `bold ${size}px Montserrat, sans-serif`
    const contentWidth = context.measureText(content).width
    if(contentWidth > maxWidth) {
      if(size >= maxFontSize) {
        break
      }
      maxFontSize = size
    } else {
      fontSize = size
    }
  }
  return fontSize
}

export const calculateText = (context, width, height, content): {fontSize: number, rows: Array<string>} => {
  context.save()
  let minFontSize = 40
  let maxFontSize = 320

  let fontSize = minFontSize
  const rows = calculateTextRows(context, width, content, fontSize)
  const isSingleRow = rows.length === 1

  if(isSingleRow) {
    const content = rows[0]
    fontSize = calculateFontSize(context, width, content, minFontSize, maxFontSize)
  }
  context.restore()
  return { fontSize, rows}
}

export const drawText = (context: CanvasRenderingContext2D, 
  props: { content: string, width: number, height: number}
  ) => {
    context.save()
    const padding = 30
    const { content, width, height } = props
    const maxWidth = width - padding * 2
    const maxHeight = height - padding * 2
    const { fontSize, rows } = calculateText(context, maxWidth, maxHeight, content)
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