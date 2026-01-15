export default defineEventHandler(async (event) => {
  const body = await readBody<{
    checkoutSessionId: string
  }>(event)

  if (!body?.checkoutSessionId) {
    throw createError({ statusCode: 400, statusMessage: 'checkoutSessionId required' })
  }

  const config = useRuntimeConfig()
  const apiKey = config.cinetpayApiKey as string | undefined
  const siteId = config.cinetpaySiteId as string | undefined
  const baseReturnUrl = config.public?.appBaseUrl as string | undefined

  if (!apiKey || !siteId) {
    throw createError({ statusCode: 500, statusMessage: 'CinetPay config missing' })
  }

  const query = getQuery(event)
  const locale = String(query.locale || 'fr').toLowerCase().startsWith('en') ? 'EN' : 'FR'

  const nuxt = useNuxtApp()
  const supabase = nuxt.$supabase

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

  const currency = session.currency || 'XAF'
  const transactionId = String(session.id)

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
    amount: Math.round(amount),
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

  const res = await $fetch<any>('https://api-checkout.cinetpay.com/v2/payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: payload
  })

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
}

