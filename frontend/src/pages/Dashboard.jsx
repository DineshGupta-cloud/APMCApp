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

  const marketPrices = [
    { crop: 'Soybean', icon: '🌱', min: '₹4,500', max: '₹5,100', current: '₹4,950', trend: '+2.4%' },
    { crop: 'Cotton', icon: '☁️', min: '₹6,800', max: '₹7,400', current: '₹7,150', trend: '+1.8%' },
    { crop: 'Wheat', icon: '🌾', min: '₹2,300', max: '₹2,650', current: '₹2,520', trend: '+0.9%' },
  ]

  const produce = [
    { crop: 'Cotton', lot: '#APMC10234', quantity: '500 kg', status: 'Awaiting Bid', bid: '₹7,120/q', tone: 'amber' },
    { crop: 'Soybean', lot: '#APMC10229', quantity: '800 kg', status: 'Sold', bid: '₹1,18,400', tone: 'emerald' },
  ]

  return (
    <section className="mx-auto max-w-7xl space-y-6">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-6 text-white shadow-lg sm:p-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-emerald-100">Farmer Portal</p>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Good morning, {farmerName} 👋</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50 sm:text-base">
              Manage your produce, market prices, bids and payments from one place.
            </p>
          </div>
          <Link to="/farmers" className="inline-flex shrink-0 items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-emerald-700 shadow-sm hover:bg-emerald-50">
            My Profile →
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['🌾', 'My Produce', '12 Lots', '+2 this month'],
          ['💰', 'Total Sales', '₹1,84,500', '+12.5%'],
          ['📦', 'In Mandi', '4 Lots', '1 sold today'],
          ['💳', 'Pending Payment', '₹32,400', '2 payments'],
        ].map(([icon, label, value, meta]) => (
          <div key={label} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
                <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
                <p className="mt-1 text-xs font-medium text-emerald-600">{meta}</p>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-lg dark:bg-slate-800">{icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 sm:p-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Today's Mandi Prices</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Indicative prices for your selected market.</p>
          </div>
          <button type="button" className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">View all prices</button>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {marketPrices.map((item) => (
            <div key={item.crop} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white"><span>{item.icon}</span>{item.crop}</span>
                <span className="text-xs font-semibold text-emerald-600">{item.trend}</span>
              </div>
              <p className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">{item.current}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Range {item.min} – {item.max} / quintal</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">My Recent Produce</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Track your latest mandi lots.</p>
            </div>
            <button type="button" className="text-sm font-semibold text-emerald-600">View all</button>
          </div>
          <div className="mt-5 space-y-3">
            {produce.map((item) => (
              <div key={item.lot} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2"><span className="font-semibold text-slate-900 dark:text-white">{item.crop}</span><span className="text-xs text-slate-400">{item.lot}</span></div>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.quantity}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.tone === 'emerald' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'}`}>{item.status}</span>
                    <p className="mt-2 text-sm font-bold text-slate-900 dark:text-white">{item.bid}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 sm:p-6">
          <div className="flex items-center justify-between">
            <div><h2 className="text-lg font-bold text-slate-900 dark:text-white">Active Bid</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Highest bid on your lot.</p></div>
            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950 dark:text-amber-300">Live</span>
          </div>
          <div className="mt-5 rounded-xl bg-slate-50 p-5 dark:bg-slate-800">
            <div className="flex items-center gap-3"><span className="text-2xl">☁️</span><div><p className="font-semibold text-slate-900 dark:text-white">Cotton</p><p className="text-xs text-slate-500 dark:text-slate-400">Lot #APMC10234 · 500 kg</p></div></div>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div><p className="text-xs text-slate-500 dark:text-slate-400">Current bid</p><p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">₹7,120/q</p></div>
              <div><p className="text-xs text-slate-500 dark:text-slate-400">Bidders</p><p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">6</p></div>
            </div>
            <p className="mt-5 text-xs font-medium text-slate-500 dark:text-slate-400">Auction closes in <span className="font-bold text-slate-900 dark:text-white">01:24:32</span></p>
          </div>
          <button type="button" className="mt-4 w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700">View Bids</button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 sm:p-6">
          <div className="flex items-center justify-between"><div><h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Transactions</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Your latest sales and payments.</p></div><button type="button" className="text-sm font-semibold text-emerald-600">View all</button></div>
          <div className="mt-5 divide-y divide-slate-100 dark:divide-slate-800">
            {[
              ['Cotton', '₹1,18,400', 'Paid', 'emerald'],
              ['Soybean', '₹66,100', 'Paid', 'emerald'],
              ['Wheat', '₹32,400', 'Pending', 'amber'],
            ].map(([name, amount, status, tone]) => (
              <div key={name} className="flex items-center justify-between py-3 first:pt-0 last:pb-0"><div className="flex items-center gap-3"><span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${tone === 'emerald' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950' : 'bg-amber-50 text-amber-600 dark:bg-amber-950'}`}>{tone === 'emerald' ? '✓' : '⏳'}</span><span className="text-sm font-medium text-slate-700 dark:text-slate-200">{name}</span></div><div className="text-right"><p className="text-sm font-bold text-slate-900 dark:text-white">{amount}</p><p className={`text-xs ${tone === 'emerald' ? 'text-emerald-600' : 'text-amber-600'}`}>{status}</p></div></div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 sm:p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Quick Actions</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Common farmer services.</p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {[
              ['➕', 'Add Produce'],
              ['📦', 'New Arrival'],
              ['💰', 'View Bids'],
              ['💳', 'Payments'],
            ].map(([icon, label]) => (
              <button key={label} type="button" className="rounded-xl border border-slate-200 p-4 text-left transition hover:border-emerald-300 hover:bg-emerald-50 dark:border-slate-800 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/30"><span className="text-xl">{icon}</span><span className="mt-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">{label}</span></button>
            ))}
          </div>
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
