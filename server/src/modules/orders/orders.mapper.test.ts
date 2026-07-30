import { describe, expect, it } from 'vitest'
import { createOrderSchema, patchOrderSchema } from './orders.schema.js'
import { toOrder } from './orders.mapper.js'
describe('order contract', () => {
 it('defaults fields and rejects identity', () => { const input={category:'agent',name:' Book ',amount:120.5,productCategories:['book']}; expect(createOrderSchema.parse(input)).toMatchObject({name:'Book',currency:'TWD'}); expect(()=>createOrderSchema.parse({...input,userId:crypto.randomUUID()})).toThrow() })
 it('rejects invalid patches', () => { expect(()=>patchOrderSchema.parse({})).toThrow(); expect(()=>patchOrderSchema.parse({id:crypto.randomUUID()})).toThrow() })
 it('maps rows without user ownership', () => { const now=new Date(); const order=toOrder({id:crypto.randomUUID(),user_id:crypto.randomUUID(),category:'agent',name:'Book',platform:'',product_url:'',status:'AWAITING_SHIPMENT',amount:'120.50',currency:'TWD',is_paid:false,balance_due:'0',order_date:null,payment_due_date:null,estimated_ship_date:null,estimated_arrival_date:null,is_preorder:false,product_categories:['book'],tracking_number:'',shipping_method:'',notes:'',created_at:now,updated_at:now}); expect(order).toMatchObject({amount:120.5,productUrl:'',productCategories:['book']}); expect(order).not.toHaveProperty('userId') })
})
