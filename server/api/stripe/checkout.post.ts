import { getServerSupabase } from '~/server/utils/supabase'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) as {
    enterpriseId?: string
    customer?: {
      name?: string
      surname?: string
      phone?: string
      email?: string
      address?: string
      city?: string
      country?: string
      state?: string
      zip?: string
    }
  }

  if (!body?.enterpriseId) {
    throw createError({ statusCode: 400, statusMessage: 'enterpriseId required' })
  }

  const config = useRuntimeConfig()
  const cinetpayApiKey = (config as any)?.cinetpayApiKey as string | undefined
  const cinetpaySiteId = (config as any)?.cinetpaySiteId as string | undefined
  let baseReturnUrl = (config.public as any)?.appBaseUrl as string | undefined

  if (!cinetpayApiKey || !cinetpaySiteId) {
    throw createError({ statusCode: 500, statusMessage: 'CinetPay config missing' })
  }

  let supabase = await getServerSupabase()
  const authHeader = getRequestHeader(event, 'authorization')
  if (authHeader) {
    try {
      const client = createClient(
        String((config.public as any)?.supabaseUrl || ''),
        String((config as any)?.supabaseServiceKey || (config.public as any)?.supabaseAnonKey || ''),
        { global: { headers: { Authorization: authHeader } } }
      )
      supabase = client
    } catch {}
  }

  const { data: ent } = await supabase
    .from('enterprises')
    .select('id')
    .eq('id', body.enterpriseId)
    .maybeSingle()

  if (!ent?.id) {
    throw createError({ statusCode: 404, statusMessage: 'Enterprise not found' })
  }

  const countryRaw = String(body.customer?.country || 'CM').toUpperCase()
  const cemac = new Set(['CM', 'CF', 'TD', 'CG', 'GA', 'GQ'])
  const uemoa = new Set(['SN', 'ML', 'BF', 'NE', 'TG', 'BJ', 'CI', 'GW'])

  let currency = 'usd'
  let amountMinor = 100

  if (cemac.has(countryRaw)) {
    currency = 'xaf'
    amountMinor = 500
  } else if (uemoa.has(countryRaw)) {
    currency = 'xof'
    amountMinor = 500
  }

  if (!baseReturnUrl) {
    try {
      const u = getRequestURL(event)
      baseReturnUrl = `${u.protocol}//${u.host}`
    } catch {
      baseReturnUrl = ''
    }
  }

  const cinetCurrency = currency.toUpperCase()

  const transactionId = `wsprem-${Date.now()}${Math.floor(Math.random() * 100000)}`

  const returnUrl = `${baseReturnUrl || ''}/admin/stores/create`
  const notifyUrl = `${baseReturnUrl || ''}/api/cinetpay/notify`

  const payload: any = {
    apikey: cinetpayApiKey,
    site_id: cinetpaySiteId,
    transaction_id: transactionId,
    amount: amountMinor,
    currency: cinetCurrency,
    description: 'Abonnement Wa-Shop Premium – 1er mois',
    notify_url: notifyUrl,
    return_url: returnUrl,
    channels: 'ALL',
    lang: 'FR',
    metadata: JSON.stringify({
      enterprise_id: String(ent.id),
      plan_id: 'premium'
    })
  }

  if (body.customer) {
    if (body.customer.name) payload.customer_name = String(body.customer.name)
    if (body.customer.surname) payload.customer_surname = String(body.customer.surname)
    if (body.customer.phone) payload.customer_phone_number = String(body.customer.phone)
    if (body.customer.email) payload.customer_email = String(body.customer.email)
    if (body.customer.address) payload.customer_address = String(body.customer.address)
    if (body.customer.city) payload.customer_city = String(body.customer.city)
    if (body.customer.country) payload.customer_country = String(body.customer.country).toUpperCase()
    if (body.customer.state) payload.customer_state = String(body.customer.state)
    if (body.customer.zip) payload.customer_zip_code = String(body.customer.zip)
  }

  let res: any = null
  try {
    res = await $fetch<any>('https://api-checkout.cinetpay.com/v2/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: payload
    })
  } catch (e: any) {
    throw createError({
      statusCode: 502,
      statusMessage: 'Failed to contact CinetPay'
    })
  }

  if (!res || res.code !== '201' || !res.data || typeof res.data.payment_url !== 'string') {
    throw createError({
      statusCode: 502,
      statusMessage: 'CinetPay Checkout error'
    })
  }

  return {
    url: res.data.payment_url
  }
})
