import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { listPermissions } from '../api/rbac'
import { hasPermission, PERMISSIONS } from '../utils/permissions'

function errorMessage(error) {
  const data = error?.response?.data
  if (!data) return error?.message || 'Request failed.'
  if (typeof data.detail === 'string') return data.detail
  return Object.entries(data).map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`).join(' | ')
}

export default function Permissions() {
  const { user } = useAuth()
  const canView = hasPermission(user, PERMISSIONS.PERMISSION_VIEW)
  const [permissions, setPermissions] = useState([])
  const [search, setSearch] = useState('')
  const [moduleFilter, setModuleFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!canView) return
    let mounted = true
    setLoading(true)
    setError('')
    listPermissions()
      .then((response) => { if (mounted) setPermissions(Array.isArray(response.data) ? response.data : []) })
      .catch((err) => { if (mounted) setError(errorMessage(err)) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [canView])

  const modules = useMemo(() => [...new Set(permissions.filter((item) => item.is_active).map((item) => item.module))].sort(), [permissions])
  const filteredPermissions = useMemo(() => {
    const query = search.trim().toLowerCase()
    return permissions.filter((permission) => {
      if (!permission.is_active) return false
      if (moduleFilter !== 'ALL' && permission.module !== moduleFilter) return false
      if (!query) return true
      return [permission.code, permission.name, permission.description, permission.module, permission.action].join(' ').toLowerCase().includes(query)
    })
  }, [permissions, search, moduleFilter])
  const groupedPermissions = useMemo(() => filteredPermissions.reduce((groups, permission) => {
    ;(groups[permission.module] ||= []).push(permission)
    return groups
  }, {}), [filteredPermissions])

  if (!canView) return <section className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200"><h1 className="text-xl font-bold text-gray-900">Access denied</h1><p className="mt-2 text-sm text-gray-600">You do not have permission to view permissions.</p></section>

  return <section className="space-y-6">
    <div><p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">Administration</p><h1 className="mt-1 text-2xl font-bold text-gray-900">Permissions</h1><p className="mt-1 text-sm text-gray-500">View the application permissions available for role management.</p></div>
    {error && <div className="flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"><span>{error}</span><button type="button" onClick={() => window.location.reload()} className="font-semibold underline">Retry</button></div>}
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
      <div className="grid gap-3 md:grid-cols-[1fr_220px_auto] md:items-center">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search code, name, module or action..." className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-300" />
        <select value={moduleFilter} onChange={(e) => setModuleFilter(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-500">
          <option value="ALL">All modules</option>{modules.map((module) => <option key={module} value={module}>{module}</option>)}
        </select>
        <span className="text-sm text-gray-500 md:text-right">{filteredPermissions.length} permission{filteredPermissions.length === 1 ? '' : 's'}</span>
      </div>
    </div>
    <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
      {loading ? <div className="px-6 py-16 text-center text-sm text-gray-500">Loading permissions...</div> : filteredPermissions.length === 0 ? <div className="px-6 py-16 text-center"><p className="text-sm font-semibold text-gray-700">No permissions found</p><p className="mt-1 text-sm text-gray-500">Try a different search term or module.</p></div> : <div className="divide-y divide-gray-100">
        {Object.entries(groupedPermissions).map(([module, modulePermissions]) => <div key={module} className="p-5 sm:p-6">
          <div className="mb-4"><h2 className="text-sm font-bold uppercase tracking-wider text-gray-700">{module}</h2><p className="mt-1 text-xs text-gray-400">{modulePermissions.length} permission{modulePermissions.length === 1 ? '' : 's'}</p></div>
          <div className="grid gap-3 lg:grid-cols-2">{modulePermissions.map((permission) => <article key={permission.id} className="rounded-xl border border-gray-200 p-4 hover:bg-gray-50"><div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between"><div className="min-w-0"><h3 className="font-semibold text-gray-900">{permission.name}</h3><p className="mt-1 break-all font-mono text-xs text-gray-500">{permission.code}</p></div><span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold uppercase text-gray-600">{permission.action}</span></div>{permission.description && <p className="mt-3 text-sm leading-5 text-gray-500">{permission.description}</p>}</article>)}</div>
        </div>)}
      </div>}
    </div>
  </section>
}
