import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const ThemeContext = createContext(null)

const THEMES = {
  light: { label: 'Light', icon: '☀️' },
  dark: { label: 'Dark', icon: '🌙' },
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('apmc-theme') || 'light')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('apmc-theme', theme)
  }, [theme])

  const value = useMemo(() => ({
    theme,
    themes: THEMES,
    toggleTheme: () => setTheme((current) => (current === 'light' ? 'dark' : 'light')),
  }), [theme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used inside ThemeProvider')
  return context
}
