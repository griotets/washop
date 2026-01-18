import { getServerSupabase } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const supabase = await getServerSupabase()
  const slug = String(event.context.params?.slug || '').trim()
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Missing store slug' })
  }

  const q = getQuery(event) as Record<string, any>
  const search = String(q.search || q.q || '').trim()
  const limit = q.limit ? Number(q.limit) : 20
  const offset = q.offset ? Number(q.offset) : 0

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
    .from('products')
    .select('id,name,description,price,images,is_visible,is_out_of_stock,track_inventory,stock_quantity,max_order_quantity,min_order_quantity')
    .eq('store_id', store.id)
    .eq('is_visible', true)

  if (search) {
    query = query.ilike('name', `%${search}%`)
  }

  const safeLimit = Number.isFinite(limit) && limit > 0 && limit <= 100 ? limit : 20
  const safeOffset = Number.isFinite(offset) && offset >= 0 ? offset : 0

  query = query
    .order('created_at', { ascending: false })
    .range(safeOffset, safeOffset + safeLimit - 1)

  const { data, error } = await query

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return {
    items: Array.isArray(data) ? data : []
  }
})

