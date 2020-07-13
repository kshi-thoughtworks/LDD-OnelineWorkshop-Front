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
  VALUE = 'value',
  SUBJECT = 'subject',
  TECH = 'tech',
  CLASS = 'class',
  MONETIZING = 'monetizing'
}

export const CardColors: {[key in CardType]: string} = {
  [CardType.VISION]: '#7825be',
  [CardType.SCENE]: '#8a3719',
  [CardType.DATA]: '#387259',
  [CardType.VALUE]: '#a88103',
  [CardType.SUBJECT]: '#6c684b',
  [CardType.TECH]: '#6c684b',
  [CardType.CLASS]: '#6c684b',
  [CardType.MONETIZING]: '#6c684b',
}

export const isToolkitCard = (type: string): boolean => {
  return type === CardType.SUBJECT
      || type === CardType.TECH
      || type === CardType.CLASS
      || type === CardType.MONETIZING
}

export const isDataCard = (type: string):boolean =>{
  return type === CardType.DATA
}

export const isSceneCard = (type: string):boolean =>{
  return type === CardType.SCENE
}
