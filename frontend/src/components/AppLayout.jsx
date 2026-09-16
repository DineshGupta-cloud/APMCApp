import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Sidebar from './Sidebar'

const ROLE_LABELS = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  APMC_ADMIN: 'APMC Admin',
  TRADER: 'Trader',
  FARMER: 'Farmer',
  COMMISSION_AGENT: 'Commission Agent',
  EMPLOYEE: 'Employee',
  VIEWER: 'Viewer',
}

function getRoleLabel(user) {
  if (user?.is_superuser) return 'Super Admin'
  if (user?.roles?.length) {
    return user.roles.map((role) => ROLE_LABELS[role] || role).join(', ')
  }
  return 'User'
}

export default function AppLayout() {
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} user={user} />
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 bg-white/95 px-4 backdrop-blur sm:px-6">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 lg:hidden"
            aria-label="Open navigation"
          >
            Menu
          </button>
          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-gray-900">Agricultural Market Management</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-gray-900">{user?.email}</p>
              <p className="text-xs text-gray-500">{getRoleLabel(user)}</p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </header>
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
