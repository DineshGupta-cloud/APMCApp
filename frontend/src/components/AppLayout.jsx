import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Sidebar from './Sidebar'

export default function AppLayout({ children }) {
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} user={user} />
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 bg-white/95 px-4 backdrop-blur sm:px-6">
          <button type="button" onClick={() => setSidebarOpen(true)} className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 lg:hidden" aria-label="Open navigation">
            Menu
          </button>
          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-gray-900">Agricultural Market Management</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-gray-900">{user?.email}</p>
              <p className="text-xs text-gray-500">{user?.roles?.join(', ') || 'User'}</p>
            </div>
            <button type="button" onClick={logout} className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
              Logout
            </button>
          </div>
        </header>
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  )
}
