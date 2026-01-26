import { getServerSupabase } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const supabase = await getServerSupabase()

  // Validate body
  if (!body.order || !body.items) {
    throw createError({ statusCode: 400, statusMessage: 'Missing order or items data' })
  }

  // 1. Create Order
  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .insert(body.order)
    .select('id')
    .single()

  if (orderErr) {
    console.error('Server Order Create Error:', orderErr)
    throw createError({ statusCode: 500, statusMessage: orderErr.message })
  }

  // 2. Create Order Items
  const itemsPayload = body.items.map((item: any) => ({
    ...item,
    order_id: order.id
  }))

  const { error: itemsErr } = await supabase
    .from('order_items')
    .insert(itemsPayload)

  if (itemsErr) {
    console.error('Server Order Items Create Error:', itemsErr)
    throw createError({ statusCode: 500, statusMessage: itemsErr.message })
  }

  return { order }
})
