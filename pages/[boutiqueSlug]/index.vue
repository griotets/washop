<template>
  <div class="min-h-screen bg-gray-50">
    <CatalogHeader :store="storeInfo" />
    
    <main class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <!-- Hero Section -->
      <div v-if="appearance.bannerText || storeInfo.name" class="relative overflow-hidden rounded-2xl bg-white shadow-sm mb-12">
        <div class="absolute inset-0 bg-gradient-to-r from-gray-900/10 to-gray-900/5"></div>
        <div class="relative px-6 py-12 sm:px-12 sm:py-16 text-center sm:text-left">
          <h1 class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
            <span class="block text-primary" :style="{ color: appearance.primary }">{{ storeInfo.name || 'Bienvenue' }}</span>
            <span class="block text-xl sm:text-2xl mt-2 font-medium text-gray-600">{{ appearance.bannerText || 'Découvrez nos produits' }}</span>
          </h1>
          <div v-if="appearance.bannerLink" class="mt-8">
            <a :href="appearance.bannerLink" target="_blank" class="inline-flex items-center justify-center rounded-lg border border-transparent px-6 py-3 text-base font-medium text-white shadow-sm hover:opacity-90 transition-opacity" :style="{ backgroundColor: appearance.primary }">
              En savoir plus
            </a>
          </div>
        </div>
      </div>

      <!-- Categories Navigation (Sticky) -->
      <div v-if="categories.length > 0" class="sticky top-16 z-40 -mx-4 px-4 sm:mx-0 sm:px-0 mb-8 overflow-x-auto bg-gray-50/95 backdrop-blur py-2">
        <div class="flex space-x-2 sm:space-x-4 min-w-max">
          <button 
            @click="scrollToCategory('all')"
            class="rounded-full px-4 py-2 text-sm font-medium transition-colors"
            :class="activeCategory === 'all' ? 'text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100 border'"
            :style="activeCategory === 'all' ? { backgroundColor: appearance.primary } : {}"
          >
            Tous
          </button>
          <button 
            v-for="cat in categories" 
            :key="cat.id"
            @click="scrollToCategory(cat.id)"
            class="rounded-full px-4 py-2 text-sm font-medium transition-colors"
            :class="activeCategory === cat.id ? 'text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100 border'"
            :style="activeCategory === cat.id ? { backgroundColor: appearance.primary } : {}"
          >
            {{ cat.name }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-20">
        <div class="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-primary" :style="{ borderTopColor: appearance.primary }"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex flex-col items-center justify-center py-20 text-center">
        <div class="rounded-full bg-red-100 p-3 text-red-600 mb-4">
          <AlertCircle class="h-8 w-8" />
        </div>
        <h3 class="text-lg font-medium text-gray-900">Une erreur est survenue</h3>
        <p class="mt-2 text-gray-500">{{ error }}</p>
        <button @click="reloadPage" class="mt-6 rounded-lg px-6 py-2 text-white hover:opacity-90 transition-opacity" :style="{ backgroundColor: appearance.primary }">
          Réactualiser la page
        </button>
      </div>

      <div v-else class="space-y-16">
        <div v-for="group in productGroups" :key="group.categoryId" :id="`category-${group.categoryId}`" class="scroll-mt-32">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-gray-900">{{ group.categoryName }}</h2>
            <span class="text-sm text-gray-500">{{ group.products.length }} produits</span>
          </div>
          
          <div class="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
            <div v-for="product in group.products" :key="product.id" class="group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-md">
              <div class="aspect-square w-full overflow-hidden bg-gray-200 relative">
                <img 
                  :src="getProductImage(product)" 
                  :alt="product.name" 
                  class="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                />
                <div class="absolute top-2 right-2 transition-opacity" :class="getCartQuantity(product.id) > 0 ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'">
                  <div v-if="getCartQuantity(product.id) > 0" class="flex items-center gap-2 rounded-full bg-white p-1 shadow">
                    <button @click.prevent="handleUpdateQuantity(product, -1)" class="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">-</button>
                    <span class="text-sm font-semibold">{{ getCartQuantity(product.id) }}</span>
                    <button @click.prevent="handleUpdateQuantity(product, 1)" class="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white hover:brightness-110" :style="{ backgroundColor: appearance.primary }">+</button>
                  </div>
                  <button v-else @click.prevent="addToCart(product)" class="p-2 rounded-full bg-white shadow text-gray-900 hover:text-primary transition-colors" title="Ajouter au panier">
                    <ShoppingCart class="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div class="flex flex-1 flex-col p-4">
                <h3 class="text-base font-semibold text-gray-900">
                  <NuxtLink :to="`/${slug}/product/${product.id}`">
                    <span aria-hidden="true" class="absolute inset-0" />
                    {{ product.name }}
                  </NuxtLink>
                </h3>
                <p class="mt-1 text-sm text-gray-500 line-clamp-2">{{ product.description }}</p>
                <div class="mt-4 flex flex-1 items-end justify-between">
                  <div class="flex flex-col">
                    <p class="text-lg font-bold text-gray-900">{{ formatPrice(product.price) }}</p>
                    <p v-if="product.original_price > product.price" class="text-sm text-gray-500 line-through">{{ formatPrice(product.original_price) }}</p>
                  </div>
                  <div v-if="product.is_out_of_stock" class="rounded bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-800">
                    Épuisé
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="products.length === 0" class="text-center py-20 bg-white rounded-xl shadow-sm">
          <div class="mx-auto h-12 w-12 text-gray-400 mb-4">
            <PackageSearch class="h-12 w-12" />
          </div>
          <h3 class="text-lg font-medium text-gray-900">Aucun produit trouvé</h3>
          <p class="mt-2 text-gray-500">Cette boutique n'a pas encore ajouté de produits.</p>
        </div>
      </div>
    </main>

    <CatalogFooter />
    
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
            Fermer
          </button>
          <a v-if="popupLink" :href="popupLink" target="_blank" class="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90 focus:outline-none" :style="{ backgroundColor: appearance.primary }">
            Découvrir
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { SupabaseClient } from '@supabase/supabase-js'
import { ShoppingCart, PackageSearch, X, AlertCircle } from 'lucide-vue-next'
import { useCartStore } from '~/stores/cart'

const route = useRoute()
const nuxt = useNuxtApp()
const supabase = nuxt.$supabase as SupabaseClient
const cart = useCartStore()

const slug = computed(() => String(route.params['boutiqueSlug'] || ''))
const loading = ref(true)
const activeCategory = ref('all')

// State
const storeInfo = reactive({
  id: '',
  name: '',
  description: '',
  logoUrl: '',
  phone: '',
  color: '#25D366'
})

const appearance = reactive({
  primary: '#25D366',
  background: '#ffffff',
  bannerText: '',
  bannerLink: '',
  popupEnabled: false,
  popupTitle: '',
  popupDescription: '',
  popupLink: ''
})

const categories = ref<any[]>([])
const products = ref<any[]>([])
const showPopup = ref(false)

// Computed
const productGroups = computed(() => {
  const groups: Record<string, any[]> = {}
  const categoryMap: Record<string, string> = {}
  
  categories.value.forEach(c => {
    categoryMap[c.id] = c.name
    groups[c.id] = []
  })
  
  // Add "Uncategorized" if needed, or handle products with null category
  const uncategorizedKey = 'uncategorized'
  
  products.value.forEach(p => {
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
      categoryName: id === uncategorizedKey ? 'Autres' : (categoryMap[id] || 'Inconnu'),
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

const popupTitle = computed(() => appearance.popupTitle || 'Offre spéciale')
const popupDescription = computed(() => appearance.popupDescription || 'Profitez de nos offres exclusives.')
const popupLink = computed(() => appearance.popupLink || '')

// Methods
function formatPrice(price: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(price)
}

function getCartQuantity(productId: string | number) {
  const item = cart.items.find(i => i.id === String(productId))
  return item ? item.quantity : 0
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
  const currentQty = getCartQuantity(product.id)
  const newQty = currentQty + delta
  
  if (newQty < 0) return

  // Check Max Order Qty
  if (product.max_order_qty > 0 && newQty > product.max_order_qty) {
    const toast = useToast()
    toast.error(`Maximum ${product.max_order_qty} unités pour ce produit`)
    return
  }

  // Check Stock
  if (product.track_inventory && newQty > product.stock_quantity) {
    const toast = useToast()
    toast.error(`Stock insuffisant (Max: ${product.stock_quantity})`)
    return
  }
  
  if (currentQty === 0 && delta > 0) {
    cart.add({
      id: String(product.id),
      name: product.name,
      price: product.price,
      image: getProductImage(product)
    })
  } else {
    cart.setQuantity(String(product.id), newQty)
  }
}

function addToCart(product: any) {
  handleUpdateQuantity(product, 1)
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
      error.value = 'Le chargement prend trop de temps. Veuillez rafraîchir la page.'
    }
  }, 50000)

  try {
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
      .select('id,name,image_url,phone,color') // removed description
      .eq('slug', slug.value)
      .maybeSingle()

    if (storeError) {
      console.error('Error fetching store:', storeError)
      const toast = useToast()
      toast.error('Erreur chargement boutique: ' + storeError.message)
      error.value = storeError.message
      loading.value = false
      return
    }

    if (!store) {
      console.error('Store not found')
      error.value = 'Boutique introuvable'
      return
    }

    storeInfo.id = store.id
    storeInfo.name = store.name
    storeInfo.description = '' 
    storeInfo.logoUrl = store.image_url
    storeInfo.phone = store.phone
    if (store.color) {
      storeInfo.color = store.color
      appearance.primary = store.color
    }

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

    // Handle Popup
    const shown = localStorage.getItem(`popupShown:${slug.value}`)
    if (appearance.popupEnabled && !shown) {
      setTimeout(() => { showPopup.value = true }, 2000)
    }

  } catch (e) {
    console.error(e)
    error.value = 'Une erreur inattendue est survenue'
  } finally {
    clearTimeout(timeout)
    loading.value = false
  }
})

useHead({
  title: computed(() => `${storeInfo.name || 'Boutique'} | Catalogue`)
})
</script>
