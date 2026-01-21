<template>
  <div>
    <CatalogHeader :store="store" />
    <main class="mx-auto max-w-6xl px-4 py-8">
      <div class="mb-6">
        <NuxtLink :to="`/${slug}`" class="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary transition-colors">
          <ArrowLeft class="h-4 w-4" />
          {{ t('checkout.backToStore') }}
        </NuxtLink>
      </div>
      <div class="grid gap-8 lg:grid-cols-2">
        <div>
          <div class="relative overflow-hidden rounded-xl border bg-white">
            <div class="relative h-80">
              <div class="absolute inset-0 flex" :style="{ transform: `translateX(-${currentIndex*100}%)`, transition: dragging ? 'none' : 'transform 200ms ease' }" @mousedown="startDrag" @touchstart="startDrag" @mousemove="onDrag" @touchmove="onDrag" @mouseup="endDrag" @mouseleave="endDrag" @touchend="endDrag">
                <div v-for="(img,i) in images" :key="i" class="min-w-full">
                  <NuxtImg :src="img" class="h-80 w-full object-cover bg-gray-100" />
                </div>
              </div>
            </div>
            <div class="flex items-center justify-between px-3 py-2">
              <div class="flex items-center gap-2">
                <button v-for="(img,i) in images" :key="i" class="h-10 w-10 rounded border" :class="i===currentIndex?'ring-2 ring-primary':''" @click="currentIndex=i">
                  <NuxtImg :src="img" class="h-10 w-10 rounded object-cover bg-gray-100" />
                </button>
              </div>
              <div class="text-xs text-gray-500">{{ currentIndex+1 }} / {{ images.length }}</div>
            </div>
          </div>
        </div>
        <div>
          <div class="rounded-xl border bg-white p-4">
            <div class="flex items-center gap-3 border-b pb-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-full" :style="{ backgroundColor: store.color || '#111827' }">
                <NuxtImg v-if="store.logoUrl" :src="store.logoUrl" class="h-10 w-10 rounded-full object-cover" />
                <span v-else class="text-xs font-semibold text-white">{{ storeInitials }}</span>
              </div>
              <div class="flex-1">
                <div class="font-semibold">{{ store.name || t('catalog.storeFallback') }}</div>
                <div class="text-xs text-gray-500">{{ t('storefront.online') }}</div>
              </div>
              <a v-if="waLink" :href="waLink" target="_blank" @click="trackWaClick" class="rounded bg-green-500 px-3 py-2 text-xs font-semibold text-white">{{ t('storefront.whatsapp') }}</a>
            </div>
            <div class="mt-3">
              <div class="text-xl font-bold">{{ product.name || t('storefront.productFallback') }}</div>
              <div class="mt-2 text-gray-700" style="white-space: pre-line">{{ product.description || '' }}</div>
              <div class="mt-3 text-lg font-semibold">XAF {{ Number(displayPrice || 0).toLocaleString(getNumberLocale()) }}</div>
              <div v-if="showStockHint" class="mt-1 text-xs font-semibold text-red-600">{{ t('product.stockLeft', { n: stockLeft }) }}</div>
              
              <div v-if="variants.length > 0" class="mt-4">
                <div class="mb-2 text-sm font-medium text-gray-700">{{ t('product.variants') }}</div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <label v-for="v in variants" :key="v.id" :class="['flex items-center gap-2 rounded border px-3 py-2', selectedVariantId===String(v.id) ? 'border-primary bg-primary/5' : 'border-gray-200', variantUnavailable(v) ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer']">
                    <input type="radio" class="sr-only" :value="String(v.id)" v-model="selectedVariantId" :disabled="variantUnavailable(v)" />
                    <NuxtImg v-if="v.image_url" :src="v.image_url" class="h-8 w-8 rounded object-cover bg-gray-100" />
                    <span class="font-medium text-sm">{{ v.name }}</span>
                    <span v-if="variantUnavailable(v)" class="rounded bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">{{ t('storefront.soldOut') }}</span>
                    <span class="ml-auto text-xs text-gray-600">XAF {{ Number(v.price || 0).toLocaleString(getNumberLocale()) }}</span>
                  </label>
                </div>
              </div>

              <div v-if="optionsList.length > 0" class="mt-4 space-y-4">
                <div class="text-sm font-medium text-gray-700">{{ t('product.options') }}</div>
                <div v-for="opt in optionsList" :key="opt.id" class="space-y-2">
                  <label class="block text-xs font-medium text-gray-600">
                    {{ opt.name }} <span v-if="opt.is_required" class="text-red-600">*</span>
                  </label>
                  
                  <select v-if="opt.type==='select'" v-model="selectedOptions[opt.name]" class="w-full rounded border-gray-300 px-3 py-2 focus:border-primary focus:ring-primary">
                    <option value="" disabled>{{ t('product.selectOption') }}</option>
                    <option v-for="val in (Array.isArray(opt.values)?opt.values:[])" :key="val" :value="val">{{ val }}</option>
                  </select>

                  <div v-else-if="opt.type==='multiselect' || opt.type==='checkbox'" class="flex flex-wrap gap-2">
                    <label v-for="val in (Array.isArray(opt.values)?opt.values:[])" :key="val" class="inline-flex items-center gap-2 text-sm">
                      <input type="checkbox" :value="val" v-model="selectedOptions[opt.name]" />
                      <span>{{ val }}</span>
                    </label>
                  </div>

                  <div v-else-if="opt.type==='color'" class="flex flex-wrap gap-2">
                    <label v-for="val in (Array.isArray(opt.values)?opt.values:[])" :key="val" class="cursor-pointer relative">
                      <input type="radio" :name="'opt-'+opt.id" :value="val" v-model="selectedOptions[opt.name]" class="peer sr-only" />
                      <span class="block h-8 w-8 rounded-full border border-gray-200 shadow-sm peer-checked:ring-2 peer-checked:ring-primary peer-checked:ring-offset-1" :style="{ backgroundColor: val }"></span>
                    </label>
                  </div>

                  <div v-else-if="opt.type==='radio'" class="flex flex-wrap gap-2">
                    <label v-for="val in (Array.isArray(opt.values)?opt.values:[])" :key="val" class="cursor-pointer">
                      <input type="radio" :name="'opt-'+opt.id" :value="val" v-model="selectedOptions[opt.name]" class="peer sr-only" />
                      <span class="block rounded border border-gray-200 px-3 py-1.5 text-sm font-medium peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white transition-colors">{{ val }}</span>
                    </label>
                  </div>

                  <input v-else-if="opt.type==='text'" v-model="selectedOptions[opt.name]" type="text" class="w-full rounded border-gray-300 px-3 py-2 focus:border-primary focus:ring-primary" />
                  
                  <input v-else-if="opt.type==='number'" v-model.number="selectedOptions[opt.name]" type="number" class="w-full rounded border-gray-300 px-3 py-2 focus:border-primary focus:ring-primary" />
                  
                  <input v-else-if="opt.type==='date'" v-model="selectedOptions[opt.name]" type="date" class="w-full rounded border-gray-300 px-3 py-2 focus:border-primary focus:ring-primary" />
                </div>
              </div>

              <div class="mt-4 flex flex-col gap-3">
                <button class="block w-full rounded bg-primary px-4 py-3 text-sm font-bold text-white shadow hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed" :disabled="isSelectedVariantUnavailable" @click="buyNow">
                  {{ t('storefront.buyNow') }}
                </button>
                <div v-if="getCartQuantity() > 0" class="flex items-center gap-3 rounded-lg border border-primary p-1">
                  <button class="flex h-10 w-12 items-center justify-center rounded-md bg-gray-100 font-bold hover:bg-gray-200" @click="handleUpdateQuantity(-1)">-</button>
                  <div class="flex-1 text-center font-bold text-lg">{{ getCartQuantity() }}</div>
                  <button class="flex h-10 w-12 items-center justify-center rounded-md bg-primary font-bold text-white hover:brightness-110" @click="handleUpdateQuantity(1)">+</button>
                </div>
                <button v-else-if="!isSelectedVariantUnavailable" class="block w-full rounded border border-primary px-4 py-3 text-sm font-bold text-primary hover:bg-primary/5" @click="addToCart">
                  {{ t('storefront.addToCart') }}
                </button>
                <button v-else class="block w-full rounded border border-red-300 px-4 py-3 text-sm font-bold text-red-600 bg-red-50" disabled>
                  {{ t('storefront.soldOut') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <CatalogFooter />

    <div v-if="showPopup" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div class="w-80 rounded-xl border bg-white p-4">
        <div class="flex items-center justify-between">
          <div class="font-semibold text-sm">{{ (popupBlock?.title) || t('storefront.welcomeOfferTitleFallback') }}</div>
          <button class="rounded border bg-white px-2 py-1 text-xs" @click="closePopup">{{ t('common.close') }}</button>
        </div>
        <div class="mt-2 text-sm text-gray-700">{{ (popupBlock?.description) || t('storefront.welcomeOfferDescFallback') }}</div>
        <div class="mt-3">
          <a v-if="popupBlock?.link" :href="popupBlock?.link" target="_blank" class="rounded bg-green-600 px-3 py-2 text-sm text-white">{{ t('storefront.discover') }}</a>
          <span v-else class="rounded border bg-white px-3 py-2 text-sm">{{ t('storefront.noLink') }}</span>
        </div>
      </div>
    </div>
  </div>
  </template>
<script setup lang="ts">
import type { SupabaseClient } from '@supabase/supabase-js'
import { useCartStore } from '~/stores/cart'
import { useToast } from '~/composables/useToast'
import { useI18n } from '~/composables/i18n'
const route = useRoute()
const cart = useCartStore()
const nuxt = useNuxtApp()
const supabase = nuxt.$supabase as SupabaseClient
const { t, locale } = useI18n()
const slug = computed(() => String(route.params['boutiqueSlug'] || ''))
const productId = computed(() => String(route.params.id || ''))
const showPopup = ref(false)
const popupBlock = ref<any>(null)
function closePopup() {
  showPopup.value = false
  try { localStorage.setItem(`popupShown:${slug.value}`, '1') } catch {}
}
const store = reactive<{ id?: string; name?: string; logoUrl?: string; color?: string; phone?: string }>({})
const product = reactive<{ 
  id?: string;
  name?: string; 
  description?: string; 
  price?: number;
  track_inventory?: boolean;
  stock_quantity?: number;
  max_order_quantity?: number;
  min_order_quantity?: number;
  is_out_of_stock?: boolean;
}>({})
const images = ref<string[]>([])
const currentIndex = ref(0)
const dragging = ref(false)
let startX = 0
function startDrag(e: MouseEvent | TouchEvent) {
  dragging.value = true
  startX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX
}
function onDrag(e: MouseEvent | TouchEvent) {
  if (!dragging.value) return
  const x = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX
  const dx = x - startX
  if (dx > 60) { currentIndex.value = Math.max(0, currentIndex.value - 1); startX = x }
  else if (dx < -60) { currentIndex.value = Math.min(images.value.length - 1, currentIndex.value + 1); startX = x }
}
function endDrag() { dragging.value = false }
const storeInitials = computed(() => (store.name || 'Boutique').split(/\s+/).map(s => s[0]).join('.'))
function getNumberLocale() {
  if (locale.value === 'fr') return 'fr-FR'
  if (locale.value === 'it') return 'it-IT'
  return 'en-US'
}
const waLink = computed(() => {
  const phone = String(store.phone || '').trim()
  if (!phone) return ''
  const text = encodeURIComponent(t('storefront.whatsappInterestedMsg', { name: product.name || t('storefront.productFallback') }))
  return `https://wa.me/${phone.replace(/\D/g, '')}?text=${text}`
})

const variants = ref<Array<{ id: number; name: string; price: number; original_price?: number; image_url?: string; track_inventory?: boolean; stock_quantity?: number; max_order_quantity?: number; is_out_of_stock?: boolean }>>([])
const selectedVariantId = ref<string>('')
const selectedVariant = computed(() => variants.value.find(v => String(v.id) === selectedVariantId.value))
const optionsList = ref<Array<{ id: number; name: string; type: string; values?: any; is_required?: boolean }>>([])
const selectedOptions = reactive<Record<string, any>>({})
const displayPrice = computed(() => selectedVariant.value ? (selectedVariant.value.price || 0) : (product.price || 0))
function variantUnavailable(v: any) {
  if (!v) return false
  if (v.is_out_of_stock) return true
  if (v.track_inventory && Number(v.stock_quantity || 0) <= 0) return true
  return false
}
const isSelectedVariantUnavailable = computed(() => variantUnavailable(selectedVariant.value))
const stockLeft = computed(() => {
  if (selectedVariant.value) return Number(selectedVariant.value.stock_quantity || 0)
  return Number(product.stock_quantity || 0)
})
const showStockHint = computed(() => {
  if (selectedVariant.value) return !!selectedVariant.value.track_inventory && stockLeft.value > 0 && stockLeft.value <= 5
  return !!product.track_inventory && stockLeft.value > 0 && stockLeft.value <= 5
})
function optionsSignature() {
  const keys = Object.keys(selectedOptions).sort()
  const obj: Record<string, any> = {}
  keys.forEach(k => obj[k] = selectedOptions[k])
  return JSON.stringify(obj)
}
const currentItemKey = computed(() => `${productId.value}|${selectedVariantId.value || ''}|${optionsSignature()}`)

function trackWaClick() {
  if (store.id) {
    supabase.from('analytics_log').insert({
      store_id: store.id,
      event_type: 'whatsapp_click'
    })
  }
}

function getCartQuantity() {
  const item = cart.items.find(i => i.id === currentItemKey.value)
  return item ? item.quantity : 0
}

function handleUpdateQuantity(delta: number) {
  console.log('handleUpdateQuantity', delta)
  const currentQty = getCartQuantity()
  const newQty = currentQty + delta
  
  if (newQty < 0) return

  // Check Max Order Qty
  const vMax = selectedVariant.value?.max_order_quantity || 0
  if ((vMax || 0) > 0 && newQty > (vMax || 0)) {
    const toast = useToast()
    toast.error(t('storefront.maxQtyError', { max: vMax }))
    return
  }
  if ((product.max_order_quantity || 0) > 0 && newQty > (product.max_order_quantity || 0)) {
    const toast = useToast()
    toast.error(t('storefront.maxQtyError', { max: product.max_order_quantity }))
    return
  }

  // Check Stock
  const vTrack = !!selectedVariant.value?.track_inventory
  const vStock = selectedVariant.value?.stock_quantity || 0
  if (vTrack && newQty > vStock) {
    const toast = useToast()
    toast.error(t('storefront.stockError', { max: vStock }))
    return
  }
  if (product.track_inventory && newQty > (product.stock_quantity || 0)) {
    const toast = useToast()
    toast.error(t('storefront.stockError', { max: product.stock_quantity }))
    return
  }
  
  if (currentQty === 0 && delta > 0) {
    console.log('Adding to cart:', productId.value)
    
    // Track Add to Cart
    if (store.id) {
       supabase.from('analytics_log').insert({
         store_id: store.id,
         event_type: 'add_to_cart'
       }).then(({ error }) => { if(error) console.error('Track add_to_cart error', error) })
    }

    const vName = selectedVariant.value?.name ? ` - ${selectedVariant.value.name}` : ''
    cart.add({
      id: currentItemKey.value,
      productId: productId.value,
      variantId: selectedVariantId.value || undefined,
      options: { ...selectedOptions },
      name: (product.name || t('storefront.productFallback')) + vName,
      price: displayPrice.value || 0,
      image: selectedVariant.value?.image_url || images.value[0]
    })
    const pMin = Number(product.min_order_quantity || 0)
    const minQty = pMin > 0 ? pMin : 1
    if (minQty > 1) {
      cart.setQuantity(currentItemKey.value, minQty)
      const toast = useToast()
      toast.error(t('storefront.minQtyError', { min: minQty }))
      return
    }
  } else {
    console.log('Updating quantity:', productId.value, newQty)
    cart.setQuantity(currentItemKey.value, newQty)
  }
}

function addToCart() {
  console.log('addToCart clicked')
  handleUpdateQuantity(1)
}

function buyNow() {
  if (getCartQuantity() === 0) addToCart()
  navigateTo(`/${slug.value}/cart`)
}

function shareProduct() {
  if (import.meta.server) return
  const url = window.location.href
  if (navigator.share) {
    navigator.share({
      title: product.name || 'Produit',
      text: product.description || '',
      url: url
    }).catch(() => {})
  } else {
    navigator.clipboard.writeText(url)
    const toast = useToast()
    toast.success(t('storefront.linkCopied'))
  }
}

shareProduct

onMounted(async () => {
  if (!supabase) return
  cart.load(slug.value)
  try {
    const raw = localStorage.getItem(`design:${slug.value}`)
    const d = raw ? JSON.parse(raw) : null
    const blocks = Array.isArray(d?.blocks) ? d.blocks : []
    popupBlock.value = blocks.find((b: any) => b?.type === 'popup') || null
    const shown = localStorage.getItem(`popupShown:${slug.value}`)
    showPopup.value = !!popupBlock.value && !shown
  } catch {}
  const { data: sone, error: sErr } = await supabase.from('stores').select('id,name,image_url,color,phone').eq('slug', slug.value).maybeSingle()
  if (sErr) {
    console.error(sErr)
    const toast = useToast()
    toast.error(t('storefront.loadStoreError', { msg: sErr.message }))
  }
  const storeId = sone?.id
  store.id = storeId
  store.name = String(sone?.name || '')
  store.logoUrl = String(sone?.image_url || '')
  store.color = String(sone?.color || '#111827')
  store.phone = String(sone?.phone || '')
  if (storeId) {
    const { data: p, error: pErr } = await supabase.from('products')
      .select('id,name,description,price,images,track_inventory,stock_quantity,max_order_quantity,min_order_quantity,is_out_of_stock')
      .eq('id', productId.value)
      .eq('store_id', storeId)
      .maybeSingle()
    if (pErr) {
      console.error(pErr)
      const toast = useToast()
      toast.error(t('storefront.loadProductError', { msg: pErr.message }))
    }
    product.id = String(p?.id || '')
    product.name = String(p?.name || '')
    product.description = String(p?.description || '')
    product.price = Number(p?.price || 0)
    product.track_inventory = !!p?.track_inventory
    product.stock_quantity = Number(p?.stock_quantity || 0)
    product.max_order_quantity = Number(p?.max_order_quantity || 0)
    product.min_order_quantity = Number((p as any)?.min_order_quantity || 0)
    product.is_out_of_stock = !!p?.is_out_of_stock
    images.value = Array.isArray(p?.images) ? p?.images : (typeof p?.images === 'string' ? JSON.parse(p?.images || '[]') : [])
    
    const { data: v, error: vErr } = await supabase.from('variants')
      .select('id,name,price,original_price,image_url,track_inventory,stock_quantity,max_order_quantity,is_out_of_stock')
      .eq('product_id', productId.value)
    if (vErr) console.error(vErr)
    variants.value = Array.isArray(v) ? v : []
    if (variants.value.length > 0) {
      selectedVariantId.value = String(variants.value[0].id)
    }

    const { data: opts, error: oErr } = await supabase.from('options')
      .select('id,name,type,values,is_required')
      .eq('product_id', productId.value)
    if (oErr) console.error(oErr)
    optionsList.value = Array.isArray(opts) ? opts : []
    optionsList.value.forEach(opt => {
      if (opt.type === 'checkbox' || opt.type === 'multiselect') selectedOptions[opt.name] = []
      else selectedOptions[opt.name] = ''
    })

    // Track Product View
    supabase.from('analytics_log').insert({
      store_id: storeId,
      event_type: 'product_view'
    }).then(({ error }) => { if(error) console.error('Track view error', error) })
  }
})
useHead({ title: `Produit ${route.params.id} | Wa-Shop` })
</script>
