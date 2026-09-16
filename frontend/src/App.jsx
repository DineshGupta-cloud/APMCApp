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

function Home() {
  const { theme, toggleTheme } = useTheme()

  return (
    <main className="min-h-screen overflow-hidden bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
      <nav className="border-b border-slate-200/80 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-lg font-black text-white shadow-lg shadow-emerald-600/20">A</div>
            <div><p className="font-bold tracking-tight">APMC</p><p className="text-xs text-slate-500 dark:text-slate-400">Market Management</p></div>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <button type="button" onClick={toggleTheme} className="rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800" aria-label="Toggle theme">
              {theme === 'dark' ? '☀️' : '🌙'}<span className="hidden sm:ml-2 sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>
            <Link to="/login" className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700">Sign in</Link>
          </div>
        </div>
      </nav>

      <section className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.16),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.12),transparent_30%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:py-28">
          <div>
            <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300">Agricultural Market Management Platform</div>
            <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">Manage agricultural markets with <span className="text-emerald-600 dark:text-emerald-400">clarity and control.</span></h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">A secure platform for managing markets, users, traders, farmers, commodities, auctions, transactions and operational reporting from one place.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/login" className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700">Access your account →</Link>
              <a href="#features" className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">Explore platform</a>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-4 rounded-[2rem] bg-emerald-500/10 blur-2xl" />
            <div className="relative rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800"><div><p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Operations</p><p className="mt-1 font-bold">Market Overview</p></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">Live</span></div>
              <div className="grid grid-cols-2 gap-4 py-5 sm:grid-cols-3"><div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800"><p className="text-xs text-slate-500 dark:text-slate-400">Markets</p><p className="mt-2 text-2xl font-bold">24</p></div><div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800"><p className="text-xs text-slate-500 dark:text-slate-400">Farmers</p><p className="mt-2 text-2xl font-bold">1,248</p></div><div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800"><p className="text-xs text-slate-500 dark:text-slate-400">Auctions</p><p className="mt-2 text-2xl font-bold">86</p></div></div>
              <div className="rounded-2xl bg-slate-950 p-5 text-white dark:bg-slate-800"><p className="text-sm text-slate-400">Today’s operations</p><div className="mt-4 flex items-end gap-2"><div className="h-10 w-1/6 rounded-t bg-emerald-500" /><div className="h-16 w-1/6 rounded-t bg-emerald-500" /><div className="h-12 w-1/6 rounded-t bg-emerald-500" /><div className="h-24 w-1/6 rounded-t bg-emerald-400" /><div className="h-20 w-1/6 rounded-t bg-emerald-500" /><div className="h-28 w-1/6 rounded-t bg-emerald-400" /></div></div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="border-y border-slate-200 bg-white py-20 dark:border-slate-800 dark:bg-slate-900/60">
        <div className="mx-auto max-w-7xl px-5 sm:px-8"><div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-wider text-emerald-600">Built for operations</p><h2 className="mt-2 text-3xl font-bold tracking-tight">One platform for the complete market workflow.</h2></div><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{[['01','Market Management','Manage markets, yards, branches and operational masters.'],['02','Secure Access','JWT authentication, RBAC and permission-based access control.'],['03','Trade Operations','Manage farmers, traders, agents, commodities and transactions.'],['04','Reports & Insights','Bring operational data and reporting into a single workspace.']].map(([number,title,text]) => <article key={number} className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900"><span className="text-sm font-bold text-emerald-600">{number}</span><h3 className="mt-4 font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{text}</p></article>)}</div></div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 text-center sm:px-8"><h2 className="text-3xl font-bold">Ready to manage your market?</h2><p className="mx-auto mt-3 max-w-xl text-slate-600 dark:text-slate-400">Sign in to access your authorized APMC workspace.</p><Link to="/login" className="mt-7 inline-flex rounded-xl bg-emerald-600 px-6 py-3.5 font-semibold text-white hover:bg-emerald-700">Sign in to APMC</Link></section>
      <footer className="border-t border-slate-200 px-5 py-6 text-center text-sm text-slate-500 dark:border-slate-800">© {new Date().getFullYear()} APMC Market Management. Secure agricultural market operations.</footer>
    </main>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}><Route element={<AppLayout />}><Route path="/dashboard" element={<Dashboard />} /><Route path="/users" element={<Users />} /><Route path="/roles" element={<Roles />} /><Route path="/permissions" element={<Permissions />} /></Route></Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
