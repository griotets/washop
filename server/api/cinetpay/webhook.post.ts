import { getServerSupabase } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) as any
  const config = useRuntimeConfig()
  const apiKey = config.cinetpayApiKey as string | undefined
  const siteId = config.cinetpaySiteId as string | undefined

  if (!apiKey || !siteId) {
    throw createError({ statusCode: 500, statusMessage: 'CinetPay config missing' })
  }

  const transactionId = body?.transaction_id || body?.transactionId || body?.data?.transaction_id
  const token = body?.token || body?.payment_token || body?.data?.payment_token
  if (!transactionId && !token) {
    throw createError({ statusCode: 400, statusMessage: 'transaction_id missing' })
  }

  const checkPayload: any = { apikey: apiKey, site_id: siteId }
  if (token) checkPayload.token = String(token)
  else checkPayload.transaction_id = String(transactionId)

  const res = await $fetch<any>('https://api-checkout.cinetpay.com/v2/payment/check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: checkPayload
  })

  const status = String(res?.data?.status || res?.status || '').toUpperCase()
  const amount = Number(res?.data?.amount || 0)
  const currency = String(res?.data?.currency || '').toUpperCase()

  const supabase = await getServerSupabase()

  let { data: session } = await supabase
    .from('subscription_checkout_sessions')
    .select('*')
    .eq('id', String(transactionId))
    .maybeSingle()

  if (!session && token) {
    const { data: byToken } = await supabase
      .from('subscription_checkout_sessions')
      .select('*')
      .eq('provider_reference', String(token))
      .maybeSingle()
    session = byToken || null
  }

  if (!session) {
    return { ok: false }
  }

  if (String(session.status || '') === 'paid') {
    return { ok: true }
  }

  const expectedAmount =
    session.billing_interval === 'year'
      ? Number(session.annual_price_after || session.annual_price_before || (Number(session.monthly_price) * 12))
      : Number(session.monthly_price)
  const expectedCurrency = String(session.currency || 'XAF').toUpperCase()
  const expectedRounded = Math.round(Number.isFinite(expectedAmount) ? expectedAmount : 0)
  const receivedRounded = Math.round(Number.isFinite(amount) ? amount : 0)

  if (expectedRounded <= 0 || expectedRounded !== receivedRounded || expectedCurrency !== currency) {
    await supabase
      .from('subscription_checkout_sessions')
      .update({ status: 'mismatch' })
      .eq('id', session.id)
    return { ok: false }
  }

  if (status === 'ACCEPTED' || status === 'SUCCESS' || status === 'PAID') {
    await supabase
      .from('subscription_checkout_sessions')
      .update({
        status: 'paid',
        provider: 'cinetpay',
        provider_reference: String(res?.data?.payment_token || transactionId)
      })
      .eq('id', session.id)

    const now = new Date()
    const end = new Date(now)
    if (session.billing_interval === 'year') {
      end.setFullYear(end.getFullYear() + 1)
    } else {
      end.setMonth(end.getMonth() + 1)
    }

    const { data: existing } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('enterprise_id', session.enterprise_id)
      .maybeSingle()

    if (!existing) {
      await supabase.from('subscriptions').insert({
        enterprise_id: session.enterprise_id,
        plan_id: session.plan_id,
        status: 'active',
        start_date: now.toISOString(),
        end_date: end.toISOString(),
        billing_interval: session.billing_interval,
        billing_amount: amount
      })
    } else {
      await supabase
        .from('subscriptions')
        .update({
          plan_id: session.plan_id,
          status: 'active',
          start_date: now.toISOString(),
          end_date: end.toISOString(),
          billing_interval: session.billing_interval,
          billing_amount: amount
        })
        .eq('id', existing.id)
    }
  } else {
    await supabase
      .from('subscription_checkout_sessions')
      .update({ status: 'canceled' })
      .eq('id', session.id)
  }

  return { ok: true }
})
