import { hfChatRequest, MODEL_TEXT } from '~/server/utils/ai'
import { getServerSupabase } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const storeId = String(body?.storeId || '')
  const text = String(body?.text || '').trim()

  if (!storeId) {
    throw createError({ statusCode: 400, statusMessage: 'storeId requis' })
  }
  if (!text) {
    throw createError({ statusCode: 400, statusMessage: 'Texte requis' })
  }

  const supabase = await getServerSupabase()

  const { data: shop } = await supabase.from('stores').select('id,enterprise_id').eq('id', storeId).maybeSingle()
  if (!shop?.enterprise_id) {
    throw createError({ statusCode: 404, statusMessage: 'Boutique introuvable' })
  }

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('plan_id, plan:subscription_plans(*)')
    .eq('enterprise_id', shop.enterprise_id)
    .maybeSingle()

  const planId = sub?.plan_id || 'free'
  if (!planId || planId === 'free') {
    throw createError({ statusCode: 403, statusMessage: 'Fonctionnalité réservée au mode payant' })
  }

  function simpleParse(input: string) {
    const nameMatch = input.match(/(?:nom|produit|article)\s*[:\-]\s*(.+)/i)
    const priceMatch = input.match(/(\d[\d\s.,]*)\s*(?:fcfa|xaf|cfa)?/i)
    const images: string[] = []
    const urlRegex = /(https?:\/\/[^\s)]+(?:\.(?:png|jpg|jpeg|webp))?)/gi
    for (const m of input.matchAll(urlRegex)) images.push(m[1])
    const lines = input.split(/\r?\n/).map(s => s.trim()).filter(Boolean)
    const variants: any[] = []
    for (const l of lines) {
      const vm = l.match(/variante\s*[:\-]\s*(.+)/i)
      if (vm) {
        const vp = vm[1].match(/(\d[\d\s.,]*)\s*(?:fcfa|xaf|cfa)?/i)
        variants.push({
          name: vm[1].replace(/(\d[\d\s.,]*\s*(?:fcfa|xaf|cfa)?)/i, '').trim(),
          price: vp ? Number(String(vp[1]).replace(/[^\d.,]/g, '').replace(',', '.').replace(/\s/g, '')) : 0,
          original_price: 0,
          image_url: null
        })
      }
    }
    return {
      name: nameMatch ? nameMatch[1].trim() : '',
      price: priceMatch ? Number(String(priceMatch[1]).replace(/[^\d.,]/g, '').replace(',', '.').replace(/\s/g, '')) : 0,
      description: input,
      images,
      variants,
      options: [] as any[]
    }
  }

  let spec: any = null
  try {
    const prompt = `Analyse ce texte d'utilisateur et renvoie STRICTEMENT un JSON d'un produit e-commerce (sans texte autour).
Champs requis: 
name (string), 
price (number en FCFA), 
description (string),
images (array d'URL), 
variants (array d'objets: { name, price, original_price?, image_url? }), 
options (array d'objets: { name, type, values?, is_required? }).
Texte:
${text}
Si des infos manquent, déduis prudemment ou mets des valeurs raisonnables.`
    const raw = await hfChatRequest(MODEL_TEXT, [{ role: 'user', content: prompt }], { max_tokens: 500, temperature: 0.3 })
    const cleaned = String(raw || '').trim()
    spec = JSON.parse(cleaned)
  } catch (e) {
    spec = simpleParse(text)
  }

  const name = String(spec?.name || '').trim()
  const price = Number(spec?.price ?? 0)
  const description = String(spec?.description || '').trim()
  const images = Array.isArray(spec?.images) ? spec.images.filter((u: any) => typeof u === 'string').slice(0, 6) : []
  const variants = Array.isArray(spec?.variants) ? spec.variants : []
  const options = Array.isArray(spec?.options) ? spec.options : []

  if (!name) {
    throw createError({ statusCode: 422, statusMessage: 'Impossible de déterminer le nom du produit' })
  }

  const { data: inserted } = await supabase
    .from('products')
    .insert({
      store_id: storeId,
      name,
      price: Number.isFinite(price) ? price : 0,
      original_price: 0,
      type: 'physical',
      sku: '',
      description,
      images,
      track_inventory: false,
      stock_quantity: 0,
      is_visible: true,
      is_out_of_stock: false,
      daily_capacity: 0,
      max_order_quantity: 0,
      min_order_quantity: 0,
      tax_exempt: false,
      tax_exempt_reason: null,
      show_estimated_price: false,
      track_cost: false,
      cost_price: null,
      show_net_price: false,
      unit: 'PCS',
      unit_value: null,
      requires_shipping: true,
      delivery_methods: ['delivery', 'pickup']
    })
    .select('id')
    .maybeSingle()

  const pid = inserted?.id
  if (!pid) {
    throw createError({ statusCode: 500, statusMessage: 'Création du produit échouée' })
  }

  for (const v of variants) {
    await supabase.from('variants').insert({
      product_id: Number(pid),
      name: String(v?.name || '').trim() || 'Variante',
      price: Number(v?.price || 0),
      original_price: Number(v?.original_price || 0),
      image_url: v?.image_url || null
    })
  }

  for (const o of options) {
    const vals = Array.isArray(o?.values)
      ? o.values.map((s: any) => String(s)).filter(Boolean)
      : String(o?.values || '')
          .split(',')
          .map((s: string) => s.trim())
          .filter(Boolean)
    await supabase.from('options').insert({
      product_id: Number(pid),
      name: String(o?.name || '').trim() || 'Option',
      type: String(o?.type || 'text'),
      values: vals.length ? vals : null,
      is_required: !!o?.is_required
    })
  }

  return { id: pid }
})
