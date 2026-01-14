<template>
  <header class="sticky top-0 z-50 bg-white md:bg-white/90 md:backdrop-blur border-b">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-full" :style="{ backgroundColor: color }">
          <img v-if="store.logoUrl" :src="store.logoUrl" alt="logo" class="h-10 w-10 rounded-full object-cover" />
          <span v-else class="text-xs font-semibold text-white">{{ initials }}</span>
        </div>
        <div class="font-semibold">{{ store.name || t('catalog.storeFallback') }}</div>
      </div>
      <div class="flex items-center gap-4">
        <div class="hidden sm:flex items-center gap-2">
          <select v-model="locale" class="rounded border border-gray-200 bg-gray-50 px-2 py-1 text-sm focus:border-primary focus:ring-primary">
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="it">Italiano</option>
          </select>
        </div>
        <button class="flex items-center gap-1 text-gray-700 hover:text-primary" :aria-label="t('catalog.search')">
          <Search class="h-5 w-5" />
          <span class="inline text-xs sm:text-sm">{{ t('catalog.search') }}</span>
        </button>
        <NuxtLink :to="`/${slug}/cart`" class="relative flex items-center gap-1 text-gray-700 hover:text-primary">
          <ShoppingCart class="h-5 w-5" />
          <span class="inline text-xs sm:text-sm">{{ t('catalog.cart') }}</span>
          <span v-if="count>0" class="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs text-white">{{ count }}</span>
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ShoppingCart, Search } from 'lucide-vue-next'
import { useCartStore } from '~/stores/cart'
import { useI18n } from '~/composables/i18n'

const { locale, t } = useI18n()
const props = defineProps(['store'])
const route = useRoute()
const slug = computed(() => String(route.params['boutiqueSlug'] || ''))
const localStore = reactive({ name: '', logoUrl: '', color: '#111827' })

// Merge props and local state
const store = computed(() => {
  if (props.store && props.store.name) return props.store
  return localStore
})

const color = computed(() => store.value.color || '#111827')
const initials = computed(() => (store.value.name || t('catalog.storeFallback')).split(/\s+/).map(s => s[0]).join('.'))

onMounted(() => {
  try {
    const raw = localStorage.getItem(`store:${slug.value}`)
    if (raw) Object.assign(localStore, JSON.parse(raw))
  } catch {}
})
const cart = useCartStore()
onMounted(() => cart.load(slug.value))
const count = computed(() => cart.count)
</script>
