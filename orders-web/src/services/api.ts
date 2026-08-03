import axios, { AxiosError } from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'
import { storage } from '../utils/storage'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

let isRefreshing = false
const refreshSubscribers: ((token: string) => void)[] = []

const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback)
}

const notifyTokenRefresh = (token: string) => {
  refreshSubscribers.forEach(callback => callback(token))
  refreshSubscribers.length = 0
}

const clearAuth = () => {
  storage.removeToken()
  storage.removeUser()
  window.dispatchEvent(new Event('auth-logout'))
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

    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/login') {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`
            }
            resolve(api(originalRequest))
          })
        })
      }

      isRefreshing = true
      originalRequest._retry = true

      try {
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {}, {
          headers: {
            Authorization: `Bearer ${storage.getToken()}`,
          },
        })

        const newToken = data.token
        storage.setToken(newToken)

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
        }
        notifyTokenRefresh(newToken)
        isRefreshing = false

        return api(originalRequest)
      } catch {
        clearAuth()
        isRefreshing = false
        return Promise.reject(error)
      }
    }

    if (error.response?.status === 403) {
      clearAuth()
    }

    return Promise.reject(error)
  }
)
