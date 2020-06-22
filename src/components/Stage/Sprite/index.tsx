import Stage from '../../Stage'
export interface SpriteBox{
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SpriteClass{
  build: (props: SpriteBox) => Sprite<SpriteBox>
}

export default abstract class Sprite<T extends SpriteBox>{
  props: T
  stage?: Stage
  constructor(props: T) {
    this.props = props
  }
  updateBox(box: SpriteBox){
    const { props } = this
    const { x, y, width, height } = box
    props.x = x
    props.y = y
    props.width = width
    props.height = height
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
    const { width, height, x, y } = this.props
    const left = stageOffsetX / this.stage!.ratio
    const top = stageOffsetY / this.stage!.ratio
    return left <= x + width && left >= x && top >= y && top <= y + height
  }
  
  calculateSpriteBox(originBox: SpriteBox, offset: { x: number, y: number }){
    const { x, y, width, height } = originBox
    const { x: offsetX, y: offsetY } = offset
    const boxX = x + offsetX / this!.stage!.ratio
    const boxY = y + offsetY / this!.stage!.ratio
    return { x: boxX, y: boxY, width, height}
  }
}