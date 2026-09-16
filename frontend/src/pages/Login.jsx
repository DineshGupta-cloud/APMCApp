import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function Login() {
  const { isAuthenticated, loading, login } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Never render the login form while an existing session is being restored.
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-emerald-600" />
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Restoring your session...</p>
        </div>
      </main>
    )
  }

  // Authenticated users can never stay on or return to the login screen.
  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email.trim(), password)
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true })
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please check your email and password.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-5 sm:px-8">
        <header className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 font-black text-white">A</div><div><p className="font-bold">APMC</p><p className="text-xs text-slate-500 dark:text-slate-400">Market Management</p></div></Link>
          <button type="button" onClick={toggleTheme} className="rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800">{theme === 'dark' ? '☀️ Light' : '🌙 Dark'}</button>
        </header>

        <div className="flex flex-1 items-center justify-center py-12">
          <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-2">
            <div className="hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between"><div><p className="text-sm font-semibold uppercase tracking-wider text-emerald-400">Secure workspace</p><h1 className="mt-5 text-4xl font-black leading-tight">Welcome back to your APMC workspace.</h1><p className="mt-5 leading-7 text-slate-400">Access the tools and information available to your role across agricultural market operations.</p></div><div className="grid grid-cols-2 gap-3"><div className="rounded-2xl border border-slate-800 bg-slate-900 p-4"><p className="text-xs text-slate-500">Access</p><p className="mt-1 font-semibold">Role based</p></div><div className="rounded-2xl border border-slate-800 bg-slate-900 p-4"><p className="text-xs text-slate-500">Security</p><p className="mt-1 font-semibold">JWT protected</p></div></div></div>

            <div className="p-7 sm:p-10"><div className="mx-auto max-w-md"><Link to="/" className="text-sm font-medium text-slate-500 hover:text-emerald-600">← Back to home</Link><h2 className="mt-8 text-3xl font-bold tracking-tight">Sign in</h2><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Enter your credentials to continue.</p>
              {error && <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">{error}</div>}
              <form onSubmit={submit} className="mt-7 space-y-5">
                <label className="block"><span className="mb-2 block text-sm font-semibold">Email address</span><input autoComplete="email" className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required /></label>
                <label className="block"><span className="mb-2 block text-sm font-semibold">Password</span><div className="relative"><input autoComplete="current-password" className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-20 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 hover:text-emerald-600">{showPassword ? 'Hide' : 'Show'}</button></div></label>
                <button type="submit" disabled={submitting} className="w-full rounded-xl bg-emerald-600 px-4 py-3.5 font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">{submitting ? 'Signing in...' : 'Sign in to APMC'}</button>
              </form>
              <p className="mt-7 text-center text-xs text-slate-400">Your access is controlled by your assigned roles and permissions.</p>
            </div></div>
          </div>
        </div>
        <footer className="py-3 text-center text-xs text-slate-500">© {new Date().getFullYear()} APMC Market Management</footer>
      </div>
    </main>
  )
}
