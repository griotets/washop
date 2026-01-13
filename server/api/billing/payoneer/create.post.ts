async function getSupabaseForUser(token: string) {
  const config = useRuntimeConfig()
  const url = String((config.public as any)?.supabaseUrl || '')
  const anonKey = String((config.public as any)?.supabaseAnonKey || '')
  if (!url || !anonKey) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase public config is missing' })
  }
  const { createRequire } = await import('node:module')
  const require = createRequire(import.meta.url)
  const mod: any = require('@supabase/supabase-js')
  if (typeof mod?.createClient !== 'function') throw new Error('Failed to load Supabase createClient')
  return mod.createClient(url, anonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  })
}

function parseBearerToken(raw: string | undefined) {
  const v = String(raw || '').trim()
  if (!v) return ''
  const m = v.match(/^Bearer\s+(.+)$/i)
  return m ? String(m[1] || '').trim() : ''
}

function guessOscatoPaymentPageBaseUrl(checkoutBaseUrl: string) {
  const u = String(checkoutBaseUrl || '').toLowerCase()
  if (u.includes('sandbox.oscato.com')) return 'https://resources.sandbox.oscato.com'
  return 'https://resources.oscato.com'
}

function extractLongIdFromSelfUrl(selfUrl: string) {
  const u = String(selfUrl || '').split('?')[0]
  const parts = u.split('/').filter(Boolean)
  return String(parts[parts.length - 1] || '')
}

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  const token = parseBearerToken(authHeader)
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Missing Authorization header' })
  }

  const body = await readBody(event)
  const enterpriseId = String(body?.enterpriseId || '')
  const planId = String(body?.planId || '')
  const billingInterval = String(body?.billingInterval || 'month')

  if (!enterpriseId || !planId) {
    throw createError({ statusCode: 400, statusMessage: 'enterpriseId and planId are required' })
  }
  if (billingInterval !== 'month' && billingInterval !== 'year') {
    throw createError({ statusCode: 400, statusMessage: 'billingInterval must be month or year' })
  }

  const userSupabase = await getSupabaseForUser(token)
  const { data: userData, error: userError } = await userSupabase.auth.getUser()
  const userId = String(userData?.user?.id || '')
  if (userError || !userId) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid session' })
  }

  const { data: ent, error: entError } = await userSupabase
    .from('enterprises')
    .select('id, owner_id')
    .eq('id', enterpriseId)
    .maybeSingle()
  if (entError || !ent?.id) {
    throw createError({ statusCode: 404, statusMessage: 'Enterprise not found' })
  }
  if (String(ent.owner_id || '') !== userId) {
    throw createError({ statusCode: 403, statusMessage: 'Not allowed' })
  }

  const { data: sessionRow, error: sessionError } = await userSupabase.rpc('create_subscription_checkout_session', {
    p_enterprise_id: enterpriseId,
    p_plan_id: planId,
    p_billing_interval: billingInterval
  })
  if (sessionError || !sessionRow?.id) {
    throw createError({ statusCode: 400, statusMessage: sessionError?.message || 'Failed to create checkout session' })
  }

  const config = useRuntimeConfig()
  const checkoutBaseUrl = String((config as any)?.payoneerCheckoutBaseUrl || process.env.PAYONEER_CHECKOUT_BASE_URL || 'https://api.sandbox.oscato.com')
  const paymentPageBaseUrl = String((config as any)?.payoneerPaymentPageBaseUrl || process.env.PAYONEER_PAYMENT_PAGE_BASE_URL || guessOscatoPaymentPageBaseUrl(checkoutBaseUrl))
  const merchantCode = String((config as any)?.payoneerMerchantCode || process.env.PAYONEER_MERCHANT_CODE || '')
  const paymentToken = String((config as any)?.payoneerPaymentToken || process.env.PAYONEER_PAYMENT_TOKEN || '')

  if (!merchantCode || !paymentToken) {
    throw createError({ statusCode: 500, statusMessage: 'Payoneer credentials are missing' })
  }

  const origin = getRequestURL(event).origin
  const checkoutSessionId = String(sessionRow.id || '')
  const currency = String(sessionRow.currency || 'XAF')
  const amount = billingInterval === 'year'
    ? Number(sessionRow.annual_price_after || 0)
    : Number(sessionRow.monthly_price || 0)

  const listRequest = {
    transactionId: checkoutSessionId,
    country: 'CM',
    customer: {
      number: userId
    },
    payment: {
      amount,
      currency,
      reference: `wa-shop:${planId}:${billingInterval}`
    },
    style: { hostedVersion: 'v3' },
    callback: {
      returnUrl: `${origin}/admin/settings?tab=billing&checkout=success&session=${encodeURIComponent(checkoutSessionId)}`,
      cancelUrl: `${origin}/admin/settings?tab=billing&checkout=cancel&session=${encodeURIComponent(checkoutSessionId)}`,
      notificationUrl: `${origin}/api/billing/payoneer/webhook`
    }
  }

  const vendorMime = 'application/vnd.optile.payment.enterprise-v1-extensible+json'
  const basicUser = `${merchantCode}/${paymentToken}`
  const basicAuth = Buffer.from(`${basicUser}:`).toString('base64')

  const listRes = await fetch(`${checkoutBaseUrl.replace(/\/+$/, '')}/api/lists`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicAuth}`,
      Accept: vendorMime,
      'Content-Type': vendorMime
    },
    body: JSON.stringify(listRequest)
  })

  if (!listRes.ok) {
    const text = await listRes.text().catch(() => '')
    throw createError({ statusCode: 502, statusMessage: `Payoneer LIST failed: ${listRes.status} ${text}`.slice(0, 400) })
  }

  const listJson: any = await listRes.json().catch(() => null)
  const selfUrl = String(listJson?.links?.self || listJson?.links?.self?.href || '')
  const longId = String(listJson?.identification?.longId || extractLongIdFromSelfUrl(selfUrl))
  const paymentUrl = `${paymentPageBaseUrl.replace(/\/+$/, '')}/paymentpage/v3/responsive.html?listUrl=${encodeURIComponent(selfUrl)}`

  const { getServerSupabase } = await import('~/server/utils/supabase')
  const serverSupabase = await getServerSupabase()
  await serverSupabase
    .from('subscription_checkout_sessions')
    .update({
      provider: 'payoneer',
      provider_reference: longId || null,
      payment_url: paymentUrl || null
    })
    .eq('id', checkoutSessionId)

  return {
    checkoutSessionId,
    paymentUrl,
    payoneerLongId: longId || null
  }
})

