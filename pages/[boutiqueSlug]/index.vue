<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <CatalogHeader v-if="canRenderCatalog" :store="storeInfo" />
    
    <div v-if="loading" class="flex-grow flex items-center justify-center min-h-[60vh]">
      <div class="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-primary"></div>
    </div>
    
    <div v-else-if="error" class="flex-grow flex flex-col items-center justify-center py-20 text-center">
      <div class="rounded-full bg-red-100 p-3 text-red-600 mb-4">
        <AlertCircle class="h-8 w-8" />
      </div>
      <h3 class="text-lg font-medium text-gray-900">{{ t('storefront.errorTitle') }}</h3>
      <p class="mt-2 text-gray-500">{{ error }}</p>
      <button @click="reloadPage" class="mt-6 rounded-lg px-6 py-2 text-white hover:opacity-90 transition-opacity" :style="{ backgroundColor: appearance.primary }">
        {{ t('storefront.reload') }}
      </button>
    </div>
    
    <main v-if="canRenderCatalog" class="flex-grow mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full">
      <!-- Hero Section -->
      <div class="relative overflow-hidden rounded-2xl bg-white shadow-sm mb-12">
        <div class="absolute inset-0 bg-gradient-to-r from-gray-900/10 to-gray-900/5"></div>
        <div class="relative px-6 py-12 sm:px-12 sm:py-16 text-center sm:text-left">
          <h1 class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
            <span class="block text-primary" :style="{ color: appearance.primary }">{{ storeInfo.name || t('storefront.welcome') }}</span>
            <span v-if="appearance.bannerEnabled && appearance.bannerText" class="block text-xl sm:text-2xl mt-2 font-medium text-gray-600">{{ appearance.bannerText }}</span>
            <span v-else-if="!appearance.bannerEnabled" class="block text-xl sm:text-2xl mt-2 font-medium text-gray-600">{{ t('storefront.discoverProducts') }}</span>
          </h1>
          <div v-if="appearance.bannerEnabled && (appearance.bannerBtnText || appearance.bannerLink)" class="mt-8">
            <a :href="appearance.bannerLink || '#'" target="_blank" class="inline-flex items-center justify-center rounded-lg border border-transparent px-6 py-3 text-base font-medium text-white shadow-sm hover:opacity-90 transition-opacity" :style="{ backgroundColor: appearance.primary }">
              {{ appearance.bannerBtnText || t('common.learnMore') }}
            </a>
          </div>
        </div>
      </div>

      <!-- Search Bar -->
      <div class="relative mb-8 max-w-lg mx-auto">
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <Search class="h-5 w-5 text-gray-400" />
        </div>
        <input 
          v-model="searchQuery" 
          type="text" 
          class="block w-full rounded-full border-gray-200 pl-11 pr-4 py-3 text-sm focus:border-primary focus:ring-primary shadow-sm transition-shadow hover:shadow-md"
          :placeholder="t('storefront.searchPlaceholder', { store: storeInfo.name || t('storefront.storeFallback') })"
          :style="{ '--tw-ring-color': appearance.primary, '--tw-border-opacity': '1' }"
        />
      </div>

      <!-- Categories Navigation (Sticky) -->
      <StorefrontCategoryNav
        v-if="categories.length > 0"
        :categories="categories"
        :active-category="activeCategory"
        :primary-color="appearance.primary"
        @select="scrollToCategory"
      />

      <div class="space-y-16">
        <div v-for="group in productGroups" :key="group.categoryId" :id="`category-${group.categoryId}`" class="scroll-mt-32">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-900">{{ group.categoryName }}</h2>
            <span class="text-sm text-gray-500">{{ t('storefront.productsCount', { n: group.products.length }) }}</span>
          </div>
          
          <div class="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
            <StorefrontProductCard
              v-for="product in group.products"
              :key="product.id"
              :product="product"
              :cart-quantity="getCartQuantity(product.id)"
              :primary-color="appearance.primary"
              :store-slug="slug"
              :available="isProductAvailable(product)"
              @update-quantity="(delta) => handleUpdateQuantity(product, delta)"
            />
          </div>
        </div>

        <div v-if="productGroups.length === 0 && searchQuery" class="text-center py-20 bg-white rounded-xl shadow-sm">
          <div class="mx-auto h-12 w-12 text-gray-400 mb-4">
            <Search class="h-12 w-12 opacity-50" />
          </div>
          <h3 class="text-lg font-medium text-gray-900">{{ t('storefront.noResultsTitle') }}</h3>
          <p class="mt-2 text-gray-500">{{ t('storefront.noResultsDesc', { query: searchQuery }) }}</p>
          <button @click="searchQuery = ''" class="mt-4 font-medium hover:underline" :style="{ color: appearance.primary }">
            {{ t('storefront.clearSearch') }}
          </button>
        </div>

        <div v-if="products.length === 0" class="text-center py-20 bg-white rounded-xl shadow-sm">
          <div class="mx-auto h-12 w-12 text-gray-400 mb-4">
            <PackageSearch class="h-12 w-12" />
          </div>
          <h3 class="text-lg font-medium text-gray-900">{{ t('storefront.noProductsTitle') }}</h3>
          <p class="mt-2 text-gray-500">{{ t('storefront.noProductsDesc') }}</p>
        </div>
      </div>
    </main>
    
    <!-- Popup -->
    <!-- Footer -->
    <CatalogFooter v-if="canRenderCatalog" :social="storeInfo.social" />
    <WhatsAppFloatButton v-if="canRenderCatalog" :phone="storeInfo.phone" :visible="appearance.showWhatsappButton" />

    <!-- Popup -->
    <div v-if="showPopup" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium leading-6 text-gray-900">{{ popupTitle }}</h3>
          <button class="rounded-full p-1 hover:bg-gray-100 transition-colors" @click="closePopup">
            <X class="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div class="mt-2">
          <p class="text-sm text-gray-500">{{ popupDescription }}</p>
        </div>
        <div class="mt-6 flex justify-end gap-3">
          <button type="button" class="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none" @click="closePopup">
            {{ t('common.close') }}
          </button>
          <a v-if="popupLink" :href="popupLink" target="_blank" class="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90 focus:outline-none" :style="{ backgroundColor: appearance.primary }">
            {{ t('storefront.discover') }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { SupabaseClient } from '@supabase/supabase-js'
import { Search, PackageSearch, X, AlertCircle } from 'lucide-vue-next'
import { useCartStore } from '~/stores/cart'
import { useI18n } from '~/composables/i18n'
import { showError, createError } from '#app'
const { t, locale } = useI18n()

const route = useRoute()
const nuxt = useNuxtApp()
const supabase = nuxt.$supabase as SupabaseClient
const cart = useCartStore()

const slug = computed(() => String(route.params['boutiqueSlug'] || ''))
const loading = ref(true)
const activeCategory = ref('all')
const searchQuery = ref('')

// State
const storeInfo = reactive({
  id: '',
  name: '',
  description: '',
  logoUrl: '',
  phone: '',
  color: '#25D366',
  social: {
    whatsapp: '',
    facebook: '',
    instagram: '',
    telegram: ''
  }
})

const appearance = reactive({
  primary: '#25D366',
  background: '#ffffff',
  bannerEnabled: false,
  bannerText: '',
  bannerBtnText: '',
  bannerLink: '',
  popupEnabled: false,
  popupTitle: '',
  popupDescription: '',
  popupLink: '',
  showWhatsappButton: false
})

const categories = ref<any[]>([])
const products = ref<any[]>([])
const showPopup = ref(false)
const variantAvailability = ref<Record<string, boolean>>({})

// Computed
const canRenderCatalog = computed(() => !loading.value && !error.value && !!storeInfo.id)

const filteredProducts = computed(() => {
  if (!searchQuery.value || !searchQuery.value.trim()) return products.value
  const q = searchQuery.value.toLowerCase()
  return products.value.filter(p => 
    (p.name && p.name.toLowerCase().includes(q)) || 
    (p.description && p.description.toLowerCase().includes(q))
  )
})

const productGroups = computed(() => {
  const groups: Record<string, any[]> = {}
  const categoryMap: Record<string, string> = {}
  
  categories.value.forEach(c => {
    categoryMap[c.id] = c.name
    groups[c.id] = []
  })
  
  // Add "Uncategorized" if needed, or handle products with null category
  const uncategorizedKey = 'uncategorized'
  
  filteredProducts.value.forEach(p => {
    const catId = p.category_id || uncategorizedKey
    if (groups[catId] === undefined && catId === uncategorizedKey) {
       groups[catId] = []
    }
    if (groups[catId]) {
      groups[catId].push(p)
    }
  })

  // Convert to array and filter empty
  const result = Object.entries(groups)
    .map(([id, items]) => ({
      categoryId: id,
      categoryName: id === uncategorizedKey ? t('storefront.otherCategory') : (categoryMap[id] || t('storefront.unknownCategory')),
      products: items
    }))
    .filter(g => g.products.length > 0)
    
  // Sort: defined categories first (in order), then others
  const catOrder = categories.value.map(c => String(c.id))
  
  return result.sort((a, b) => {
    if (a.categoryId === uncategorizedKey) return 1
    if (b.categoryId === uncategorizedKey) return -1
    
    const ia = catOrder.indexOf(a.categoryId)
    const ib = catOrder.indexOf(b.categoryId)
    
    // If both found, sort by index. If one not found (shouldn't happen for known cats), push to end.
    if (ia !== -1 && ib !== -1) return ia - ib
    if (ia !== -1) return -1
    if (ib !== -1) return 1
    
    return 0
  })
})

const popupTitle = computed(() => appearance.popupTitle || t('storefront.popupTitleFallback'))
const popupDescription = computed(() => appearance.popupDescription || t('storefront.popupDescFallback'))
const popupLink = computed(() => appearance.popupLink || '')

watch(() => route.query.q, (newQ) => {
  searchQuery.value = newQ ? String(newQ) : ''
}, { immediate: true })

// Methods
function getCartQuantity(productId: string | number) {
  const pid = String(productId)
  return cart.items
    .filter(i => i.id === pid || i.id.startsWith(pid + '|') || i.productId === pid)
    .reduce((sum, i) => sum + i.quantity, 0)
}

function getProductImage(product: any) {
  if (Array.isArray(product.images) && product.images.length > 0) {
    return product.images[0]
  }
  if (typeof product.images === 'string') {
    try {
      const parsed = JSON.parse(product.images)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed[0]
    } catch {}
  }
  return 'https://via.placeholder.com/300?text=No+Image'
}

function scrollToCategory(catId: string) {
  activeCategory.value = catId
  if (catId === 'all') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  const el = document.getElementById(`category-${catId}`)
  if (el) {
    const headerOffset = 140
    const elementPosition = el.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
  }
}

function handleUpdateQuantity(product: any, delta: number) {
  const pid = String(product.id)
  const totalQty = getCartQuantity(product.id)
  
  // New Total Calculation for Check
  const newTotalQty = totalQty + delta
  const maxQty = Number(product.max_order_quantity || product.max_order_qty || 0)
  
  if (newTotalQty < 0) return

  // Check Max Order Qty (Global for product)
  if (maxQty > 0 && newTotalQty > maxQty) {
    const toast = useToast()
    toast.error(t('storefront.maxQtyError', { max: maxQty }))
    return
  }

  // Check Stock (Global)
  // Note: This is a loose check. Variants might have their own stock.
  // But for catalog "quick add", we check base product stock or sum?
  // If track_inventory is true on product, it usually means base stock.
  // If variants track inventory, product.track_inventory might be false or true depending on setup.
  // We'll trust the product level check for now, but it might be inaccurate for variants.
  if (product.track_inventory && newTotalQty > product.stock_quantity) {
    const toast = useToast()
    toast.error(t('storefront.stockError', { max: product.stock_quantity }))
    return
  }
  
  // Find Base Item (exact match)
  const baseItem = cart.items.find(i => i.id === pid)
  const baseQty = baseItem ? baseItem.quantity : 0

  if (delta > 0) {
    // ADDING
    if (baseItem) {
      cart.setQuantity(pid, baseQty + delta)
    } else {
      // Create new base item
      cart.add({
        id: pid,
        productId: pid,
        name: product.name,
        price: product.price,
        image: getProductImage(product)
      })
      const pMin = Number(product.min_order_quantity || product.min_order_qty || 0)
      const minQty = pMin > 0 ? pMin : 1
      if (minQty > 1) {
        // If we just added 1 (via add), set to minQty
        cart.setQuantity(pid, minQty)
        const toast = useToast()
        toast.error(t('storefront.minQtyError', { min: minQty }))
      }
    }
  } else {
    // REMOVING
    if (baseQty > 0) {
      // We can remove from base item
      // Ensure we don't go below 0 (handled by setQuantity logic usually, but let's be safe)
      const target = baseQty + delta
      cart.setQuantity(pid, target)
    } else {
      // No base item to remove from, but totalQty > 0 implies variants exist.
      const toast = useToast()
      // Fallback message since we don't have a specific key for this edge case
      toast.info("Veuillez modifier les variantes directement dans le panier")
    }
  }
}

function isProductAvailable(product: any) {
  const v = variantAvailability.value[String(product.id)]
  const base = !product.is_out_of_stock
  if (v === undefined) return base
  return base && v
}

function closePopup() {
  showPopup.value = false
  try { localStorage.setItem(`popupShown:${slug.value}`, '1') } catch {}
}

function reloadPage() {
  window.location.reload()
}

const error = ref<string | null>(null)

// Lifecycle
onMounted(async () => {
  // Safety timeout
  const timeout = setTimeout(() => {
    if (loading.value) {
      console.warn('Loading timed out')
      loading.value = false
      error.value = t('storefront.timeoutError')
    }
  }, 50000)

  try {
    cart.load(slug.value)
    // Load local design override first (optional)
    const raw = localStorage.getItem(`design:${slug.value}`)
    if (raw) {
      const d = JSON.parse(raw)
      if (d.appearance) Object.assign(appearance, d.appearance)
    }

    // Check if slug is reserved or matches a known route (prevent catching /login, /register, etc if they slip through)
    const reserved = ['login', 'register', 'auth', 'admin', 'pricing', 'products', 'resources', 'changelog']
    if (reserved.includes(slug.value)) {
      console.warn('Reserved slug detected, ignoring store fetch:', slug.value)
      loading.value = false
      return
    }

    // Fetch Store
    console.log('Fetching store for slug:', slug.value)
    const { data: store, error: storeError } = await supabase
      .from('stores')
      .select('id,name,image_url,phone,color,social_whatsapp,social_facebook,social_instagram,social_telegram,design_settings') 
      .eq('slug', slug.value)
      .maybeSingle()

    if (storeError) {
      console.error('Error fetching store:', storeError)
      const toast = useToast()
      toast.error(t('storefront.loadStoreError', { msg: storeError.message }))
      error.value = storeError.message
      loading.value = false
      return
    }

    if (!store) {
      console.error('Store not found')
      showError(createError({ statusCode: 404, statusMessage: t('storefront.storeNotFound') }))
      return
    }

    console.log('Store fetched:', store)

    storeInfo.id = store.id
    storeInfo.name = store.name
    storeInfo.description = '' 
    storeInfo.logoUrl = store.image_url
    storeInfo.phone = store.phone
    storeInfo.social.whatsapp = store.social_whatsapp || ''
    storeInfo.social.facebook = store.social_facebook || ''
    storeInfo.social.instagram = store.social_instagram || ''
    storeInfo.social.telegram = store.social_telegram || ''

    if (store.color) {
      storeInfo.color = store.color
      appearance.primary = store.color
    }

    // Apply Design Settings
    if (store.design_settings) {
      console.log('Applying design settings:', store.design_settings)
      const ds = store.design_settings
      appearance.bannerEnabled = !!ds.banner_enabled
      appearance.bannerText = ds.banner_text || ''
      appearance.bannerBtnText = ds.banner_btn_text || ''
      appearance.bannerLink = ds.banner_link || ''
      
      appearance.popupEnabled = !!ds.popup_enabled
      appearance.popupTitle = ds.popup_title || ''
      appearance.popupDescription = ds.popup_description || ''
      appearance.popupLink = ds.popup_link || ''
      appearance.showWhatsappButton = !!ds.show_whatsapp_button

      // Handle Popup Display Logic
      if (appearance.popupEnabled) {
        const seen = localStorage.getItem(`popupShown:${slug.value}`)
        if (!seen) {
           // Delay slightly for better UX
           setTimeout(() => { showPopup.value = true }, 2000)
        }
      }
    } else {
      console.log('No design settings found in store record')
    }

    // Track Page View
    supabase.from('analytics_log').insert({
      store_id: store.id,
      event_type: 'page_view'
    }).then(({ error }) => { if(error) console.error('Track view error', error) })

    // Save to local storage for header usage (legacy compat)
    localStorage.setItem(`store:${slug.value}`, JSON.stringify(storeInfo))

    // Fetch Categories
    const { data: cats, error: catError } = await supabase
      .from('categories')
      .select('*')
      .eq('store_id', store.id)
      .order('name')
    
    if (catError) console.error('Error fetching categories:', catError)
    categories.value = cats || []

    // Fetch Products
    const { data: prods, error: prodError } = await supabase
      .from('products')
      .select('*')
      .eq('store_id', store.id)
      .eq('is_visible', true)
      .order('created_at', { ascending: false })
    
    if (prodError) console.error('Error fetching products:', prodError)
    products.value = prods || []

    if ((products.value || []).length > 0) {
      const ids = products.value.map(p => p.id)
      const { data: vars } = await supabase
        .from('variants')
        .select('product_id,track_inventory,stock_quantity,is_out_of_stock')
        .in('product_id', ids)
      const map: Record<string, boolean> = {};
      (vars || []).forEach(v => {
        const ok = !v.is_out_of_stock && (!v.track_inventory || Number(v.stock_quantity || 0) > 0)
        const key = String(v.product_id)
        map[key] = map[key] || ok
      })
      variantAvailability.value = map
    }

    // Handle Popup
    const shown = localStorage.getItem(`popupShown:${slug.value}`)
    if (appearance.popupEnabled && !shown) {
      setTimeout(() => { showPopup.value = true }, 2000)
    }

  } catch (e) {
    console.error(e)
    error.value = t('storefront.unexpectedError')
  } finally {
    clearTimeout(timeout)
    loading.value = false
  }
})

useHead({
  title: computed(() => `${storeInfo.name || t('storefront.storeTitleFallback')} | ${t('storefront.catalogTitle')}`)
})
</script>
