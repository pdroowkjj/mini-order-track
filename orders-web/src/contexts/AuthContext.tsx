import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { storage } from '../utils/storage'
import { api } from '../services/api'

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  logout: () => void
  setUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const token = storage.getToken()

      if (token) {
        try {
          const { data } = await api.get('/api/auth/me')
          setUser(data)
        } catch {
          storage.removeToken()
        }
      }

      setIsLoading(false)
    }

    initAuth()
  }, [])

  const logout = () => {
    storage.removeToken()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: Boolean(user), isLoading, logout, setUser }}>
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
