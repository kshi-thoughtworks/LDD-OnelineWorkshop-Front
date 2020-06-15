
export interface SpriteBox{
  x: number;
  y: number;
  width: number;
  height: number;
}
export default abstract class Sprite{
  x: number
  y: number
  width: number
  height: number
  constructor(box: SpriteBox) {
    this.x = box.x
    this.y = box.y
    this.width = box.width
    this.height = box.height
  }
  public drawBackground(){}
  public abstract draw()
  public drawFrontend(){}
}