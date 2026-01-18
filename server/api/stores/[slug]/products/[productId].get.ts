import { getServerSupabase } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const supabase = await getServerSupabase()
  const slug = String(event.context.params?.slug || '').trim()
  const productIdParam = String(event.context.params?.productId || '').trim()

  if (!slug || !productIdParam) {
    throw createError({ statusCode: 400, statusMessage: 'Missing store slug or product id' })
  }

  const productId = Number(productIdParam)
  if (!Number.isFinite(productId)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid product id' })
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

  const { data: product, error: productError } = await supabase
    .from('products')
    .select('id,name,description,price,images,track_inventory,stock_quantity,max_order_quantity,min_order_quantity,is_out_of_stock')
    .eq('store_id', store.id)
    .eq('id', productId)
    .maybeSingle()

  if (productError) {
    throw createError({ statusCode: 500, statusMessage: productError.message })
  }

  if (!product) {
    throw createError({ statusCode: 404, statusMessage: 'Product not found' })
  }

  const { data: variants, error: variantsError } = await supabase
    .from('variants')
    .select('id,name,price,original_price,image_url,track_inventory,stock_quantity,max_order_quantity,is_out_of_stock')
    .eq('product_id', product.id)

  if (variantsError) {
    throw createError({ statusCode: 500, statusMessage: variantsError.message })
  }

  const { data: options, error: optionsError } = await supabase
    .from('options')
    .select('id,name,type,values,is_required')
    .eq('product_id', product.id)

  if (optionsError) {
    throw createError({ statusCode: 500, statusMessage: optionsError.message })
  }

  return {
    product,
    variants: Array.isArray(variants) ? variants : [],
    options: Array.isArray(options) ? options : []
  }
})

