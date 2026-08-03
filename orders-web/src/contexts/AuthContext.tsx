import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { storage } from '../utils/storage'
import { api } from '../services/api'

export interface User {
  id: string
  email: string
  name: string
}

interface LoginRequest {
  email: string
  password: string
}

interface RegisterRequest {
  name: string
  email: string
  password: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const token = storage.getToken()
    const storedUser = storage.getUser()
    return token && storedUser ? storedUser : null
  })

  useEffect(() => {
    const handleLogout = () => {
      setUser(null)
    }

    window.addEventListener('auth-logout', handleLogout)
    return () => window.removeEventListener('auth-logout', handleLogout)
  }, [])

  const login = async (credentials: LoginRequest) => {
    const response = await api.post<{ token: string; user: User }>('auth/login', credentials)
    const { token, user: userData } = response.data

    storage.setToken(token)
    storage.setUser(userData)
    setUser(userData)
  }

  const register = async (data: RegisterRequest) => {
    const response = await api.post<{ token: string; user: User }>('auth/register', data)
    const { token, user: userData } = response.data

    storage.setToken(token)
    storage.setUser(userData)
    setUser(userData)
  }

  const logout = () => {
    storage.removeToken()
    storage.removeUser()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: Boolean(user), isLoading: false, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }

  return context
}
