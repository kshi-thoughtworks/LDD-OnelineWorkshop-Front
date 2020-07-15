import { map } from 'lodash'
import axios, { Canceler } from 'axios'
import { http } from '../services/http'
import { isDataCard, isToolkitCard, isSceneCard, isValueCard } from '../common/Card'

const { CancelToken } = axios

export const loadWorkshop = workshopId => {
  return http.get(`/api/workbenches/${workshopId}`)
}

const getCardExternalInfo = element => {
  const { content: contentString, card } = element
  const cardType = card ? card.type : ''
  try{
    if (isDataCard(cardType)) {
      const { content, owner, rate } = JSON.parse(contentString)
      return { content, owner, rate }
    } else if (isSceneCard(cardType)) {
      const { content, description, relatedDataCards, relatedToolCards } = JSON.parse(contentString)
      return { content, description, relatedDataCards, relatedToolCards }    
    } else if (isValueCard(cardType)) {
      const { content, weight } = JSON.parse(contentString)
      return { content, weight }    
    } else {
      return { content: contentString }
    }
  }catch(error) {
    return { content: contentString }
  }
}

const normilizeCard = card => {
  const superType = card ? card.sup_type : ''
  if(isToolkitCard(superType)) {
    card.type = card.sup_type
  }
  return card
}

const elementConvert = element => {
  const { id, title, type, meta, card, version } = element
  const defaultProps = { x: 100, y: 100, width: 480, height: 480, color: '#ffe562' }
  const metaJson = meta ? JSON.parse(meta) : defaultProps
  return {
    id,
    type,
    title,
    ...metaJson,
    card: normilizeCard(card),
    version,
    ...getCardExternalInfo(element)
  }
}

export const loadElements = stepId => {
  return http.get(`/api/steps/${stepId}/elements`).then(elements => {
    return map(elements, elementConvert)
  })
}

export const cancelableLoadElements = (stepId: number): { response: Promise<any>, getCancelAction: () => Canceler} => {
  let cancelAction: Canceler
  const cancelToken = new CancelToken(canceler => cancelAction = canceler)
  const responsePromise = http.get(`/api/steps/${stepId}/elements`, { cancelToken }).then(elements => {
    return map(elements, elementConvert)
  })
  return { response: responsePromise, getCancelAction: () => cancelAction }
}

export const createStickyNote = (stepId, content, meta, ) => {
  const element = { step_id: stepId, content, meta } 
  return http.post(`/api/elements/sticker`, element)
}

export const createCard = (stepId, content, meta, card_id, title='') => {
  const element = { step_id: stepId, title, content, meta, card_id } 
  return http.post(`/api/elements/card`, element)
}

export const updateElement = (elementId, content, meta, version, title='') => {
  return http.put(`/api/elements/${elementId}`, { title, content, meta, version })
}

export const deleteElement = elementId => {
  return http.delete(`/api/elements/${elementId}`)
}

export const loadDataCardsInDataPanorama = workshopId => {
  return http.get(`/api/workbenches/${workshopId}/steps/dataPanorama/elements/types/data`)
}

export const loadCards = () => {
  return http.get('/api/cards')
}

export const createWorkshop = (name, description) => {
  return http.post('/api/workbenches', { name, description })
}

export const updateWorkshop = (workshopId, name, description) => {
  return http.put(`/api/workbenches/${workshopId}`, { name, description })
}

export const loadWorkshops = () => {
  return http.get('/api/workbenches')
}

export const loadUsers = () => {
  return http.get('/api/users')
}

export const addUsersToWorkshop = (workshopId, userIds) => {
  return http.post(`/api/workbenches/${workshopId}/users`, { user_ids: userIds })
}

export const loadWorkshopUsers = (workshopId) => {
  return http.get(`/api/workbenches/${workshopId}/users`)
}

export const removeUserFromWorkshop = (workshopId, userId) => {
  return http.delete(`/api/workbenches/${workshopId}/users/${userId}`)
}

export const loadToolCards = () => {
  return http.get('api/cards/tools')
}

export const register = (username, email, password) => {
  return http.post('/api/users/register', { username, email, password })
}

export const login = (name_or_email, password) => {
  return http.post('/api/users/login', { name_or_email, password })
}