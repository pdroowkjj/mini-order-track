import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Label } from '../components/ui/Label'
import { AxiosError } from 'axios'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login({ email, password })
      navigate('/orders')
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>
      setError(axiosError.response?.data?.message || 'Falha ao fazer login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo</h1>
          <p className="text-gray-600 text-sm">Mini Order Track</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <p className="mt-6 text-center text-gray-600 text-sm">
          Não tem conta?{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-700 transition-colors">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  )
}
