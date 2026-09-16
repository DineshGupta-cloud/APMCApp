import api from './http'

export const listUsers = () => api.get('/auth/rbac/users/')
export const listRoles = () => api.get('/auth/rbac/roles/')
export const createUser = (payload) => api.post('/auth/rbac/users/', payload)
export const assignRole = (userId, roleId) => api.post('/auth/rbac/users/roles/assign/', { user_id: userId, role_id: roleId })
export const removeRole = (userId, roleId) => api.delete(`/auth/rbac/users/${userId}/roles/${roleId}/`)
export const activateUser = (userId) => api.patch(`/auth/rbac/users/${userId}/activate/`)
export const deactivateUser = (userId) => api.patch(`/auth/rbac/users/${userId}/deactivate/`)
