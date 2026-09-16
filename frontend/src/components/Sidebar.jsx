import { NavLink } from 'react-router-dom'
import { PERMISSIONS, hasAnyPermission } from '../utils/permissions'

const items = [
  { label: 'Dashboard', to: '/dashboard', permissions: [PERMISSIONS.DASHBOARD_VIEW] },
  { label: 'Users', to: '/users', permissions: [PERMISSIONS.USER_VIEW, PERMISSIONS.USER_CREATE, PERMISSIONS.USER_UPDATE] },
  { label: 'Roles', to: '/roles', permissions: [PERMISSIONS.ROLE_VIEW, PERMISSIONS.ROLE_MANAGE] },
  { label: 'Permissions', to: '/permissions', permissions: [PERMISSIONS.PERMISSION_VIEW, PERMISSIONS.ROLE_MANAGE] },
]

export default function Sidebar({ open, onClose, user }) {
  return (
    <>
      <div className={`fixed inset-0 z-30 bg-black/40 lg:hidden ${open ? 'block' : 'hidden'}`} onClick={onClose} />
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-gray-200 bg-white transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center border-b px-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">APMC</p>
            <p className="text-sm font-semibold text-gray-900">Market Management</p>
          </div>
        </div>
        <nav className="space-y-1 p-4">
          {items.map((item) => (
            hasAnyPermission(user, item.permissions) ? (
              <NavLink key={item.to} to={item.to} onClick={onClose} className={({ isActive }) => `block rounded-lg px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
                {item.label}
              </NavLink>
            ) : null
          ))}
        </nav>
      </aside>
    </>
  )
}
