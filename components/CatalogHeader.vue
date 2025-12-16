<template>
  <header class="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-full" :style="{ backgroundColor: color }">
          <img v-if="store.logoUrl" :src="store.logoUrl" alt="logo" class="h-10 w-10 rounded-full object-cover" />
          <span v-else class="text-xs font-semibold text-white">{{ initials }}</span>
        </div>
        <div class="font-semibold">{{ store.name || 'Boutique' }}</div>
      </div>
      <div class="flex items-center gap-4">
        <div class="hidden sm:flex items-center gap-2">
          <button :class="['px-2 py-1 rounded text-sm', locale==='fr' ? 'bg-primary text-white' : 'bg-gray-100']" @click="setLocale('fr')">FR</button>
          <button :class="['px-2 py-1 rounded text-sm', locale==='en' ? 'bg-primary text-white' : 'bg-gray-100']" @click="setLocale('en')">EN</button>
        </div>
        <button class="flex items-center gap-1 text-gray-700 hover:text-primary">
          <Search class="h-5 w-5" />
          <span class="hidden sm:inline">Recherche</span>
        </button>
        <NuxtLink :to="`/${slug}/cart`" class="relative flex items-center gap-1 text-gray-700 hover:text-primary">
          <ShoppingCart class="h-5 w-5" />
          <span class="hidden sm:inline">Panier</span>
          <span v-if="count>0" class="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs text-white">{{ count }}</span>
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup>
const route = useRoute()
const slug = computed(() => String(route.params['boutiqueSlug'] || ''))
const store = reactive({ name: '', logoUrl: '', color: '#111827' })
const color = computed(() => store.color || '#111827')
const initials = computed(() => (store.name || 'Boutique').split(/\s+/).map(s => s[0]).join('.'))
onMounted(() => {
  try {
    const raw = localStorage.getItem(`store:${slug.value}`)
    if (raw) Object.assign(store, JSON.parse(raw))
  } catch {}
})
import { useCartStore } from '~/stores/cart'
const cart = useCartStore()
onMounted(() => cart.load(slug.value))
const count = computed(() => cart.count)
import { ShoppingCart, Search } from 'lucide-vue-next'
import { useI18n } from '~/composables/i18n'
const { locale, setLocale } = useI18n()
</script>
