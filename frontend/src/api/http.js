import axios from 'axios'

const ACCESS_KEY = 'apmc_access_token'
const REFRESH_KEY = 'apmc_refresh_token'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

let refreshPromise = null

const clearAuthTokens = () => {
  localStorage.removeItem(ACCESS_KEY)
  localStorage.removeItem(REFRESH_KEY)
}

const refreshAccessToken = async () => {
  const refresh = localStorage.getItem(REFRESH_KEY)

  if (!refresh) {
    throw new Error('Refresh token not available')
  }

  if (!refreshPromise) {
    refreshPromise = axios
      .post(
        `${api.defaults.baseURL}/auth/refresh/`,
        { refresh },
        { headers: { 'Content-Type': 'application/json' } },
      )
      .then(({ data }) => {
        localStorage.setItem(ACCESS_KEY, data.access)
        return data.access
      })
      .catch((error) => {
        clearAuthTokens()
        throw error
      })
      .finally(() => {
        refreshPromise = null
      })
  }

  return refreshPromise
}

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem(ACCESS_KEY)

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (
      error.response?.status !== 401 ||
      originalRequest?._retry ||
      originalRequest?.url?.includes('/auth/login/') ||
      originalRequest?.url?.includes('/auth/refresh/') ||
      originalRequest?.url?.includes('/auth/logout/')
    ) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      const accessToken = await refreshAccessToken()
      originalRequest.headers.Authorization = `Bearer ${accessToken}`
      return api(originalRequest)
    } catch (refreshError) {
      clearAuthTokens()
      return Promise.reject(refreshError)
    }
  },
)

export default api
