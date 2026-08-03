export const OrderStatusObj = {
  RECEBIDO: 'RECEBIDO',
  EM_PREPARO: 'EM_PREPARO',
  SAIU_PARA_ENTREGA: 'SAIU_PARA_ENTREGA',
  ENTREGUE: 'ENTREGUE',
  CANCELADO: 'CANCELADO',
} as const

export interface Order {
  id: string
  clientName: string
  deliveryAddress: string
  status: string
  items: string
  createdAt: string
}

export function parseOrderItems(items: string): string[] {
  if (!items?.trim()) {
    return []
  }

  return items.split(',').map((item) => item.trim())
}

export interface CreateOrderRequest {
  clientName: string
  deliveryAddress: string
  items: string[]
}
