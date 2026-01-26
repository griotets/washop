import { getServerSupabase } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const supabase = await getServerSupabase()
  const { productIds, variantIds } = body

  let products = []
  let variants = []

  if (productIds && productIds.length > 0) {
    const { data, error } = await supabase
      .from('products')
      .select('id,track_inventory,stock_quantity,max_order_quantity,min_order_quantity,is_out_of_stock')
      .in('id', productIds)
    
    if (error) {
      console.error('Server Constraints Product Error:', error)
      throw createError({ statusCode: 500, statusMessage: error.message })
    }
    products = data || []
  }

  if (variantIds && variantIds.length > 0) {
    const { data, error } = await supabase
      .from('variants')
      .select('id,track_inventory,stock_quantity,max_order_quantity,is_out_of_stock')
      .in('id', variantIds)
      
    if (error) {
      console.error('Server Constraints Variant Error:', error)
      throw createError({ statusCode: 500, statusMessage: error.message })
    }
    variants = data || []
  }

  return { products, variants }
})
