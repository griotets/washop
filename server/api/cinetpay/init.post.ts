import { getServerSupabase } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const raw = await readBody(event)
  const body = raw as { checkoutSessionId?: string }

  if (!body?.checkoutSessionId) {
    const q = getQuery(event) as any
    const fallbackId = q?.checkoutSessionId || q?.id
    if (fallbackId) {
      body.checkoutSessionId = String(fallbackId)
    } else {
      throw createError({ statusCode: 400, statusMessage: 'checkoutSessionId required' })
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

  const supabase = await getServerSupabase()

  const { data: session, error } = await supabase
    .from('subscription_checkout_sessions')
    .select('*')
    .eq('id', body.checkoutSessionId)
    .maybeSingle()

  if (error || !session) {
    throw createError({ statusCode: 404, statusMessage: 'Checkout session not found' })
  }

  const amount =
    session.billing_interval === 'year'
      ? Number(session.annual_price_after || session.annual_price_before || session.monthly_price * 12)
      : Number(session.monthly_price)

  if (!Number.isFinite(amount) || amount <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid amount for session' })
  }

  // CinetPay requires amount to be a multiple of 5
  const amountRoundedTo5 = Math.max(5, Math.round(amount / 5) * 5)
  const currency = session.currency || 'XAF'
  const transactionId = String(session.id)

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

  const payload = {
    apikey: apiKey,
    site_id: siteId,
    transaction_id: transactionId,
    amount: amountRoundedTo5,
    currency,
    description: `Abonnement ${session.plan_id} (${session.billing_interval})`,
    notify_url: notifyUrl,
    return_url: returnUrl,
    channels: 'ALL',
    lang: locale,
    metadata: JSON.stringify({
      checkout_session_id: transactionId,
      enterprise_id: session.enterprise_id,
      plan_id: session.plan_id,
      billing_interval: session.billing_interval
    })
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
    .eq('id', session.id)

  return {
    paymentUrl,
    transactionId
  }
})
