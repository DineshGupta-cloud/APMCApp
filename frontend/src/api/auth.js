import api from './http'

export const login = (email, password) =>
  api.post('/auth/login/', { email, password })

export const refreshToken = (refresh) =>
  api.post('/auth/refresh/', { refresh })

export const logout = (refresh) =>
  api.post('/auth/logout/', { refresh })

export const getMe = () => api.get('/auth/me/')
