function extractUuid(input: unknown) {
  const s = String(input || '')
  const m = s.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i)
  return m ? String(m[0]) : ''
}

function isSuccessfulPayload(payload: any) {
  const resultCode = String(payload?.resultCode || '')
  const returnCode = String(payload?.returnCode?.name || payload?.returnCode || '')
  const statusCode = String(payload?.status?.code || payload?.status || '')
  if (resultCode.startsWith('000')) return true
  if (returnCode.toUpperCase() === 'OK') return true
  if (statusCode.toLowerCase() === 'paid') return true
  return false
}

function isCanceledPayload(payload: any) {
  const statusCode = String(payload?.status?.code || payload?.status || '').toLowerCase()
  const interaction = String(payload?.interaction?.code || '').toLowerCase()
  return statusCode.includes('cancel') || interaction.includes('cancel')
}

function addInterval(from: Date, interval: string) {
  const d = new Date(from.getTime())
  if (interval === 'year') {
    d.setFullYear(d.getFullYear() + 1)
    return d
  }
  d.setMonth(d.getMonth() + 1)
  return d
}

export default defineEventHandler(async (event) => {
  const payload = await readBody(event).catch(() => null)
  const checkoutSessionId =
    extractUuid(payload?.transactionId) ||
    extractUuid(payload?.identification?.transactionId) ||
    extractUuid(payload?.identification?.reference) ||
    extractUuid(payload?.reference) ||
    ''

  if (!checkoutSessionId) {
    setResponseStatus(event, 200)
    return { ok: true }
  }

  const { getServerSupabase } = await import('~/server/utils/supabase')
  const supabase = await getServerSupabase()

  const { data: sessionRow } = await supabase
    .from('subscription_checkout_sessions')
    .select('*')
    .eq('id', checkoutSessionId)
    .maybeSingle()

  if (!sessionRow?.id) {
    setResponseStatus(event, 200)
    return { ok: true }
  }

  const newStatus = isSuccessfulPayload(payload) ? 'paid' : (isCanceledPayload(payload) ? 'canceled' : '')
  if (!newStatus) {
    setResponseStatus(event, 200)
    return { ok: true }
  }

  if (String(sessionRow.status || '') !== newStatus) {
    await supabase
      .from('subscription_checkout_sessions')
      .update({ status: newStatus })
      .eq('id', checkoutSessionId)
  }

  if (newStatus === 'paid') {
    const now = new Date()
    const interval = String(sessionRow.billing_interval || 'month')
    const end = addInterval(now, interval)

    const billingAmount = interval === 'year'
      ? Number(sessionRow.annual_price_after || 0)
      : Number(sessionRow.monthly_price || 0)

    const billingDiscountPercent = interval === 'year'
      ? Number(sessionRow.annual_discount_percent || 0)
      : null

    await supabase
      .from('subscriptions')
      .upsert({
        enterprise_id: sessionRow.enterprise_id,
        plan_id: sessionRow.plan_id,
        status: 'active',
        start_date: now.toISOString(),
        end_date: end.toISOString(),
        billing_interval: interval,
        billing_discount_percent: billingDiscountPercent,
        billing_amount: billingAmount,
        updated_at: now.toISOString()
      }, { onConflict: 'enterprise_id' })
  }

  setResponseStatus(event, 200)
  return { ok: true }
})

