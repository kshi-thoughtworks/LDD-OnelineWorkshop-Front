import Sprite from './index';
import { SpriteBox } from './index'
import { registerSprite } from '../SpriteRegister'

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
  draw() {
    const context = this.stage!.context!
    const { content, backgroundColor, x, y, width, height } = this.props
    context.save()
    context.fillStyle = backgroundColor
    context.fillRect(x, y, width, height)
    context.restore()
  }
  static build(props: StickyNoteProps) {
    return new StickyNoteSprite(props)
  }
}