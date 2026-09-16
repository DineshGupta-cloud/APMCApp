import api from './http'

export const listRoles = () => api.get('/auth/rbac/roles/')
export const createRole = (payload) => api.post('/auth/rbac/roles/', payload)
export const updateRole = (roleId, payload) => api.patch(`/auth/rbac/roles/${roleId}/`, payload)
export const listPermissions = () => api.get('/auth/rbac/permissions/')
export const listRolePermissions = (roleId) => api.get(`/auth/rbac/roles/${roleId}/permissions/`)
export const assignPermission = (roleId, permissionId) => api.post('/auth/rbac/roles/permissions/assign/', { role_id: roleId, permission_id: permissionId })
export const removePermission = (roleId, permissionId) => api.delete(`/auth/rbac/roles/${roleId}/permissions/${permissionId}/`)
