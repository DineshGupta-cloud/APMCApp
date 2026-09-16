import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { farmersApi, marketsApi } from '../api/masters'
import { hasPermission } from '../utils/permissions'

const initialForm = { farmer_code: '', first_name: '', last_name: '', mobile: '', email: '', address: '', village: '', district: '', state: '', pincode: '', land_area: '', land_area_unit: 'Acre', market: '', is_active: true }

export default function Farmers() {
  const { user } = useAuth()
  const [farmers, setFarmers] = useState([])
  const [markets, setMarkets] = useState([])
  const [search, setSearch] = useState('')
  const [form, setForm] = useState(initialForm)
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const canView = hasPermission(user, 'FARMER_VIEW')
  const canCreate = hasPermission(user, 'FARMER_CREATE')
  const canUpdate = hasPermission(user, 'FARMER_UPDATE')
  const canDeactivate = hasPermission(user, 'FARMER_DEACTIVATE')

  const load = async () => {
    setLoading(true); setError('')
    try { const [{ data }, { data: marketData }] = await Promise.all([farmersApi.list({ search, active: true }), marketsApi.list({ active: true })]); setFarmers(data); setMarkets(marketData) }
    catch (err) { setError(err.response?.data?.detail || 'Unable to load farmers.') }
    finally { setLoading(false) }
  }
  useEffect(() => { if (canView) load() }, [search, canView])

  const submit = async (event) => {
    event.preventDefault(); setError('')
    try { if (editing) await farmersApi.update(editing.id, form); else await farmersApi.create(form); setForm(initialForm); setEditing(null); load() }
    catch (err) { setError(Object.values(err.response?.data || {}).flat().join(' ') || 'Unable to save farmer.') }
  }
  const edit = (farmer) => { setEditing(farmer); setForm({ ...initialForm, ...farmer, market: farmer.market || '', land_area: farmer.land_area || '' }); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const deactivate = async (farmer) => { if (!window.confirm(`Deactivate ${farmer.full_name}?`)) return; try { await farmersApi.deactivate(farmer.id); load() } catch (err) { setError(err.response?.data?.detail || 'Unable to deactivate farmer.') } }

  if (!canView) return <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900"><h2 className="text-lg font-bold">Access denied</h2><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">You do not have permission to view farmers.</p></div>

  return <div className="space-y-6">
    <div><p className="text-sm font-semibold text-emerald-600">Master Data</p><h1 className="mt-1 text-2xl font-bold">Farmers</h1><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Register and maintain farmer records linked to APMC markets.</p></div>
    {error && <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{error}</div>}
    <div className="grid gap-6 xl:grid-cols-[1fr_430px]">
      <section className="min-w-0 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"><div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800"><div><h2 className="font-bold">Farmer Registry</h2><p className="text-xs text-slate-500">{farmers.length} active records</p></div><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search code, name, mobile, village" className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 sm:w-72 dark:border-slate-700 dark:bg-slate-950" /></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-950/60"><tr><th className="px-4 py-3">Code</th><th className="px-4 py-3">Farmer</th><th className="px-4 py-3">Mobile</th><th className="px-4 py-3">Village</th><th className="px-4 py-3">Market</th><th className="px-4 py-3">Actions</th></tr></thead><tbody className="divide-y divide-slate-100 dark:divide-slate-800">{loading ? <tr><td colSpan="6" className="px-4 py-8 text-center text-slate-500">Loading...</td></tr> : farmers.map((farmer) => <tr key={farmer.id}><td className="px-4 py-3 font-mono text-xs">{farmer.farmer_code}</td><td className="px-4 py-3 font-semibold">{farmer.full_name}</td><td className="px-4 py-3">{farmer.mobile}</td><td className="px-4 py-3">{farmer.village || '-'}</td><td className="px-4 py-3">{farmer.market_name || '-'}</td><td className="whitespace-nowrap px-4 py-3">{canUpdate && <button onClick={() => edit(farmer)} className="mr-3 font-semibold text-emerald-600">Edit</button>}{canDeactivate && <button onClick={() => deactivate(farmer)} className="font-semibold text-red-600">Deactivate</button>}</td></tr>)}</tbody></table></div></section>
      {(canCreate || (editing && canUpdate)) && <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"><div className="flex items-center justify-between"><div><h2 className="font-bold">{editing ? 'Edit Farmer' : 'Add Farmer'}</h2><p className="mt-1 text-xs text-slate-500">Required fields are marked by validation.</p></div>{editing && <button onClick={() => { setEditing(null); setForm(initialForm) }} className="text-sm font-semibold text-slate-500">Cancel</button>}</div><form onSubmit={submit} className="mt-5 grid gap-4 sm:grid-cols-2">{[['farmer_code','Farmer Code'],['first_name','First Name'],['last_name','Last Name'],['mobile','Mobile'],['email','Email'],['village','Village'],['district','District'],['state','State'],['pincode','Pincode'],['land_area','Land Area']].map(([key,label]) => <label key={key} className="block"><span className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">{label}</span><input required={['farmer_code','first_name','mobile'].includes(key)} type={key === 'land_area' ? 'number' : key === 'email' ? 'email' : 'text'} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950" /></label>)}<label className="sm:col-span-2"><span className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">Market</span><select value={form.market} onChange={(e) => setForm({ ...form, market: e.target.value })} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950"><option value="">Select market</option>{markets.map((market) => <option key={market.id} value={market.id}>{market.name}</option>)}</select></label><label className="sm:col-span-2"><span className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">Address</span><textarea rows="2" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950" /></label><label><span className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">Land Unit</span><select value={form.land_area_unit} onChange={(e) => setForm({ ...form, land_area_unit: e.target.value })} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-950"><option>Acre</option><option>Hectare</option><option>Guntha</option></select></label><button className="self-end rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700">{editing ? 'Update Farmer' : 'Save Farmer'}</button></form></section>}
    </div>
  </div>
}
