import { useMemo } from 'react'
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
  {
    title: 'Users',
    description: 'Manage APMC application users and access.',
    permission: 'USER_VIEW',
  },
  {
    title: 'Roles',
    description: 'Review roles and role assignments.',
    permission: 'ROLE_VIEW',
  },
  {
    title: 'Permissions',
    description: 'Manage role permissions.',
    permission: 'ROLE_MANAGE',
  },
  {
    title: 'Dashboard',
    description: 'Access the APMC operational dashboard.',
    permission: 'DASHBOARD_VIEW',
  },
]

export default function Dashboard() {
  const { user } = useAuth()

  const roleLabels = useMemo(() => {
    if (user?.is_superuser) return ['Super Admin']
    return (user?.roles || []).map((role) => ROLE_LABELS[role] || role)
  }, [user?.is_superuser, user?.roles])

  const cards = useMemo(
    () => DASHBOARD_CARDS.filter((card) => hasPermission(user, card.permission)),
    [user],
  )

  return (
    <section className="mx-auto max-w-7xl">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <p className="text-sm font-medium text-slate-500">Welcome back</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          {user?.first_name || user?.email}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{user?.email}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {roleLabels.length ? (
            roleLabels.map((role) => (
              <span
                key={role}
                className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
              >
                {role}
              </span>
            ))
          ) : (
            <span className="text-sm text-slate-500">No application role assigned</span>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <article
            key={card.permission}
            className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
          >
            <h2 className="font-semibold text-slate-900">{card.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">{card.description}</p>
            <p className="mt-4 text-xs font-medium text-emerald-600">{card.permission}</p>
          </article>
        ))}
      </div>

      {!cards.length && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Your account is authenticated, but no dashboard permission is assigned.
        </div>
      )}
    </section>
  )
}
