import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { branchesApi, commoditiesApi, marketsApi, yardsApi } from '../api/masters'
import { hasPermission } from '../utils/permissions'

const tabs = [
  { key: 'markets', label: 'Markets', api: marketsApi, permission: 'MARKET_MANAGE', fields: ['code', 'name', 'location', 'description'] },
  { key: 'yards', label: 'Yards', api: yardsApi, permission: 'YARD_MANAGE', fields: ['code', 'name', 'market', 'location', 'description'] },
  { key: 'branches', label: 'Branches', api: branchesApi, permission: 'BRANCH_MANAGE', fields: ['code', 'name', 'market', 'phone', 'address', 'description'] },
  { key: 'commodities', label: 'Commodities', api: commoditiesApi, permission: 'COMMODITY_MANAGE', fields: ['code', 'name', 'category', 'unit', 'description'] },
]

const labels = { code: 'Code', name: 'Name', location: 'Location', market: 'Market', phone: 'Phone', address: 'Address', category: 'Category', unit: 'Unit', description: 'Description' }

export default function Masters() {
  const { user } = useAuth()
  const [tab, setTab] = useState('markets')
  const [rows, setRows] = useState([])
  const [markets, setMarkets] = useState([])
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const activeTab = tabs.find((item) => item.key === tab)

  const load = async () => {
    setLoading(true); setError('')
    try {
      const [{ data }, marketResult] = await Promise.all([
        activeTab.api.list({ search, active: true }),
        tab === 'markets' ? Promise.resolve({ data: [] }) : marketsApi.list({ active: true }),
      ])
      setRows(data); setMarkets(marketResult.data)
    } catch (err) { setError(err.response?.data?.detail || 'Unable to load master records.') }
    finally { setLoading(false) }
  }

  useEffect(() => { if (hasPermission(user, activeTab.permission)) load() }, [tab, search])

  const emptyForm = useMemo(() => Object.fromEntries(activeTab.fields.map((field) => [field, ''])), [activeTab])
  const [form, setForm] = useState(emptyForm)
  useEffect(() => setForm(emptyForm), [emptyForm])

  const submit = async (event) => {
    event.preventDefault(); setError('')
    try {
      if (editing) await activeTab.api.update(editing.id, form)
      else await activeTab.api.create(form)
      setEditing(null); setForm(emptyForm); load()
    } catch (err) { setError(Object.values(err.response?.data || {}).flat().join(' ') || 'Unable to save record.') }
  }

  const startEdit = (row) => { setEditing(row); setForm(Object.fromEntries(activeTab.fields.map((field) => [field, row[field] ?? '']))) }
  const deactivate = async (row) => { if (!window.confirm(`Deactivate ${row.name}?`)) return; try { await activeTab.api.deactivate(row.id); load() } catch (err) { setError(err.response?.data?.detail || 'Unable to deactivate record.') } }

  if (!hasPermission(user, activeTab.permission)) return <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900"><h2 className="text-lg font-bold">Access denied</h2><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">You do not have permission to manage this master.</p></div>

  return <div className="space-y-6">
    <div><p className="text-sm font-semibold text-emerald-600">Configuration</p><h1 className="mt-1 text-2xl font-bold">Master Forms</h1><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage the reference data used by APMC operations.</p></div>
    <div className="flex gap-2 overflow-x-auto rounded-xl border border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-900">{tabs.map((item) => hasPermission(user, item.permission) && <button key={item.key} onClick={() => { setTab(item.key); setEditing(null) }} className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold ${tab === item.key ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}>{item.label}</button>)}</div>
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <section className="min-w-0 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800"><div><h2 className="font-bold">{activeTab.label}</h2><p className="text-xs text-slate-500">{rows.length} active records</p></div><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950" /></div>
        {error && <div className="m-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{error}</div>}
        <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-950/60 dark:text-slate-400"><tr><th className="px-4 py-3">Code</th><th className="px-4 py-3">Name</th>{tab !== 'markets' && tab !== 'commodities' && <th className="px-4 py-3">Market</th>}<th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th></tr></thead><tbody className="divide-y divide-slate-100 dark:divide-slate-800">{loading ? <tr><td colSpan="5" className="px-4 py-8 text-center text-slate-500">Loading...</td></tr> : rows.map((row) => <tr key={row.id}><td className="px-4 py-3 font-mono text-xs">{row.code}</td><td className="px-4 py-3 font-semibold">{row.name}</td>{tab !== 'markets' && tab !== 'commodities' && <td className="px-4 py-3">{row.market_name || '-'}</td>}<td className="px-4 py-3"><span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">Active</span></td><td className="px-4 py-3"><button onClick={() => startEdit(row)} className="mr-3 font-semibold text-emerald-600">Edit</button><button onClick={() => deactivate(row)} className="font-semibold text-red-600">Deactivate</button></td></tr>)}</tbody></table></div>
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"><div className="flex items-center justify-between"><div><h2 className="font-bold">{editing ? 'Edit' : 'Add'} {activeTab.label.slice(0, -1)}</h2><p className="mt-1 text-xs text-slate-500">Use controlled master data only.</p></div>{editing && <button onClick={() => { setEditing(null); setForm(emptyForm) }} className="text-sm font-semibold text-slate-500">Cancel</button>}</div><form onSubmit={submit} className="mt-5 space-y-4">{activeTab.fields.map((field) => <label key={field} className="block"><span className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">{labels[field]}</span>{field === 'market' ? <select required value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950"><option value="">Select market</option>{markets.map((market) => <option key={market.id} value={market.id}>{market.name}</option>)}</select> : field === 'description' || field === 'address' ? <textarea rows="3" value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950" /> : <input required={field === 'code' || field === 'name'} value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950" />}</label>)}<button className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700">{editing ? 'Update' : 'Save'} {activeTab.label.slice(0, -1)}</button></form></section>
    </div>
  </div>
}
