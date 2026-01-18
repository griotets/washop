import { getServerSupabase } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const supabase = await getServerSupabase()
  const slug = String(event.context.params?.slug || '').trim()

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Missing store slug' })
  }

  const body = await readBody(event)
  const name = String(body?.name || '').trim()
  const phone = String(body?.phone || '').trim()
  const email = body?.email ? String(body.email).trim() : ''
  const address = body?.address ? String(body.address).trim() : ''

  if (!name || !phone) {
    throw createError({ statusCode: 400, statusMessage: 'Missing name or phone' })
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

  const { data: existing, error: existingError } = await supabase
    .from('clients')
    .select('id,name,phone,email,address,created_at')
    .eq('store_id', store.id)
    .eq('phone', phone)
    .maybeSingle()

  if (existingError) {
    throw createError({ statusCode: 500, statusMessage: existingError.message })
  }

  if (existing) {
    const { data: updated, error: updateError } = await supabase
      .from('clients')
      .update({
        name,
        email: email || null,
        address: address || null
      })
      .eq('id', (existing as any).id)
      .select('id,store_id,name,phone,email,address,created_at')
      .maybeSingle()

    if (updateError || !updated) {
      throw createError({ statusCode: 500, statusMessage: updateError?.message || 'Failed to update client' })
    }

    return updated
  }

  const { data: created, error: createErrorClient } = await supabase
    .from('clients')
    .insert({
      store_id: store.id,
      name,
      phone,
      email: email || null,
      address: address || null
    })
    .select('id,store_id,name,phone,email,address,created_at')
    .maybeSingle()

  if (createErrorClient || !created) {
    throw createError({
      statusCode: 500,
      statusMessage: createErrorClient?.message || 'Failed to create client'
    })
  }

  return created
})

