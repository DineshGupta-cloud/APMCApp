import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
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
  if (user?.roles?.length) return user.roles.map((role) => ROLE_LABELS[role] || role).join(', ')
  return 'User'
}

export default function AppLayout() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} user={user} />
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 sm:px-6">
          <button type="button" onClick={() => setSidebarOpen(true)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 lg:hidden">Menu</button>
          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Agricultural Market Management</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
              {theme === 'light' ? '🌙' : '☀️'} <span className="hidden sm:inline">{theme === 'light' ? 'Dark' : 'Light'}</span>
            </button>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.email}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{getRoleLabel(user)}</p>
            </div>
            <button type="button" onClick={logout} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">Logout</button>
          </div>
        </header>
        <main className="p-4 sm:p-6"><Outlet /></main>
      </div>
    </div>
  )
}
