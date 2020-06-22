import { SpriteClass } from './Sprite'
import StickyNoteSprite from './Sprite/StickyNoteSprite'
import CardSprite from './Sprite/CardSprite'

const spriteMap: { [key: string]: SpriteClass} = {}

export const registerSprite = (type, spriteClass) => {
  spriteMap[type] = spriteClass
}

export const getSpriteResiters = () => spriteMap


registerSprite(StickyNoteSprite.type, StickyNoteSprite)
registerSprite(CardSprite.type, CardSprite)