import { getServerSupabase } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const supabase = await getServerSupabase()
  const q = getQuery(event) as Record<string, any>
  const phoneRaw = String(q.phone || '').trim()

  if (!phoneRaw) {
    throw createError({ statusCode: 400, statusMessage: 'Missing phone' })
  }

  const phone = phoneRaw

  const { data, error } = await supabase
    .from('clients')
    .select('id,store_id,name,phone,email,address,created_at')
    .eq('phone', phone)
    .order('created_at', { ascending: false })

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return {
    items: Array.isArray(data) ? data : []
  }
})

