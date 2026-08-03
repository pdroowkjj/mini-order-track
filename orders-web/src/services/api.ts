import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { storage } from '../utils/storage'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Store listeners to prevent circular callbacks during refresh.
let isRefreshing = false
const refreshSubscribers: ((token: string) => void)[] = []

const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback)
}

const notifyTokenRefresh = (token: string) => {
  refreshSubscribers.forEach(callback => callback(token))
  refreshSubscribers.length = 0
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = storage.getToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken: string) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            resolve(api(originalRequest))
          })
        })
      }

      isRefreshing = true
      originalRequest._retry = true

      try {
        const { data } = await axios.post(`${BASE_URL}/api/auth/refresh`, {}, {
          headers: {
            Authorization: `Bearer ${storage.getToken()}`,
          },
        })

        const newToken = data.token
        storage.setToken(newToken)

        originalRequest.headers.Authorization = `Bearer ${newToken}`
        notifyTokenRefresh(newToken)
        isRefreshing = false

        return api(originalRequest)
      } catch {
        storage.removeToken()
        window.location.href = '/login'
        isRefreshing = false
        return Promise.reject(error)
      }
    }

    if (error.response?.status === 403) {
      storage.removeToken()
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)
