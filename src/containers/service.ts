import { map } from 'lodash'
import { http } from '../services/http'

export const loadWorkshop = workshopId => {
  return http.get(`/api/workbenches/${workshopId}`)
}

export const loadElements =  stepId => {
  return http.get(`/api/steps/${stepId}/elements`).then(elements => {
    return map(elements, element => {
      const { id, title, content, type, meta, card } = element
      const defaultProps = { x: 100, y: 100, width: 480, height: 480, color: '#ffe562' }
      const metaJson = meta ? JSON.parse(meta) : defaultProps
      return {
        id,
        type,
        title,
        content,
        meta: metaJson,
        card
      }
    })
  })
}

export const createStickyNote = (stepId, content, meta, ) => {
  const element = { step_id: stepId, content, meta } 
  return http.post(`/api/elements/sticker`, element)
}

export const createCard = (stepId, title, content, meta, card_id) => {
  const element = { step_id: stepId, title, content, meta, card_id } 
  return http.post(`/api/elements/card`, element)
}

export const updateStickyNote = (elementId, title, content, meta) => {
  return http.put(`/api/elements/${elementId}`, { title, content, meta })
}

export const updateCard = (elementId, title, content, meta, card_id) => {
  return http.put(`/api/elements/${elementId}`, title, { content, meta }, card_id)
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

export const register = (username, email, password) => {
  return http.post('/api/users/register', { username, email, password })
}

export const login = (name_or_email, password) => {
  return http.post('/api/users/login', { name_or_email, password })
}