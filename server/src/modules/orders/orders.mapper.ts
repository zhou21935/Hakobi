import type { CreateOrder } from './orders.schema.js'

export type OrderRow = Record<string, unknown>
export function toOrder(row: OrderRow) {
  return {
    id: row.id, category: row.category, name: row.name, platform: row.platform ?? '', productUrl: row.product_url ?? '',
    status: row.status, amount: Number(row.amount), currency: row.currency, isPaid: row.is_paid,
    balanceDue: Number(row.balance_due), orderDate: row.order_date ?? null, paymentDueDate: row.payment_due_date ?? null,
    estimatedShipDate: row.estimated_ship_date ?? null, estimatedArrivalDate: row.estimated_arrival_date ?? null,
    isPreorder: row.is_preorder, productCategories: row.product_categories, trackingNumber: row.tracking_number ?? '',
    shippingMethod: row.shipping_method ?? '', notes: row.notes ?? '',
    createdAt: new Date(row.created_at as string | Date).toISOString(), updatedAt: new Date(row.updated_at as string | Date).toISOString()
  }
}

export function toColumns(input: Partial<CreateOrder>): Record<string, unknown> {
  const map: Record<string, string> = { productUrl: 'product_url', isPaid: 'is_paid', balanceDue: 'balance_due', orderDate: 'order_date', paymentDueDate: 'payment_due_date', estimatedShipDate: 'estimated_ship_date', estimatedArrivalDate: 'estimated_arrival_date', isPreorder: 'is_preorder', productCategories: 'product_categories', trackingNumber: 'tracking_number', shippingMethod: 'shipping_method' }
  return Object.fromEntries(Object.entries(input).map(([key, value]) => [map[key] ?? key, value === '' && !['name', 'platform', 'product_url', 'tracking_number', 'shipping_method', 'notes'].includes(map[key] ?? key) ? null : value]))
}
