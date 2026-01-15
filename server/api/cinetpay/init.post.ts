import { getServerSupabase } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const raw = await readBody(event)
  const body = raw as {
    checkoutSessionId?: string
    enterpriseId?: string
    planId?: string
    billingInterval?: 'month' | 'year'
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

  if (!body?.checkoutSessionId) {
    const q = getQuery(event) as any
    const fallbackId = q?.checkoutSessionId || q?.id
    if (fallbackId) {
      body.checkoutSessionId = String(fallbackId)
    } else {
      // Support creating the session inline if enterpriseId + planId are provided
      if (!body?.enterpriseId || !body?.planId) {
        throw createError({ statusCode: 400, statusMessage: 'checkoutSessionId required' })
      }
    }
  }

  const config = useRuntimeConfig()
  const apiKey = config.cinetpayApiKey as string | undefined
  const siteId = config.cinetpaySiteId as string | undefined
  let baseReturnUrl = config.public?.appBaseUrl as string | undefined

  if (!apiKey || !siteId) {
    throw createError({ statusCode: 500, statusMessage: 'CinetPay config missing' })
  }

  const query = getQuery(event)
  const locale = String(query.locale || 'fr').toLowerCase().startsWith('en') ? 'EN' : 'FR'

  // Build Supabase client with Authorization header if provided (to satisfy RLS)
  let supabase = await getServerSupabase()
  try {
    const authHeader = getRequestHeader(event, 'authorization')
    if (authHeader) {
      const { createRequire } = await import('node:module')
      const require = createRequire(import.meta.url)
      const mod: any = require('@supabase/supabase-js')
      const client = mod.createClient(
        String((config.public as any)?.supabaseUrl || ''),
        String((config as any)?.supabaseServiceKey || (config.public as any)?.supabaseAnonKey || ''),
        { global: { headers: { Authorization: authHeader } } }
      )
      supabase = client
    }
  } catch {}

  // Create session on-the-fly if not provided
  if (!body.checkoutSessionId && body.enterpriseId && body.planId) {
    const { data: created, error: rpcError } = await supabase.rpc('create_subscription_checkout_session', {
      p_enterprise_id: body.enterpriseId,
      p_plan_id: String(body.planId),
      p_billing_interval: body.billingInterval || 'month'
    })
    if (rpcError) {
      throw createError({ statusCode: 500, statusMessage: 'Failed to create checkout session: ' + rpcError.message })
    }
    body.checkoutSessionId = String(created?.id || '')
    if (!body.checkoutSessionId) {
      throw createError({ statusCode: 500, statusMessage: 'Checkout session creation returned empty id' })
    }
  }
  console.log(' body.checkoutSessionId', body.checkoutSessionId)
  const { data: session, error } = await supabase
    .from('subscription_checkout_sessions')
    .select('*')
    .eq('id', body.checkoutSessionId)
    .maybeSingle()

  let finalSession = session
  if (!finalSession) {
    try {
      const svcKey = (config as any)?.supabaseServiceKey as string | undefined
      const url = String((config.public as any)?.supabaseUrl || '')
      if (svcKey && url) {
        const { createRequire } = await import('node:module')
        const require = createRequire(import.meta.url)
        const mod: any = require('@supabase/supabase-js')
        const svc = mod.createClient(url, svcKey)
        const { data: svcSession } = await svc
          .from('subscription_checkout_sessions')
          .select('*')
          .eq('id', body.checkoutSessionId)
          .maybeSingle()
        finalSession = svcSession || null
      }
    } catch {}
  }

  if (error || !finalSession) {
    const q = getQuery(event) as any
    const enterpriseId = body.enterpriseId || q.enterpriseId
    const planId = body.planId || q.planId
    const interval = body.billingInterval || q.billingInterval || 'month'
    if (enterpriseId && planId) {
      const { data: created, error: rpcError } = await supabase.rpc('create_subscription_checkout_session', {
        p_enterprise_id: String(enterpriseId),
        p_plan_id: String(planId),
        p_billing_interval: String(interval)
      })
      if (!rpcError && created?.id) {
        const { data: reloaded } = await supabase
          .from('subscription_checkout_sessions')
          .select('*')
          .eq('id', String(created.id))
          .maybeSingle()
        finalSession = reloaded || null
      }
    }
    if (!finalSession) {
      throw createError({ statusCode: 404, statusMessage: 'Checkout session not found' })
    }
  }

  const amount =
    finalSession.billing_interval === 'year'
      ? Number(finalSession.annual_price_after || finalSession.annual_price_before || finalSession.monthly_price * 12)
      : Number(finalSession.monthly_price)

  if (!Number.isFinite(amount) || amount <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid amount for session' })
  }

  // CinetPay requires amount to be a multiple of 5
  const amountRoundedTo5 = Math.max(5, Math.round(amount / 5) * 5)
  const currency = finalSession.currency || 'XAF'
  const transactionId = String(finalSession.id)

  // Ensure absolute URLs
  if (!baseReturnUrl) {
    try {
      const u = getRequestURL(event)
      baseReturnUrl = `${u.protocol}//${u.host}`
    } catch {
      baseReturnUrl = ''
    }
  }

  const notifyUrl =
    config.public?.cinetpayNotifyUrl ||
    `${baseReturnUrl || ''}/api/cinetpay/webhook`
  const returnUrl =
    config.public?.cinetpayReturnUrl ||
    `${baseReturnUrl || ''}/admin/settings?tab=billing`

  const siteIdNum = Number(siteId)
  if (!Number.isFinite(siteIdNum) || siteIdNum <= 0) {
    throw createError({ statusCode: 500, statusMessage: 'Invalid CinetPay site id' })
  }

  const payload = {
    apikey: apiKey,
    site_id: siteIdNum,
    transaction_id: transactionId,
    amount: amountRoundedTo5,
    currency,
    description: `Abonnement ${finalSession.plan_id} (${finalSession.billing_interval})`,
    notify_url: notifyUrl,
    return_url: returnUrl,
    channels: 'ALL',
    lang: locale,
    metadata: JSON.stringify({
      checkout_session_id: transactionId,
      enterprise_id: finalSession.enterprise_id,
      plan_id: finalSession.plan_id,
      billing_interval: finalSession.billing_interval
    })
  }
  if (body.customer) {
    const c = body.customer
    Object.assign(payload as any, {
      customer_name: c.name,
      customer_surname: c.surname,
      customer_phone_number: c.phone,
      customer_email: c.email,
      customer_address: c.address,
      customer_city: c.city,
      customer_country: (c.country || 'CM'),
      customer_state: (c.state || 'CM'),
      customer_zip_code: (c.zip || '00000')
    })
  }

  let res: any = null
  console.log('payload',payload)
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
      statusMessage: e?.message || 'Failed to contact CinetPay'
    })
  }

  if (!res || String(res.code) !== '201') {
    throw createError({
      statusCode: 502,
      statusMessage: 'CinetPay init error',
      data: res
    })
  }

  const paymentUrl = res.data?.payment_url || res.payment_url

  await supabase
    .from('subscription_checkout_sessions')
    .update({
      status: 'created',
      provider: 'cinetpay',
      provider_reference: String(res.data?.payment_token || transactionId),
      payment_url: paymentUrl
    })
    .eq('id', finalSession.id)

  return {
    paymentUrl,
    transactionId
  }
})
