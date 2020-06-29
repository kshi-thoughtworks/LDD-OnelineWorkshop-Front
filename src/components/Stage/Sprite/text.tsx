type Row = {
  content: string,
  width: number
}
export const calculateTextRows = (context, maxWidth, content, fontSize): Array<Row> => {
  context.save()
  context.font = `bold ${fontSize}px Montserrat, sans-serif`

  const wholeContentWidth = context.measureText(content).width
  const isMultipleRows = wholeContentWidth > maxWidth
  const rows: Array<Row> = []
  if(isMultipleRows) {
    const getFirstRow = (contentString: string): { index: number, width: number} => {
      let startIndex = 0
      let endIndex = contentString.length - 1
      let rowWidth = 0
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
          rowWidth = rowContentWidth
        }
      }
      return { index: startIndex, width: rowWidth }
    }
    
    let contentString = content
    while(contentString.length > 0) {
      const contentWidth = context.measureText(contentString).width
      if(contentWidth > maxWidth) {
        const { index: splitIndex, width } = getFirstRow(contentString)
        const rowContent = contentString.substring(0, splitIndex)
        contentString = contentString.substring(splitIndex, contentString.length)
        rows.push({ content: rowContent, width })
      } else {
        rows.push({ content: contentString, width: contentWidth })
        break
      }
    }
  } else {
    rows.push({ content, width: wholeContentWidth})
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

export const calculateTextFontRows = (
  context: CanvasRenderingContext2D, 
  width: number, 
  content: string, 
  minFontSize:number = 40, 
  maxFontSize: number = 320): {fontSize: number, rows: Array<Row>} => {
  context.save()

  let fontSize = minFontSize
  const rows = calculateTextRows(context, width, content, fontSize)
  const isSingleRow = rows.length === 1

  if(isSingleRow) {
    const { content } = rows[0]
    fontSize = calculateFontSize(context, width, content, minFontSize, maxFontSize)
  }
  context.restore()
  return { fontSize, rows}
}