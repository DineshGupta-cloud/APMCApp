import { NavLink } from 'react-router-dom'
import { PERMISSIONS, hasAnyPermission } from '../utils/permissions'

const items = [
  { label: 'Dashboard', to: '/dashboard', permissions: [PERMISSIONS.DASHBOARD_VIEW] },
  { label: 'Users', to: '/users', permissions: [PERMISSIONS.USER_VIEW, PERMISSIONS.USER_CREATE, PERMISSIONS.USER_UPDATE] },
  { label: 'Roles', to: '/roles', permissions: [PERMISSIONS.ROLE_VIEW, PERMISSIONS.ROLE_MANAGE] },
  { label: 'Permissions', to: '/permissions', permissions: [PERMISSIONS.PERMISSION_VIEW, PERMISSIONS.ROLE_MANAGE] },
  { label: 'Master Forms', to: '/masters', permissions: [PERMISSIONS.MARKET_MANAGE, PERMISSIONS.YARD_MANAGE, PERMISSIONS.BRANCH_MANAGE, PERMISSIONS.COMMODITY_MANAGE] },
  { label: 'Farmers', to: '/farmers', permissions: [PERMISSIONS.FARMER_VIEW, PERMISSIONS.FARMER_CREATE, PERMISSIONS.FARMER_UPDATE, PERMISSIONS.FARMER_DEACTIVATE] },
]

export default function Sidebar({ open, onClose, user }) {
  return <><div className={`fixed inset-0 z-30 bg-slate-950/50 lg:hidden ${open ? 'block' : 'hidden'}`} onClick={onClose} /><aside className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-200 bg-white transition-transform dark:border-slate-800 dark:bg-slate-900 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}><div className="flex h-16 items-center border-b border-slate-200 px-6 dark:border-slate-800"><div><p className="text-xs font-bold uppercase tracking-widest text-emerald-600">APMC</p><p className="text-sm font-semibold text-slate-900 dark:text-white">Market Management</p></div></div><nav className="space-y-1 p-4">{items.map((item) => hasAnyPermission(user, item.permissions) ? <NavLink key={item.to} to={item.to} onClick={onClose} className={({ isActive }) => `block rounded-lg px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-slate-900 text-white dark:bg-emerald-600' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'}`}>{item.label}</NavLink> : null)}</nav></aside></>
}
