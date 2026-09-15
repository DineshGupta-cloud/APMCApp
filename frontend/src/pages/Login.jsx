import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email, password)
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true })
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Check your credentials.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">APMC Login</h1>
        <p className="mt-2 text-sm text-gray-500">Sign in to continue.</p>
        {error && <div className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        <label className="mt-6 block text-sm font-medium">Email</label>
        <input className="mt-2 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-gray-300" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label className="mt-4 block text-sm font-medium">Password</label>
        <input className="mt-2 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-gray-300" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button disabled={submitting} className="mt-6 w-full rounded-lg bg-gray-900 px-4 py-3 font-semibold text-white disabled:opacity-50">
          {submitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </main>
  )
}
