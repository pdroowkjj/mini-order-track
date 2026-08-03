import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useOrders } from '../hooks/useOrders'
import { LogOut, Search, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { CreateOrderForm } from '../components/CreateOrderForm'
import { OrderCard } from '../components/OrderCard'

export function Orders() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { orders, selectedOrder, isLoading, error, fetchOrders, searchOrderById, createOrder, updateOrderStatus, clearSearch } = useOrders()
  const [searchId, setSearchId] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (searchId.trim()) {
      await searchOrderById(searchId)
    }
  }

  const handleClearSearch = () => {
    setSearchId('')
    clearSearch()
  }

  const handleCreateOrder = async (data: any) => {
    await createOrder(data)
    setShowForm(false)
    await fetchOrders()
  }

  const handleStatusChange = async (orderId: string, status: string) => {
    setUpdatingId(orderId)
    try {
      await updateOrderStatus(orderId, status)
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Mini Order Track</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700 text-sm font-medium">{user?.name}</span>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <LogOut size={16} />
              Sair
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-8">
          {/* Formulário de Criação */}
          {showForm ? (
            <CreateOrderForm onSubmit={handleCreateOrder} isLoading={isLoading} />
          ) : (
            <Button onClick={() => setShowForm(true)} className="w-full h-11">
              Criar Novo Pedido
            </Button>
          )}

          {/* Busca */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Buscar por ID do pedido..."
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={isLoading} className="flex items-center gap-2">
              <Search size={18} />
              Buscar
            </Button>
            {(searchId || selectedOrder) && (
              <Button
                type="button"
                variant="outline"
                onClick={handleClearSearch}
                className="flex items-center gap-2"
              >
                <X size={18} />
                Limpar
              </Button>
            )}
          </form>

          {/* Erro */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Pedido Selecionado */}
          {selectedOrder && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Detalhes do Pedido</h2>
              <OrderCard
                order={selectedOrder}
                onStatusChange={(status) => handleStatusChange(selectedOrder.id, status)}
                isUpdating={updatingId === selectedOrder.id}
              />
            </div>
          )}

          {/* Lista de Pedidos */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Pedidos {isLoading ? '(carregando...)' : `(${orders.length})`}
            </h2>
            {orders.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                <p className="text-gray-600">Nenhum pedido cadastrado ainda.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {orders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onStatusChange={(status) => handleStatusChange(order.id, status)}
                    isUpdating={updatingId === order.id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
