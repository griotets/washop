import { getServerSupabase } from '~/server/utils/supabase'

const ALLOWED_TABLES = new Set([
  'enterprises',
  'stores',
  'categories',
  'tags',
  'products',
  'variants',
  'options',
  'clients',
  'client_tags',
  'product_tags',
  'orders',
  'order_items',
  'delivery_zones',
  'analytics_log'
])

export default defineEventHandler(async (event) => {
  const supabase = await getServerSupabase()
  const table = String(event.context.params?.table || '')
  if (!ALLOWED_TABLES.has(table)) {
    setResponseStatus(event, 400)
    return { error: 'Invalid table' }
  }

  const method = getMethod(event).toUpperCase()
  if (method === 'GET') {
    const q = getQuery(event) as Record<string, any>
    if (q.id) {
      const { data, error } = await supabase.from(table).select('*').eq('id', q.id).maybeSingle()
      return { data, error: error?.message || null }
    } else {
      let query = supabase.from(table).select('*')
      if (q.store_id) query = query.eq('store_id', q.store_id)
      if (q.limit) query = query.limit(Number(q.limit))
      if (q.offset) query = query.range(Number(q.offset), Number(q.offset) + Number(q.limit || 50) - 1)
      const { data, error } = await query
      return { data, error: error?.message || null }
    }
  }

  if (method === 'POST') {
    const body = await readBody(event)
    if (table === 'stores') {
      if (!body.slug) {
        const base = String(body.name || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
        let slug = base || `store-${Math.random().toString(36).slice(2, 8)}`
        for (let i = 1; i < 50; i++) {
          const candidate = i === 1 ? slug : `${slug}-${i}`
          const { data: existing } = await supabase.from('stores').select('id').eq('slug', candidate).maybeSingle()
          if (!existing) { slug = candidate; break }
        }
        body.slug = slug
      }
    }
    const { data, error } = await supabase.from(table).insert(body).select('*').maybeSingle()
    setResponseStatus(event, error ? 400 : 200)
    return { data, error: error?.message || null }
  }

  if (method === 'PUT' || method === 'PATCH') {
    const body = await readBody(event)
    const id = body?.id
    if (!id) {
      setResponseStatus(event, 400)
      return { error: 'Missing id in body' }
    }
    const { data, error } = await supabase.from(table).update(body).eq('id', id).select('*').maybeSingle()
    setResponseStatus(event, error ? 400 : 200)
    return { data, error: error?.message || null }
  }

  if (method === 'DELETE') {
    const q = getQuery(event) as Record<string, any>
    const id = q.id
    if (!id) {
      setResponseStatus(event, 400)
      return { error: 'Missing id in query' }
    }
    const { error } = await supabase.from(table).delete().eq('id', id)
    setResponseStatus(event, error ? 400 : 200)
    return { ok: !error, error: error?.message || null }
  }

  setResponseStatus(event, 405)
  return { error: 'Method not allowed' }
})

