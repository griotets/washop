import { getServerSupabase } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const supabase = await getServerSupabase()
  const slug = String(event.context.params?.slug || '').trim()
  const orderId = String(event.context.params?.orderId || '').trim()

  if (!slug || !orderId) {
    throw createError({ statusCode: 400, statusMessage: 'Missing store slug or order id' })
  }

  const { data: store, error: storeError } = await supabase
    .from('stores')
    .select('id')
    .eq('slug', slug)
    .maybeSingle()

  if (storeError) {
    throw createError({ statusCode: 500, statusMessage: storeError.message })
  }

  if (!store) {
    throw createError({ statusCode: 404, statusMessage: 'Store not found' })
  }

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('id,store_id,client_id,customer_name,customer_phone,customer_email,delivery_address,city,total_amount,delivery_fee,status,created_at,note')
    .eq('id', orderId)
    .eq('store_id', store.id)
    .maybeSingle()

  if (orderError) {
    throw createError({ statusCode: 500, statusMessage: orderError.message })
  }

  if (!order) {
    throw createError({ statusCode: 404, statusMessage: 'Order not found' })
  }

  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('order_id,product_id,variant_id,product_name,unit_price,quantity,options')
    .eq('order_id', order.id)

  if (itemsError) {
    throw createError({ statusCode: 500, statusMessage: itemsError.message })
  }

  return {
    ...order,
    items: Array.isArray(items) ? items : []
  }
})

