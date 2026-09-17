import { Link, Navigate, Route, Routes } from 'react-router-dom'
import { useTheme } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './routes/ProtectedRoute'
import AppLayout from './components/AppLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Roles from './pages/Roles'
import Permissions from './pages/Permissions'
import Masters from './pages/Masters'
import Farmers from './pages/Farmers'
import MarketPrices from './pages/farmer/MarketPrices'
import MyProduce from './pages/farmer/MyProduce'

function Home() {
  const { theme, toggleTheme } = useTheme()
  const features = [['01', 'Market Management', 'Manage markets, yards, branches and operational masters.'], ['02', 'Secure Access', 'JWT authentication, RBAC and permission-based access control.'], ['03', 'Trade Operations', 'Manage farmers, traders, agents, commodities and transactions.'], ['04', 'Reports & Insights', 'Bring operational data and reporting into a single workspace.']]
  return <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white"><nav className="border-b border-slate-200 bg-white/80 dark:border-slate-800 dark:bg-slate-950/80"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8"><Link to="/" className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-lg font-black text-white">A</div><div><p className="font-bold">APMC</p><p className="text-xs text-slate-500">Market Management</p></div></Link><div className="flex gap-2"><button type="button" onClick={toggleTheme} className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700">{theme === 'dark' ? '☀️' : '🌙'}</button><Link to="/login" className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white">Sign in</Link></div></div></nav><section className="mx-auto max-w-7xl px-5 py-24 sm:px-8"><div className="max-w-3xl"><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">Agricultural Market Management Platform</span><h1 className="mt-6 text-4xl font-black tracking-tight sm:text-6xl">Manage agricultural markets with <span className="text-emerald-600">clarity and control.</span></h1><p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">A secure platform for markets, farmers, traders, auctions, transactions and reporting.</p><Link to="/login" className="mt-8 inline-flex rounded-xl bg-emerald-600 px-6 py-3.5 font-semibold text-white">Access your account →</Link></div></section><section className="border-y border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-900"><div className="mx-auto grid max-w-7xl gap-5 px-5 sm:grid-cols-2 lg:grid-cols-4 sm:px-8">{features.map(([number,title,text])=><article key={number} className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-950"><span className="text-sm font-bold text-emerald-600">{number}</span><h3 className="mt-4 font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{text}</p></article>)}</div></section></main>
}

export default function App() {
  return <AuthProvider><Routes><Route path="/" element={<Home />} /><Route path="/login" element={<Login />} /><Route element={<ProtectedRoute />}><Route element={<AppLayout />}><Route path="/dashboard" element={<Dashboard />} /><Route path="/users" element={<Users />} /><Route path="/roles" element={<Roles />} /><Route path="/permissions" element={<Permissions />} /><Route path="/masters" element={<Masters />} /><Route path="/farmers" element={<Farmers />} /><Route path="/farmer/market-prices" element={<MarketPrices />} /><Route path="/farmer/my-produce" element={<MyProduce />} /></Route></Route><Route path="*" element={<Navigate to="/" replace />} /></Routes></AuthProvider>
}
