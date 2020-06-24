import Sprite, { SpriteBox } from './index';
import StickyNoteSprite, { StickyNoteType, StickyNoteProps } from './StickyNoteSprite'

type CardInfoType = {
  id: number
  name: string
  description: string
  type: 'scene'
}

export type CardType = 'card'

export class CardProps extends StickyNoteProps {
  title?: string
  card?: CardInfoType

  static build(props: CardProps): StickyNoteProps {
    const cardProps = new CardProps()

    cardProps.type = 'card'
    cardProps.id = props.id
    cardProps.x = props.x
    cardProps.y = props.y
    cardProps.width = props.width
    cardProps.height = props.height
    cardProps.content = props.content
    cardProps.color = props.color

    cardProps.title = props.title
    cardProps.card = props.card
    return cardProps
  }
}

export default class CardSprite extends StickyNoteSprite{
  static type: string = 'card'
  static build(props: CardProps) {
    const cardProps = CardProps.build(props)
    return new CardSprite(cardProps)
  }
}