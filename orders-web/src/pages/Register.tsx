import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Label } from '../components/ui/Label'
import { AxiosError } from 'axios'

export function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('As senhas não correspondem')
      return
    }

    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres')
      return
    }

    setIsLoading(true)

    try {
      await register({ name, email, password })
      navigate('/orders')
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>
      setError(axiosError.response?.data?.message || 'Falha ao registrar')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Criar conta</h1>
          <p className="text-gray-600 text-sm">Mini Order Track</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              required
            />
          </div>

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

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11"
          >
            {isLoading ? 'Cadastrando...' : 'Cadastrar'}
          </Button>
        </form>

        <p className="mt-6 text-center text-gray-600 text-sm">
          Já tem conta?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700 transition-colors">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  )
}
