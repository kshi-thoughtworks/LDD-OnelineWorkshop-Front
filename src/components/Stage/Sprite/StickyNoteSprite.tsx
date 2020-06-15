import Sprite from './index';
import { SpriteBox } from './index'

type StickyNoteProps = SpriteBox & {
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

  }
}