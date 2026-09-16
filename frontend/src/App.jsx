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

function Home() {
  const { theme, toggleTheme } = useTheme()
  return (
    <main className="min-h-screen overflow-hidden bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
      <nav className="border-b border-slate-200/80 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8"><Link to="/" className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-lg font-black text-white shadow-lg shadow-emerald-600/20">A</div><div><p className="font-bold tracking-tight">APMC</p><p className="text-xs text-slate-500 dark:text-slate-400">Market Management</p></div></Link><div className="flex items-center gap-2 sm:gap-4"><button type="button" onClick={toggleTheme} className="rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">{theme === 'dark' ? '☀️' : '🌙'}<span className="hidden sm:ml-2 sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span></button><Link to="/login" className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700">Sign in</Link></div></div></nav>
      <section className="relative"><div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.16),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.12),transparent_30%)]" /><div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32"><div className="max-w-3xl"><div className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300">Agricultural Market Management Platform</div><h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">Manage agricultural markets with <span className="text-emerald-600 dark:text-emerald-400">clarity and control.</span></h1><p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">Manage master data, farmers, traders, commodities, auctions, transactions and reporting from one secure workspace.</p><Link to="/login" className="mt-8 inline-flex rounded-xl bg-emerald-600 px-6 py-3.5 font-semibold text-white shadow-lg hover:bg-emerald-700">Access your account →</Link></div></div></section>
      <section className="border-y border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-900/60"><div className="mx-auto grid max-w-7xl gap-5 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">{[['01','Master Forms','Markets, yards, branches and commodities'],['02','Farmer Registry','Maintain farmer records and market mapping'],['03','Secure Access','JWT authentication and RBAC permissions'],['04','Operations','A foundation for auctions, sales and reports']].map(([n,t,d]) => <article key={n} className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900"><span className="text-sm font-bold text-emerald-600">{n}</span><h3 className="mt-4 font-bold">{t}</h3><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{d}</p></article>)}</div></section>
      <footer className="border-t border-slate-200 px-5 py-6 text-center text-sm text-slate-500 dark:border-slate-800">© {new Date().getFullYear()} APMC Market Management.</footer>
    </main>
  )
}

export default function App() {
  return <AuthProvider><Routes><Route path="/" element={<Home />} /><Route path="/login" element={<Login />} /><Route element={<ProtectedRoute />}><Route element={<AppLayout />}><Route path="/dashboard" element={<Dashboard />} /><Route path="/users" element={<Users />} /><Route path="/roles" element={<Roles />} /><Route path="/permissions" element={<Permissions />} /><Route path="/masters" element={<Masters />} /><Route path="/farmers" element={<Farmers />} /></Route></Route><Route path="*" element={<Navigate to="/" replace />} /></Routes></AuthProvider>
}
