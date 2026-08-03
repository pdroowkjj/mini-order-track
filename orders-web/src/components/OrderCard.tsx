import type { Order } from '../types/order'
import { OrderStatusObj, parseOrderItems } from '../types/order'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'

interface OrderCardProps {
  order: Order
  onStatusChange: (status: string) => Promise<void>
  isUpdating?: boolean
}

const statusVariants: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'info'> = {
  [OrderStatusObj.RECEBIDO]: 'info',
  [OrderStatusObj.EM_PREPARO]: 'warning',
  [OrderStatusObj.SAIU_PARA_ENTREGA]: 'secondary',
  [OrderStatusObj.ENTREGUE]: 'success',
  [OrderStatusObj.CANCELADO]: 'destructive',
}

const statusLabel: Record<string, string> = {
  [OrderStatusObj.RECEBIDO]: 'Recebido',
  [OrderStatusObj.EM_PREPARO]: 'Em Preparo',
  [OrderStatusObj.SAIU_PARA_ENTREGA]: 'Saiu para Entrega',
  [OrderStatusObj.ENTREGUE]: 'Entregue',
  [OrderStatusObj.CANCELADO]: 'Cancelado',
}

const nextStatuses: Record<string, string[]> = {
  [OrderStatusObj.RECEBIDO]: [OrderStatusObj.EM_PREPARO, OrderStatusObj.CANCELADO],
  [OrderStatusObj.EM_PREPARO]: [OrderStatusObj.SAIU_PARA_ENTREGA, OrderStatusObj.CANCELADO],
  [OrderStatusObj.SAIU_PARA_ENTREGA]: [OrderStatusObj.ENTREGUE],
  [OrderStatusObj.ENTREGUE]: [],
  [OrderStatusObj.CANCELADO]: [],
}

export function OrderCard({ order, onStatusChange, isUpdating }: OrderCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">ID: {order.id}</p>
          <h3 className="text-lg font-semibold text-gray-900">{order.clientName}</h3>
          <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
        </div>
        <Badge variant={statusVariants[order.status]}>
          {statusLabel[order.status]}
        </Badge>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Itens</h4>
        <div className="space-y-1">
          {parseOrderItems(order.items).map((item, index) => (
            <p key={index} className="text-sm text-gray-600">
              {item}
            </p>
          ))}
        </div>
      </div>

      {nextStatuses[order.status].length > 0 && (
        <div className="border-t border-gray-200 pt-4 flex justify-end gap-2">
          {nextStatuses[order.status].map((status) => (
            <Button
              key={status}
              size="sm"
              variant="outline"
              onClick={() => onStatusChange(status)}
              disabled={isUpdating}
            >
              {statusLabel[status]}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
