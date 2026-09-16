export const PERMISSIONS = {
  DASHBOARD_VIEW: 'DASHBOARD_VIEW',
  USER_VIEW: 'USER_VIEW',
  USER_CREATE: 'USER_CREATE',
  USER_UPDATE: 'USER_UPDATE',
  USER_DEACTIVATE: 'USER_DEACTIVATE',
  ROLE_VIEW: 'ROLE_VIEW',
  ROLE_MANAGE: 'ROLE_MANAGE',
  PERMISSION_VIEW: 'PERMISSION_VIEW',
  MARKET_MANAGE: 'MARKET_MANAGE',
  YARD_MANAGE: 'YARD_MANAGE',
  BRANCH_MANAGE: 'BRANCH_MANAGE',
  COMMODITY_MANAGE: 'COMMODITY_MANAGE',
  FARMER_VIEW: 'FARMER_VIEW',
  FARMER_CREATE: 'FARMER_CREATE',
  FARMER_UPDATE: 'FARMER_UPDATE',
  FARMER_DEACTIVATE: 'FARMER_DEACTIVATE',
}

export function hasPermission(user, permission) {
  return Boolean(user?.is_superuser || user?.permissions?.includes(permission))
}

export function hasAnyPermission(user, permissions) {
  return Boolean(user?.is_superuser || permissions.some((permission) => user?.permissions?.includes(permission)))
}
