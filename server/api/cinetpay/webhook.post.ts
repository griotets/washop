export default defineEventHandler(async (event) => {
  const body = await readBody<any>(event)
  const config = useRuntimeConfig()
  const apiKey = config.cinetpayApiKey as string | undefined
  const siteId = config.cinetpaySiteId as string | undefined

  if (!apiKey || !siteId) {
    throw createError({ statusCode: 500, statusMessage: 'CinetPay config missing' })
  }

  const transactionId = body?.transaction_id || body?.transactionId || body?.data?.transaction_id
  if (!transactionId) {
    throw createError({ statusCode: 400, statusMessage: 'transaction_id missing' })
  }

  const checkPayload = {
    apikey: apiKey,
    site_id: siteId,
    transaction_id: String(transactionId)
  }

  const res = await $fetch<any>('https://api-checkout.cinetpay.com/v2/payment/check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: checkPayload
  })

  const status = res?.data?.status || res?.status
  const amount = Number(res?.data?.amount || 0)

  const nuxt = useNuxtApp()
  const supabase = nuxt.$supabase

  const { data: session } = await supabase
    .from('subscription_checkout_sessions')
    .select('*')
    .eq('id', String(transactionId))
    .maybeSingle()

  if (!session) {
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
}

