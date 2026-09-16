import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { hasPermission, PERMISSIONS } from '../utils/permissions'
import {
  activateUser,
  assignRole,
  createUser,
  deactivateUser,
  listRoles,
  listUsers,
  removeRole,
} from '../api/users'

const emptyForm = {
  email: '',
  password: '',
  first_name: '',
  last_name: '',
  is_active: true,
  roleIds: [],
}

function errorMessage(error) {
  const data = error?.response?.data
  if (!data) return error?.message || 'Request failed.'
  if (typeof data.detail === 'string') return data.detail
  return Object.entries(data)
    .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
    .join(' | ')
}

export default function Users() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [dialog, setDialog] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const canView = hasPermission(currentUser, PERMISSIONS.USER_VIEW)
  const canCreate = hasPermission(currentUser, PERMISSIONS.USER_CREATE)
  const canUpdate = hasPermission(currentUser, PERMISSIONS.USER_UPDATE)
  const canDeactivate = hasPermission(currentUser, PERMISSIONS.USER_DEACTIVATE)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const requests = [listUsers()]
      if (canCreate || canUpdate) requests.push(listRoles())
      const [usersResponse, rolesResponse] = await Promise.all(requests)
      setUsers(usersResponse.data)
      if (rolesResponse) setRoles(rolesResponse.data.filter((role) => role.is_active))
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (canView) load()
  }, [canView])

  const filteredUsers = useMemo(() => {
    const value = search.trim().toLowerCase()
    if (!value) return users
    return users.filter((item) =>
      [item.email, item.first_name, item.last_name, ...(item.roles || []).map((role) => role.role__code)]
        .join(' ')
        .toLowerCase()
        .includes(value),
    )
  }, [users, search])

  const openCreate = () => {
    setError('')
    setNotice('')
    setForm(emptyForm)
    setDialog('create')
  }

  const openEdit = (item) => {
    setError('')
    setNotice('')
    setForm({
      email: item.email,
      password: '',
      first_name: item.first_name || '',
      last_name: item.last_name || '',
      is_active: item.is_active,
      roleIds: (item.roles || []).map((role) => role.role_id),
    })
    setDialog(item)
  }

  const toggleRole = (roleId) => {
    setForm((previous) => ({
      ...previous,
      roleIds: previous.roleIds.includes(roleId)
        ? previous.roleIds.filter((id) => id !== roleId)
        : [...previous.roleIds, roleId],
    }))
  }

  const syncRoles = async (userId, previousRoles, selectedRoleIds) => {
    const currentRoleIds = previousRoles.filter((role) => role.is_active).map((role) => role.role_id)
    const toAdd = selectedRoleIds.filter((roleId) => !currentRoleIds.includes(roleId))
    const toRemove = currentRoleIds.filter((roleId) => !selectedRoleIds.includes(roleId))
    await Promise.all(toAdd.map((roleId) => assignRole(userId, roleId)))
    for (const roleId of toRemove) await removeRole(userId, roleId)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setNotice('')
    try {
      if (dialog === 'create') {
        const payload = {
          email: form.email.trim(),
          password: form.password,
          first_name: form.first_name.trim(),
          last_name: form.last_name.trim(),
          is_active: form.is_active,
        }
        const response = await createUser(payload)
        for (const roleId of form.roleIds) await assignRole(response.data.id, roleId)
        setNotice('User created successfully.')
      } else {
        if (form.roleIds.join(',') !== (dialog.roles || []).map((role) => role.role_id).sort((a, b) => a - b).join(',')) {
          await syncRoles(dialog.id, dialog.roles || [], form.roleIds)
        }
        if (form.is_active !== dialog.is_active) {
          if (form.is_active) await activateUser(dialog.id)
          else await deactivateUser(dialog.id)
        }
        setNotice('User updated successfully.')
      }
      setDialog(null)
      await load()
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  if (!canView) {
    return <section className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200"><h1 className="text-xl font-bold text-gray-900">Access denied</h1><p className="mt-2 text-sm text-gray-600">You do not have permission to view users.</p></section>
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">Administration</p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">Users Management</h1>
          <p className="mt-1 text-sm text-gray-500">Manage users, roles and account status.</p>
        </div>
        {canCreate && <button onClick={openCreate} className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800">+ Add User</button>}
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {notice && <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{notice}</div>}

      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by email, name or role..." className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-500" />
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr><th className="px-5 py-3">User</th><th className="px-5 py-3">Roles</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Action</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? <tr><td colSpan="4" className="px-5 py-10 text-center text-gray-500">Loading users...</td></tr> : filteredUsers.length === 0 ? <tr><td colSpan="4" className="px-5 py-10 text-center text-gray-500">No users found.</td></tr> : filteredUsers.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4"><div className="font-medium text-gray-900">{[item.first_name, item.last_name].filter(Boolean).join(' ') || '—'}</div><div className="text-gray-500">{item.email}</div></td>
                  <td className="px-5 py-4"><div className="flex flex-wrap gap-1.5">{item.roles?.length ? item.roles.map((role) => <span key={role.role_id} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">{role.role__code}</span>) : <span className="text-gray-400">No role</span>}</div></td>
                  <td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{item.is_active ? 'Active' : 'Inactive'}</span></td>
                  <td className="px-5 py-4 text-right">{(canUpdate || canDeactivate) && <button onClick={() => openEdit(item)} className="font-semibold text-gray-700 hover:text-gray-900">Edit</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {dialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={handleSubmit} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between"><div><h2 className="text-xl font-bold text-gray-900">{dialog === 'create' ? 'Add User' : 'Edit User'}</h2><p className="mt-1 text-sm text-gray-500">Assign roles and manage account access.</p></div><button type="button" onClick={() => setDialog(null)} className="text-2xl text-gray-400 hover:text-gray-700">×</button></div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2"><span className="mb-1 block text-sm font-medium text-gray-700">Email</span><input required type="email" value={form.email} disabled={dialog !== 'create'} onChange={(event) => setForm({ ...form, email: event.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm disabled:bg-gray-100" /></label>
              {dialog === 'create' && <label className="sm:col-span-2"><span className="mb-1 block text-sm font-medium text-gray-700">Password</span><input required minLength="8" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm" /></label>}
              <label><span className="mb-1 block text-sm font-medium text-gray-700">First name</span><input value={form.first_name} onChange={(event) => setForm({ ...form, first_name: event.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm" /></label>
              <label><span className="mb-1 block text-sm font-medium text-gray-700">Last name</span><input value={form.last_name} onChange={(event) => setForm({ ...form, last_name: event.target.value })} className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm" /></label>
            </div>
            {(canUpdate || dialog === 'create') && <div className="mt-5"><p className="mb-2 text-sm font-medium text-gray-700">Roles</p><div className="grid gap-2 sm:grid-cols-2">{roles.map((role) => <label key={role.id} className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 p-3 hover:bg-gray-50"><input type="checkbox" checked={form.roleIds.includes(role.id)} onChange={() => toggleRole(role.id)} /> <span className="text-sm text-gray-800">{role.name || role.code}</span><span className="ml-auto text-xs text-gray-400">{role.code}</span></label>)}</div></div>}
            <label className="mt-5 flex items-center gap-2"><input type="checkbox" checked={form.is_active} onChange={(event) => setForm({ ...form, is_active: event.target.checked })} disabled={!canDeactivate && dialog !== 'create'} /><span className="text-sm font-medium text-gray-700">Active</span></label>
            <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setDialog(null)} className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700">Cancel</button><button disabled={saving} className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button></div>
          </form>
        </div>
      )}
    </section>
  )
}
