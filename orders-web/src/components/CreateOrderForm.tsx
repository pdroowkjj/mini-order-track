import { useState } from 'react'
import type { CreateOrderRequest } from '../types/order'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Label } from './ui/Label'

interface CreateOrderFormProps {
  onSubmit: (data: CreateOrderRequest) => Promise<void>
  isLoading?: boolean
}

export function CreateOrderForm({ onSubmit, isLoading }: CreateOrderFormProps) {
  const [clientName, setClientName] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [items, setItems] = useState([''])
  const [error, setError] = useState<string | null>(null)

  const handleAddItem = () => {
    setItems([...items, ''])
  }

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleItemChange = (index: number, value: string) => {
    const newItems = [...items]
    newItems[index] = value
    setItems(newItems)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!clientName.trim() || !deliveryAddress.trim()) {
      setError('Nome do cliente e endereço são obrigatórios')
      return
    }

    const validItems = items.map((item) => item.trim()).filter(Boolean)

    if (validItems.length === 0) {
      setError('Adicione pelo menos um item')
      return
    }

    try {
      await onSubmit({
        clientName,
        deliveryAddress,
        items: validItems,
      })

      setClientName('')
      setDeliveryAddress('')
      setItems([''])
    } catch (err) {
      setError('Erro ao criar pedido')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Novo Pedido</h2>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="clientName">Nome do Cliente</Label>
          <Input
            id="clientName"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="João Silva"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Endereço de Entrega</Label>
          <Input
            id="address"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            placeholder="Rua das Flores, 123"
            required
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-gray-900">Itens</h3>
          <Button
            type="button"
            onClick={handleAddItem}
            variant="outline"
            size="sm"
          >
            Adicionar Item
          </Button>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex gap-3 items-center">
              <div className="flex-1">
                <Input
                  placeholder="Ex: 1x Pizza Calabresa"
                  value={item}
                  onChange={(e) => handleItemChange(index, e.target.value)}
                />
              </div>
              {items.length > 1 && (
                <Button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  variant="destructive"
                  size="sm"
                >
                  Remover
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Criando...' : 'Criar Pedido'}
      </Button>
    </form>
  )
}
