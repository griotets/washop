import { getServerSupabase } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const supabase = await getServerSupabase()
  const slug = String(event.context.params?.slug || '').trim()
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Missing store slug' })
  }

  const q = getQuery(event) as Record<string, any>
  const phoneRaw = String(q.phone || '').trim()
  const status = String(q.status || '').trim()
  const limit = q.limit ? Number(q.limit) : 5

  if (!phoneRaw) {
    throw createError({ statusCode: 400, statusMessage: 'Missing phone' })
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

  let query = supabase
    .from('orders')
    .select('id,store_id,client_id,customer_name,customer_phone,customer_email,delivery_address,city,total_amount,delivery_fee,status,created_at,note')
    .eq('store_id', store.id)
    .eq('customer_phone', phoneRaw)

  if (status) {
    query = query.eq('status', status as any)
  }

  const safeLimit = Number.isFinite(limit) && limit > 0 && limit <= 20 ? limit : 5

  query = query
    .order('created_at', { ascending: false })
    .limit(safeLimit)

  const { data: orders, error: ordersError } = await query

  if (ordersError) {
    throw createError({ statusCode: 500, statusMessage: ordersError.message })
  }

  const list = Array.isArray(orders) ? orders : []

  if (!list.length) {
    return { items: [] }
  }

  const orderIds = list.map((o) => o.id)

  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('order_id,product_id,variant_id,product_name,unit_price,quantity,options')
    .in('order_id', orderIds)

  if (itemsError) {
    throw createError({ statusCode: 500, statusMessage: itemsError.message })
  }

  const grouped: Record<string, any[]> = {}
  for (const item of items || []) {
    const key = String((item as any).order_id)
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(item)
  }

  const withItems = list.map((o) => ({
    ...o,
    items: grouped[String(o.id)] || []
  }))

  return {
    items: withItems
  }
})

