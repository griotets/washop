<template>
  <div>
    <CatalogHeader />
    <main class="mx-auto max-w-6xl px-4 py-8">
      <div class="grid gap-8 lg:grid-cols-2">
        <div>
          <div class="relative overflow-hidden rounded-xl border bg-white">
            <div class="relative h-80">
              <div class="absolute inset-0 flex" :style="{ transform: `translateX(-${currentIndex*100}%)`, transition: dragging ? 'none' : 'transform 200ms ease' }" @mousedown="startDrag" @touchstart="startDrag" @mousemove="onDrag" @touchmove="onDrag" @mouseup="endDrag" @mouseleave="endDrag" @touchend="endDrag">
                <div v-for="(img,i) in images" :key="i" class="min-w-full">
                  <img :src="img" class="h-80 w-full object-cover bg-gray-100" />
                </div>
              </div>
            </div>
            <div class="flex items-center justify-between px-3 py-2">
              <div class="flex items-center gap-2">
                <button v-for="(img,i) in images" :key="i" class="h-10 w-10 rounded border" :class="i===currentIndex?'ring-2 ring-primary':''" @click="currentIndex=i">
                  <img :src="img" class="h-10 w-10 rounded object-cover bg-gray-100" />
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
                <img v-if="store.logoUrl" :src="store.logoUrl" class="h-10 w-10 rounded-full object-cover" />
                <span v-else class="text-xs font-semibold text-white">{{ storeInitials }}</span>
              </div>
              <div class="flex-1">
                <div class="font-semibold">{{ store.name || 'Boutique' }}</div>
                <div class="text-xs text-gray-500">en ligne</div>
              </div>
              <a v-if="waLink" :href="waLink" target="_blank" class="rounded bg-green-500 px-3 py-2 text-xs font-semibold text-white">WhatsApp</a>
            </div>
            <div class="mt-3">
              <div class="text-xl font-bold">{{ product.name || 'Produit' }}</div>
              <div class="mt-2 text-gray-700" style="white-space: pre-line">{{ product.description || '' }}</div>
              <div class="mt-3 text-lg font-semibold">FCFA {{ Number(product.price || 0).toLocaleString('fr-FR') }}</div>
              <div class="mt-4 flex flex-col gap-3">
                <button class="block w-full rounded bg-primary px-4 py-3 text-sm font-bold text-white shadow hover:brightness-110" @click="buyNow">
                  Acheter maintenant
                </button>
                <button class="block w-full rounded border border-primary px-4 py-3 text-sm font-bold text-primary hover:bg-primary/5" @click="addToCart">
                  Ajouter au panier
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
          <div class="font-semibold text-sm">{{ (popupBlock?.title) || 'Offre de bienvenue spéciale' }}</div>
          <button class="rounded border bg-white px-2 py-1 text-xs" @click="closePopup">Fermer</button>
        </div>
        <div class="mt-2 text-sm text-gray-700">{{ (popupBlock?.description) || 'Bénéficiez de 20 % de réduction sur votre premier achat.' }}</div>
        <div class="mt-3">
          <a v-if="popupBlock?.link" :href="popupBlock?.link" target="_blank" class="rounded bg-gray-900 px-3 py-2 text-sm text-white">Découvrir</a>
          <span v-else class="rounded border bg-white px-3 py-2 text-sm">Aucun lien</span>
        </div>
      </div>
    </div>
  </div>
  </template>
<script setup lang="ts">
import type { SupabaseClient } from '@supabase/supabase-js'
import { useCartStore } from '~/stores/cart'
const route = useRoute()
const cart = useCartStore()
const nuxt = useNuxtApp()
const supabase = nuxt.$supabase as SupabaseClient
const slug = computed(() => String(route.params['boutiqueSlug'] || ''))
const productId = computed(() => String(route.params.id || ''))
const showPopup = ref(false)
const popupBlock = ref<any>(null)
function closePopup() {
  showPopup.value = false
  try { localStorage.setItem(`popupShown:${slug.value}`, '1') } catch {}
}
const store = reactive<{ name?: string; logoUrl?: string; color?: string; phone?: string }>({})
const product = reactive<{ name?: string; description?: string; price?: number }>({})
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
const waLink = computed(() => {
  const phone = String(store.phone || '').trim()
  if (!phone) return ''
  const text = encodeURIComponent(`Bonjour, je suis intéressé par ${product.name || 'un produit'}.`)
  return `https://wa.me/${phone.replace(/\D/g, '')}?text=${text}`
})

function addToCart() {
  cart.add({
    id: productId.value,
    name: product.name || 'Produit',
    price: product.price || 0,
    image: images.value[0]
  })
}

function buyNow() {
  addToCart()
  navigateTo(`/${slug.value}/cart`)
}
onMounted(async () => {
  try {
    const raw = localStorage.getItem(`design:${slug.value}`)
    const d = raw ? JSON.parse(raw) : null
    const blocks = Array.isArray(d?.blocks) ? d.blocks : []
    popupBlock.value = blocks.find((b: any) => b?.type === 'popup') || null
    const shown = localStorage.getItem(`popupShown:${slug.value}`)
    showPopup.value = !!popupBlock.value && !shown
  } catch {}
  const { data: sone } = await supabase.from('stores').select('id,name,image_url,color,phone').eq('slug', slug.value).maybeSingle()
  const storeId = sone?.id
  store.name = String(sone?.name || '')
  store.logoUrl = String(sone?.image_url || '')
  store.color = String(sone?.color || '#111827')
  store.phone = String(sone?.phone || '')
  if (storeId) {
    const { data: p } = await supabase.from('products').select('name,description,price,images').eq('id', productId.value).eq('store_id', storeId).maybeSingle()
    product.name = String(p?.name || '')
    product.description = String(p?.description || '')
    product.price = Number(p?.price || 0)
    images.value = Array.isArray(p?.images) ? p?.images : (typeof p?.images === 'string' ? JSON.parse(p?.images || '[]') : [])
  }
})
useHead({ title: `Produit ${route.params.id} | Wa-Shop` })
</script>
