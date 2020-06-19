import { map } from 'lodash'
import { http } from '../services/http'

export const loadWorkshop = workshopId => {
  return http.get(`/api/workbenches/${workshopId}`)
}

export const loadElements =  stepId => {
  return http.get(`/api/steps/${stepId}/elements`).then(elements => {
    return map(elements, element => {
      const { id, content, type, meta } = element
      const defaultProps = { x: 100, y: 100, width: 480, height: 480, color: '#ffe562' }
      const metaJson = meta ? JSON.parse(meta) : defaultProps
      return {
        id,
        type,
        content,
        meta: metaJson
      }
    })
  })
}

export const createElement = (stepId, content, meta) => {
  return http.post(`/api/elements`, { step_id: stepId, content, meta })
}

export const updateElement = (elementId, content, meta) => {
  return http.put(`/api/elements/${elementId}`, { content, meta })
}

export const loadCards = () => {
  return http.get('/api/cards')
}

export const createWorkshop = (name, description) => {
  return http.post('/api/workbenches', { name, description })
}

export const register = (username, email, password) => {
  return http.post('/api/users/register', { username, email, password })
}

export const login = (name_or_email, password) => {
  return http.post('/api/users/login', { name_or_email, password })
}