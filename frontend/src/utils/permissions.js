export const PERMISSIONS = {
  DASHBOARD_VIEW: 'DASHBOARD_VIEW',
  USER_VIEW: 'USER_VIEW',
  USER_CREATE: 'USER_CREATE',
  USER_UPDATE: 'USER_UPDATE',
  USER_DEACTIVATE: 'USER_DEACTIVATE',
  ROLE_VIEW: 'ROLE_VIEW',
  ROLE_MANAGE: 'ROLE_MANAGE',
  PERMISSION_VIEW: 'PERMISSION_VIEW',
}

export function hasPermission(user, permission) {
  return Boolean(user?.is_superuser || user?.permissions?.includes(permission))
}

export function hasAnyPermission(user, permissions) {
  return Boolean(user?.is_superuser || permissions.some((permission) => user?.permissions?.includes(permission)))
}
