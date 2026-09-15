import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">Dashboard</p>
            <h1 className="mt-2 text-2xl font-bold">Welcome, {user?.email}</h1>
          </div>
          <button onClick={logout} className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-gray-50">Logout</button>
        </div>
        <p className="mt-6 text-gray-600">JWT authentication and protected routing are working.</p>
      </div>
    </main>
  )
}
