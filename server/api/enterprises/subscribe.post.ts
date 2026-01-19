import { getServerSupabase } from '~/server/utils/supabase'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) as {
    enterpriseId: string
    planId: string
  }

  if (!body?.enterpriseId || !body?.planId) {
    throw createError({ statusCode: 400, statusMessage: 'Missing parameters' })
  }

  // Build Supabase client with Authorization header if provided (to satisfy RLS)
  const config = useRuntimeConfig()
  let supabase = await getServerSupabase()
  
  try {
    const authHeader = getRequestHeader(event, 'authorization')
    if (authHeader) {
      const client = createClient(
        String((config.public as any)?.supabaseUrl || ''),
        String((config as any)?.supabaseServiceKey || (config.public as any)?.supabaseAnonKey || ''),
        { global: { headers: { Authorization: authHeader } } }
      )
      supabase = client
    }
  } catch {}

  const user = await supabase.auth.getUser()
  const uid = user.data.user?.id

  if (!uid) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  // Verify ownership
  const { data: ent } = await supabase
    .from('enterprises')
    .select('id')
    .eq('id', body.enterpriseId)
    .eq('owner_id', uid)
    .single()

  if (!ent) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  if (body.planId === 'free') {
    // Upsert subscription for free plan
    const { error } = await supabase
      .from('subscriptions')
      .upsert({
        enterprise_id: body.enterpriseId,
        plan_id: 'free',
        status: 'active',
        billing_interval: 'month',
        start_date: new Date().toISOString(),
        end_date: null // Free plan never expires
      }, { onConflict: 'enterprise_id' })

    if (error) {
      throw createError({ statusCode: 500, statusMessage: error.message })
    }

    return { success: true }
  } else {
    throw createError({ statusCode: 400, statusMessage: 'Only free plan can be set directly' })
  }
})
