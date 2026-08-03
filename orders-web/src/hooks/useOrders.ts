import { useState, useCallback } from 'react'
import { useApi } from './useApi'
import type { Order, CreateOrderRequest } from '../types/order'

export function useOrders() {
  const { get, post, put } = useApi()
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await get<Order[]>('/api/orders')
      setOrders(data)
    } catch (err) {
      setError('Erro ao carregar pedidos')
    } finally {
      setIsLoading(false)
    }
  }, [get])

  const searchOrderById = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await get<Order>(`/api/orders/${id}`)
      setSelectedOrder(data)
    } catch (err) {
      setError('Pedido não encontrado')
      setSelectedOrder(null)
    } finally {
      setIsLoading(false)
    }
  }, [get])

  const createOrder = useCallback(async (orderData: CreateOrderRequest) => {
    setIsLoading(true)
    setError(null)
    try {
      const newOrder = await post<Order, CreateOrderRequest>('/api/orders', orderData)
      setOrders((prev) => [newOrder, ...prev])
      return newOrder
    } catch (err) {
      setError('Erro ao criar pedido')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [post])

  const updateOrderStatus = useCallback(async (id: string, status: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const updated = await put<Order, { status: string }>(`/api/orders/${id}`, { status })
      setOrders((prev) =>
        prev.map((order) => (order.id === id ? updated : order))
      )
      if (selectedOrder?.id === id) {
        setSelectedOrder(updated)
      }
      return updated
    } catch (err) {
      setError('Erro ao atualizar status')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [put, selectedOrder])

  const clearSearch = useCallback(() => {
    setSelectedOrder(null)
    setError(null)
  }, [])

  return {
    orders,
    selectedOrder,
    isLoading,
    error,
    fetchOrders,
    searchOrderById,
    createOrder,
    updateOrderStatus,
    clearSearch,
  }
}
