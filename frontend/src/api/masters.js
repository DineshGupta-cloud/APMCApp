import api from './http'

const crud = (resource) => ({
  list: (params = {}) => api.get(`/masters/${resource}/`, { params }),
  create: (payload) => api.post(`/masters/${resource}/`, payload),
  update: (id, payload) => api.patch(`/masters/${resource}/${id}/`, payload),
  deactivate: (id) => api.delete(`/masters/${resource}/${id}/`),
})

export const marketsApi = crud('markets')
export const yardsApi = crud('yards')
export const branchesApi = crud('branches')
export const commoditiesApi = crud('commodities')

export const farmersApi = {
  list: (params = {}) => api.get('/masters/farmers/', { params }),
  create: (payload) => api.post('/masters/farmers/', payload),
  update: (id, payload) => api.patch(`/masters/farmers/${id}/`, payload),
  deactivate: (id) => api.delete(`/masters/farmers/${id}/`),
}
