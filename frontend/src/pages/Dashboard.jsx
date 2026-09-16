import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { hasPermission } from '../utils/permissions'

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

const DASHBOARD_CARDS = [
  { title: 'Users', description: 'Manage APMC application users and access.', permission: 'USER_VIEW' },
  { title: 'Roles', description: 'Review roles and role assignments.', permission: 'ROLE_VIEW' },
  { title: 'Permissions', description: 'Manage role permissions.', permission: 'ROLE_MANAGE' },
  { title: 'Dashboard', description: 'Access the APMC operational dashboard.', permission: 'DASHBOARD_VIEW' },
]

function FarmerDashboard({ user }) {
  const farmerName = [user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.email || 'Farmer'

  return (
    <section className="mx-auto max-w-7xl space-y-6">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-6 text-white shadow-lg sm:p-8">
        <p className="text-sm font-medium text-emerald-100">Farmer Portal</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Welcome, {farmerName}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50 sm:text-base">
          Manage your farmer profile and access APMC market services from one place.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400">Account</p>
          <p className="mt-2 font-semibold text-slate-900 dark:text-white">Active</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400">Role</p>
          <p className="mt-2 font-semibold text-slate-900 dark:text-white">Farmer</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
          <p className="mt-2 truncate font-semibold text-slate-900 dark:text-white">{user?.email}</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400">Access</p>
          <p className="mt-2 font-semibold text-emerald-600">Farmer services</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Link to="/farmers" className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900 dark:ring-slate-800">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-xl dark:bg-emerald-950">👨‍🌾</div>
          <h2 className="mt-4 font-semibold text-slate-900 dark:text-white">My Farmer Profile</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">View and manage your farmer information.</p>
          <span className="mt-4 inline-block text-sm font-semibold text-emerald-600">Open profile →</span>
        </Link>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-xl dark:bg-amber-950">🌾</div>
          <h2 className="mt-4 font-semibold text-slate-900 dark:text-white">Market Services</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">Market arrivals, commodities and auction services will appear here as those modules are enabled.</p>
          <span className="mt-4 inline-block text-sm font-semibold text-slate-400">Coming with next modules</span>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-xl dark:bg-sky-950">📋</div>
          <h2 className="mt-4 font-semibold text-slate-900 dark:text-white">My Activity</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">Your arrivals, sales, payments and other activity will be available here.</p>
          <span className="mt-4 inline-block text-sm font-semibold text-slate-400">Coming with next modules</span>
        </div>
      </div>
    </section>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const isFarmer = !user?.is_superuser && (user?.roles || []).includes('FARMER')

  const roleLabels = useMemo(() => {
    if (user?.is_superuser) return ['Super Admin']
    return (user?.roles || []).map((role) => ROLE_LABELS[role] || role)
  }, [user?.is_superuser, user?.roles])

  const cards = useMemo(
    () => DASHBOARD_CARDS.filter((card) => hasPermission(user, card.permission)),
    [user],
  )

  if (isFarmer) return <FarmerDashboard user={user} />

  return (
    <section className="mx-auto max-w-7xl">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Welcome back</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{user?.first_name || user?.email}</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {roleLabels.length ? roleLabels.map((role) => (
            <span key={role} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">{role}</span>
          )) : <span className="text-sm text-slate-500">No application role assigned</span>}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <article key={card.permission} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
            <h2 className="font-semibold text-slate-900 dark:text-white">{card.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{card.description}</p>
            <p className="mt-4 text-xs font-medium text-emerald-600">{card.permission}</p>
          </article>
        ))}
      </div>

      {!cards.length && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">Your account is authenticated, but no dashboard permission is assigned.</div>
      )}
    </section>
  )
}
