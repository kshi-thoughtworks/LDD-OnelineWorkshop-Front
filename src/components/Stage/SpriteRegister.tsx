import { SpriteClass } from './Sprite'
import StickyNoteSprite from './Sprite/StickyNoteSprite'

const spriteMap: { [key: string]: SpriteClass} = {}

export const registerSprite = (type, spriteClass) => {
  spriteMap[type] = spriteClass
}

export const getSpriteResiters = () => spriteMap


registerSprite('StickyNoteSprite', StickyNoteSprite)