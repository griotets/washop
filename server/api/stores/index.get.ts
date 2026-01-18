import { getServerSupabase } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const supabase = await getServerSupabase()
  const q = getQuery(event) as Record<string, any>
  const search = String(q.search || '').trim()
  const limit = q.limit ? Number(q.limit) : 50

  let query = supabase
    .from('stores')
    .select('id,slug,name,image_url,phone,description,currency,color,social_whatsapp,social_facebook,social_instagram,social_telegram,delivery_settings,opening_hours_enabled')
    .order('name', { ascending: true })
    .limit(Number.isFinite(limit) && limit > 0 && limit <= 200 ? limit : 50)

  if (search) {
    query = query.ilike('name', `%${search}%`)
  }

  const { data, error } = await query

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return {
    items: Array.isArray(data) ? data : []
  }
})

