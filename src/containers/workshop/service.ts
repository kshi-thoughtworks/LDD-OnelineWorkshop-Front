import { http } from '../../services/http'
export const loadDataPanora = (workshopId) => {
  http.get(`/workshops/${workshopId}/data-panora`, { params: { workshopId } })
}