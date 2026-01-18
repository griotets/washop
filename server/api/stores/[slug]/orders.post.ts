import { getServerSupabase } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const supabase = await getServerSupabase()
  const slug = String(event.context.params?.slug || '').trim()

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Missing store slug' })
  }

  const body = await readBody(event)
  const customer = body?.customer || {}
  const items = Array.isArray(body?.items) ? body.items : []
  const delivery = body?.delivery || {}
  const paymentMethod = String(body?.paymentMethod || '').trim()

  if (!customer.name || !customer.phone) {
    throw createError({ statusCode: 400, statusMessage: 'Missing customer name or phone' })
  }

  if (!items.length) {
    throw createError({ statusCode: 400, statusMessage: 'Order items are required' })
  }

  const { data: store, error: storeError } = await supabase
    .from('stores')
    .select('id,currency')
    .eq('slug', slug)
    .maybeSingle()

  if (storeError) {
    throw createError({ statusCode: 500, statusMessage: storeError.message })
  }

  if (!store) {
    throw createError({ statusCode: 404, statusMessage: 'Store not found' })
  }

  let clientId: string | null = null

  const { data: existingClient, error: clientError } = await supabase
    .from('clients')
    .select('id')
    .eq('store_id', store.id)
    .eq('phone', String(customer.phone))
    .maybeSingle()

  if (clientError) {
    throw createError({ statusCode: 500, statusMessage: clientError.message })
  }

  if (existingClient) {
    clientId = existingClient.id as string
  } else {
    const { data: newClient, error: newClientError } = await supabase
      .from('clients')
      .insert({
        store_id: store.id,
        name: String(customer.name),
        phone: String(customer.phone),
        email: customer.email ? String(customer.email) : null,
        address: delivery?.address ? String(delivery.address) : null
      })
      .select('id')
      .maybeSingle()

    if (newClientError) {
      throw createError({ statusCode: 500, statusMessage: newClientError.message })
    }

    clientId = (newClient as any)?.id || null
  }

  const productIds = Array.from(
    new Set(
      items
        .map((i: any) => i.productId)
        .filter((v: any) => v !== null && v !== undefined)
        .map((v: any) => Number(v))
        .filter((v: number) => Number.isFinite(v))
    )
  )

  if (!productIds.length) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid product ids' })
  }

  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id,store_id,name,price')
    .in('id', productIds)
    .eq('store_id', store.id)

  if (productsError) {
    throw createError({ statusCode: 500, statusMessage: productsError.message })
  }

  const productsMap = new Map<number, any>()
  for (const p of products || []) {
    productsMap.set(Number((p as any).id), p)
  }

  const variantIds = Array.from(
    new Set(
      items
        .map((i: any) => i.variantId)
        .filter((v: any) => v !== null && v !== undefined)
        .map((v: any) => Number(v))
        .filter((v: number) => Number.isFinite(v))
    )
  )

  let variantsMap = new Map<number, any>()

  if (variantIds.length) {
    const { data: variants, error: variantsError } = await supabase
      .from('variants')
      .select('id,product_id,name,price')
      .in('id', variantIds)

    if (variantsError) {
      throw createError({ statusCode: 500, statusMessage: variantsError.message })
    }

    variantsMap = new Map<number, any>()
    for (const v of variants || []) {
      variantsMap.set(Number((v as any).id), v)
    }
  }

  let totalAmount = 0
  const itemsPayload: any[] = []

  for (const raw of items) {
    const quantity = Number(raw.quantity || 0)
    const productId = Number(raw.productId)
    const variantId = raw.variantId !== undefined && raw.variantId !== null ? Number(raw.variantId) : null

    if (!Number.isFinite(quantity) || quantity <= 0 || !Number.isFinite(productId)) {
      continue
    }

    const product = productsMap.get(productId)
    if (!product) {
      continue
    }

    let unitPrice = Number(product.price || 0)
    let productName = String(product.name || '')

    if (variantId !== null && Number.isFinite(variantId)) {
      const variant = variantsMap.get(variantId)
      if (variant) {
        unitPrice = Number(variant.price || unitPrice)
        const vName = String(variant.name || '')
        if (vName) {
          productName = `${productName} - ${vName}`
        }
      }
    }

    const lineTotal = unitPrice * quantity
    totalAmount += lineTotal

    itemsPayload.push({
      product_id: productId,
      variant_id: variantId,
      product_name: productName,
      unit_price: unitPrice,
      quantity,
      options: raw.options || null
    })
  }

  if (!itemsPayload.length) {
    throw createError({ statusCode: 400, statusMessage: 'No valid items' })
  }

  const deliveryMethod = String(delivery.method || 'delivery')
  const deliveryAddress = String(delivery.address || '')
  const city = String(delivery.city || '')
  const note = String(delivery.note || '')

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      store_id: store.id,
      client_id: clientId,
      customer_name: String(customer.name),
      customer_phone: String(customer.phone),
      customer_email: customer.email ? String(customer.email) : null,
      delivery_address: deliveryAddress || null,
      city: city || null,
      total_amount: totalAmount,
      delivery_fee: 0,
      status: 'new',
      note: note || null,
      delivery_method: deliveryMethod as any,
      whatsapp_message: paymentMethod ? `payment_method:${paymentMethod}` : null
    })
    .select('id,store_id,total_amount,status,created_at')
    .maybeSingle()

  if (orderError || !order) {
    throw createError({ statusCode: 500, statusMessage: orderError?.message || 'Failed to create order' })
  }

  const orderItemsPayload = itemsPayload.map((i) => ({
    ...i,
    order_id: order.id
  }))

  const { error: itemsError } = await supabase.from('order_items').insert(orderItemsPayload)

  if (itemsError) {
    throw createError({ statusCode: 500, statusMessage: itemsError.message })
  }

  return {
    id: order.id,
    store_id: order.store_id,
    total_amount: order.total_amount,
    status: order.status,
    created_at: order.created_at
  }
})
