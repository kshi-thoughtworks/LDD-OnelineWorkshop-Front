import Stage from '../../Stage'
export interface SpriteBox{
  x: number;
  y: number;
  width: number;
  height: number;
  scale: { x: number, y: number }
}

export interface SpriteClass{
  build: (props: SpriteBox) => Sprite<SpriteBox>
}

export default abstract class Sprite<T extends SpriteBox>{
  id!: number
  props: T
  stage?: Stage
  constructor(props: T) {
    this.props = props
  }
  updateBox(box: SpriteBox){
    const { props } = this
    const { x, y, width, height, scale } = box
    props.x = x
    props.y = y
    props.width = width
    props.height = height
    props.scale = { x: scale && scale.x ? scale.x : 1, y: scale && scale.y ? scale.y : 1 }
  }
  updateProps(props: T){
    this.props = props
  }
  setStage(stage) {
    this.stage = stage
  }
  public drawBackground(){}
  public abstract draw()
  public drawFrontend(){}
  
  static build(props: SpriteBox){}

  pointInSprite(stageOffsetX: number, stageOffsetY: number): boolean{
    const { width, height, x, y, scale: { x: scaleX, y: scaleY} } = this.props
    const left = stageOffsetX / this.stage!.ratio
    const top = stageOffsetY / this.stage!.ratio
    const realWidth = width * scaleX
    const realHeight = height * scaleY
    return left <= x + realWidth && left >= x && top >= y && top <= y + realHeight
  }
  
  /**
   * 根据象素偏移量与原始画布坐标计算出新的画布坐标
   */
  calculateSpriteBox(originBox: SpriteBox, offset: { x: number, y: number }){
    const { x, y, width, height, scale } = originBox
    const { x: offsetX, y: offsetY } = offset
    const boxX = x + offsetX / this!.stage!.ratio
    const boxY = y + offsetY / this!.stage!.ratio
    return { x: boxX, y: boxY, width, height, scale}
  }

  /**
   * 将sprite画布坐标、宽高转成象素
   */
  calcaulateSpritePixelBox(){
    const { x, y, width, height, scale: { x: scaleX, y: scaleY}  } = this.props
    const ratio = this.stage!.ratio
    const pxX = x * ratio
    const pxY = y * ratio
    const pxWidth = width * scaleX * ratio
    const pxHeight = height * scaleY * ratio
    return { x: pxX, y: pxY, width: pxWidth, height: pxHeight }
  }
}