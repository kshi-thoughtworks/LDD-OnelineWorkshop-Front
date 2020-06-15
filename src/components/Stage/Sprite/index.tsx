import Stage from '../../Stage'
export interface SpriteBox{
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SpriteClass{
  build: (props: SpriteBox) => Sprite
}

export default abstract class Sprite{
  x: number
  y: number
  width: number
  height: number
  stage?: Stage
  constructor(box: SpriteBox) {
    this.x = box.x
    this.y = box.y
    this.width = box.width
    this.height = box.height
  }
  setStage(stage) {
    this.stage = stage
  }
  public drawBackground(){}
  public abstract draw()
  public drawFrontend(){}
  
  static build(props: SpriteBox){}
}