import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getMe, login as loginApi, logout as logoutApi } from '../api/auth'

const AuthContext = createContext(null)
const ACCESS_KEY = 'apmc_access_token'
const REFRESH_KEY = 'apmc_refresh_token'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!localStorage.getItem(ACCESS_KEY)) {
      setLoading(false)
      return
    }
    getMe()
      .then(({ data }) => setUser(data))
      .catch(() => {
        localStorage.removeItem(ACCESS_KEY)
        localStorage.removeItem(REFRESH_KEY)
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const { data } = await loginApi(email, password)
    localStorage.setItem(ACCESS_KEY, data.access)
    localStorage.setItem(REFRESH_KEY, data.refresh)
    const me = await getMe()
    setUser(me.data)
    return me.data
  }

  const logout = async () => {
    const refresh = localStorage.getItem(REFRESH_KEY)
    try {
      if (refresh) await logoutApi(refresh)
    } finally {
      localStorage.removeItem(ACCESS_KEY)
      localStorage.removeItem(REFRESH_KEY)
      setUser(null)
    }
  }

  const value = useMemo(
    () => ({ user, loading, isAuthenticated: Boolean(user), login, logout }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
