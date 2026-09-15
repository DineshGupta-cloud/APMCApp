import { Link } from 'react-router-dom'

function App() {
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <section className="mx-auto max-w-5xl rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">APMC App</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">Agricultural Market Management</h1>
        <p className="mt-3 max-w-2xl text-gray-600">
          React + Vite + Tailwind foundation is ready. Authentication and role-based dashboards will be added next.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-flex rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
        >
          Go to Login
        </Link>
      </section>
    </main>
  )
}

export default App
