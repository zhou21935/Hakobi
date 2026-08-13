import { z } from 'zod'

const text = z.string().trim().max(2000)
const nullableDate = z.union([z.iso.date(), z.null()])
const safeWebUrl = z.url().refine((value) => URL.canParse(value) && ['http:', 'https:'].includes(new URL(value).protocol), 'must use HTTP or HTTPS')
const editable = {
  category: z.enum(['agent', 'parcel']),
  name: z.string().trim().min(1).max(200),
  platform: text,
  productUrl: z.union([safeWebUrl, z.literal('')]),
  status: z.enum(['AWAITING_SHIPMENT', 'CONSOLIDATING', 'IN_TRANSIT', 'ARRIVED', 'COMPLETED']),
  amount: z.number().positive().max(999999999999.99),
  currency: z.enum(['TWD', 'USD', 'KRW', 'JPY']),
  isPaid: z.boolean(),
  orderDate: nullableDate,
  estimatedShipDate: nullableDate,
  estimatedArrivalDate: nullableDate,
  isPreorder: z.boolean(),
  productCategories: z.array(z.enum(['merch', 'book', 'other'])).min(1),
  trackingNumber: text,
  shippingMethod: text,
  notes: text
}

export const createOrderSchema = z.strictObject({
  ...editable,
  status: editable.status.default('AWAITING_SHIPMENT'),
  currency: editable.currency.default('TWD'),
  platform: editable.platform.default(''), productUrl: editable.productUrl.default(''),
  isPaid: editable.isPaid.default(false),
  orderDate: editable.orderDate.default(null),
  estimatedShipDate: editable.estimatedShipDate.default(null), estimatedArrivalDate: editable.estimatedArrivalDate.default(null),
  isPreorder: editable.isPreorder.default(false), trackingNumber: editable.trackingNumber.default(''),
  shippingMethod: editable.shippingMethod.default(''), notes: editable.notes.default('')
})
export const patchOrderSchema = z.strictObject(editable).partial().refine((v) => Object.keys(v).length > 0, 'At least one field is required')
export const idSchema = z.uuid()
export type CreateOrder = z.infer<typeof createOrderSchema>
export type PatchOrder = z.infer<typeof patchOrderSchema>
