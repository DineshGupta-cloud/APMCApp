import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { hasPermission, PERMISSIONS } from '../utils/permissions'
import {
  assignPermission,
  createRole,
  listPermissions,
  listRolePermissions,
  listRoles,
  removePermission,
  updateRole,
} from '../api/rbac'

function errorMessage(error) {
  const data = error?.response?.data
  if (!data) return error?.message || 'Request failed.'
  if (typeof data.detail === 'string') return data.detail
  return Object.entries(data).map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`).join(' | ')
}

const emptyForm = { code: '', name: '', description: '', is_active: true }

export default function Roles() {
  const { user } = useAuth()
  const canView = hasPermission(user, PERMISSIONS.ROLE_VIEW)
  const canManage = hasPermission(user, PERMISSIONS.ROLE_MANAGE)
  const [roles, setRoles] = useState([])
  const [permissions, setPermissions] = useState([])
  const [selectedRoleId, setSelectedRoleId] = useState(null)
  const [rolePermissions, setRolePermissions] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [permissionsLoading, setPermissionsLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [dialog, setDialog] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const loadRoles = async () => {
    setLoading(true); setError('')
    try {
      const response = await listRoles()
      const data = response.data || []
      setRoles(data)
      setSelectedRoleId((current) => current && data.some((r) => r.id === current) ? current : data[0]?.id || null)
    } catch (err) { setError(errorMessage(err)) } finally { setLoading(false) }
  }

  const loadPermissions = async () => {
    try { setPermissions((await listPermissions()).data || []) } catch (err) { setError(errorMessage(err)) }
  }

  const loadRolePermissions = async (roleId) => {
    if (!roleId) { setRolePermissions([]); return }
    setPermissionsLoading(true); setError('')
    try { setRolePermissions((await listRolePermissions(roleId)).data || []) } catch (err) { setError(errorMessage(err)) } finally { setPermissionsLoading(false) }
  }

  useEffect(() => { if (canView) { loadRoles(); loadPermissions() } }, [canView])
  useEffect(() => { if (canView) loadRolePermissions(selectedRoleId) }, [selectedRoleId, canView])

  const filteredRoles = useMemo(() => {
    const value = search.trim().toLowerCase()
    return !value ? roles : roles.filter((role) => [role.code, role.name, role.description].join(' ').toLowerCase().includes(value))
  }, [roles, search])

  const selectedRole = roles.find((role) => role.id === selectedRoleId)
  const assignedIds = new Set(rolePermissions.filter((item) => item.is_active).map((item) => item.permission_id))
  const groupedPermissions = useMemo(() => permissions.filter((p) => p.is_active).reduce((groups, permission) => {
    ;(groups[permission.module] ||= []).push(permission)
    return groups
  }, {}), [permissions])

  const openCreate = () => { setForm(emptyForm); setDialog('create'); setError(''); setNotice('') }
  const openEdit = (role) => { setForm({ code: role.code, name: role.name, description: role.description || '', is_active: role.is_active }); setDialog(role); setError(''); setNotice('') }

  const saveRole = async (event) => {
    event.preventDefault(); setSaving(true); setError(''); setNotice('')
    try {
      if (dialog === 'create') await createRole({ ...form, code: form.code.trim().toUpperCase(), name: form.name.trim(), description: form.description.trim() })
      else await updateRole(dialog.id, { name: form.name.trim(), description: form.description.trim(), is_active: form.is_active })
      setDialog(null); setNotice(dialog === 'create' ? 'Role created successfully.' : 'Role updated successfully.'); await loadRoles()
    } catch (err) { setError(errorMessage(err)) } finally { setSaving(false) }
  }

  const togglePermission = async (permission) => {
    if (!selectedRole || !canManage) return
    setSaving(true); setError(''); setNotice('')
    try {
      if (assignedIds.has(permission.id)) {
        await removePermission(selectedRole.id, permission.id)
        setNotice('Permission removed.')
      } else {
        await assignPermission(selectedRole.id, permission.id)
        setNotice('Permission assigned.')
      }
      await loadRolePermissions(selectedRole.id)
    } catch (err) { setError(errorMessage(err)) } finally { setSaving(false) }
  }

  if (!canView) return <section className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200"><h1 className="text-xl font-bold text-gray-900">Access denied</h1><p className="mt-2 text-sm text-gray-600">You do not have permission to view roles.</p></section>

  return <section className="space-y-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div><p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">Administration</p><h1 className="mt-1 text-2xl font-bold text-gray-900">Roles Management</h1><p className="mt-1 text-sm text-gray-500">Create roles and manage their application permissions.</p></div>
      {canManage && <button onClick={openCreate} className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800">+ Add Role</button>}
    </div>
    {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
    {notice && <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{notice}</div>}

    <div className="grid gap-6 lg:grid-cols-[minmax(280px,0.8fr)_minmax(0,1.6fr)]">
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search roles..." className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-500" />
        <div className="space-y-2">
          {loading ? <p className="px-3 py-8 text-center text-sm text-gray-500">Loading roles...</p> : filteredRoles.length === 0 ? <p className="px-3 py-8 text-center text-sm text-gray-500">No roles found.</p> : filteredRoles.map((role) => <button key={role.id} onClick={() => setSelectedRoleId(role.id)} className={`w-full rounded-xl border p-4 text-left transition ${selectedRoleId === role.id ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:bg-gray-50'}`}><div className="flex items-start justify-between gap-3"><div><p className="font-semibold text-gray-900">{role.name}</p><p className="mt-0.5 text-xs font-medium text-gray-500">{role.code}</p></div><span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${role.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{role.is_active ? 'Active' : 'Inactive'}</span></div><p className="mt-2 line-clamp-2 text-xs text-gray-500">{role.description || 'No description'}</p></button>)}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
        {!selectedRole ? <div className="py-12 text-center text-sm text-gray-500">Select a role to manage permissions.</div> : <>
          <div className="flex flex-col gap-3 border-b border-gray-100 pb-5 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex items-center gap-2"><h2 className="text-lg font-bold text-gray-900">{selectedRole.name}</h2><span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">{selectedRole.code}</span></div><p className="mt-1 text-sm text-gray-500">{selectedRole.description || 'No description provided.'}</p></div>{canManage && <button onClick={() => openEdit(selectedRole)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Edit role</button>}</div>
          <div className="pt-5">{permissionsLoading ? <p className="py-10 text-center text-sm text-gray-500">Loading permissions...</p> : Object.keys(groupedPermissions).length === 0 ? <p className="py-10 text-center text-sm text-gray-500">No permissions available.</p> : <div className="space-y-5">{Object.entries(groupedPermissions).map(([module, modulePermissions]) => <div key={module}><h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">{module}</h3><div className="grid gap-2 sm:grid-cols-2">{modulePermissions.map((permission) => <label key={permission.id} className={`flex items-start gap-3 rounded-lg border p-3 ${canManage ? 'cursor-pointer hover:bg-gray-50' : 'cursor-default'} ${assignedIds.has(permission.id) ? 'border-emerald-200 bg-emerald-50/50' : 'border-gray-200'}`}><input type="checkbox" checked={assignedIds.has(permission.id)} onChange={() => togglePermission(permission)} disabled={!canManage || saving} className="mt-1" /><span className="min-w-0"><span className="block text-sm font-semibold text-gray-800">{permission.name}</span><span className="block text-xs text-gray-500">{permission.code}</span>{permission.description && <span className="mt-1 block text-xs text-gray-400">{permission.description}</span>}</span></label>)}</div></div>)}</div>}</div>
        </>}
      </div>
    </div>

    {dialog && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"><form onSubmit={saveRole} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"><div className="flex items-center justify-between"><div><h2 className="text-xl font-bold text-gray-900">{dialog === 'create' ? 'Add Role' : 'Edit Role'}</h2><p className="mt-1 text-sm text-gray-500">{dialog === 'create' ? 'Create a reusable application role.' : 'Update role details and status.'}</p></div><button type="button" onClick={() => setDialog(null)} className="text-2xl text-gray-400 hover:text-gray-700">×</button></div><div className="mt-6 space-y-4"><label><span className="mb-1 block text-sm font-medium text-gray-700">Code</span><input required pattern="[A-Za-z0-9_]+" disabled={dialog !== 'create'} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm disabled:bg-gray-100" /></label><label><span className="mb-1 block text-sm font-medium text-gray-700">Name</span><input required maxLength="100" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm" /></label><label><span className="mb-1 block text-sm font-medium text-gray-700">Description</span><textarea rows="3" maxLength="1000" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm" /></label>{dialog !== 'create' && <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /><span className="text-sm font-medium text-gray-700">Active</span></label>}</div><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setDialog(null)} className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700">Cancel</button><button disabled={saving} className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button></div></form></div>}
  </section>
}
