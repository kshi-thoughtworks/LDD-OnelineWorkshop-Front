export interface Card {
  id: number
  name: string
  type: string
  sup_type: string
  description: string
  order: number
}

export enum CardType{
  VISION = 'vision',
  SCENE = 'scene',
  DATA = 'data',
  VALUE = 'value'
}

export const CardColors: {[key in CardType]: string} = {
  [CardType.VISION]: '#7825be',
  [CardType.SCENE]: '#8a3719',
  [CardType.DATA]: '#387259',
  [CardType.VALUE]: '#a88103',
}