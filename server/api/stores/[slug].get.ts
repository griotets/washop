import { getServerSupabase } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const supabase = await getServerSupabase()
  const slug = String(event.context.params?.slug || '').trim()

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Missing store slug' })
  }

  const { data: store, error: storeError } = await supabase
    .from('stores')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (storeError) {
    throw createError({ statusCode: 500, statusMessage: storeError.message })
  }

  if (!store) {
    throw createError({ statusCode: 404, statusMessage: 'Store not found' })
  }

  const { data: zones, error: zonesError } = await supabase
    .from('delivery_zones')
    .select('id,name,base_fee,min_order_for_free')
    .eq('store_id', store.id)
    .order('base_fee', { ascending: true })

  if (zonesError) {
    throw createError({ statusCode: 500, statusMessage: zonesError.message })
  }

  return {
    ...store,
    delivery_zones: Array.isArray(zones) ? zones : []
  }
})

