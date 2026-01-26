<template>
  <header class="sticky top-0 z-50 bg-white md:bg-white/90 md:backdrop-blur border-b">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-full" :style="{ backgroundColor: color }">
          <NuxtImg v-if="store.logoUrl" :src="store.logoUrl" alt="logo" class="h-10 w-10 rounded-full object-cover" />
          <span v-else class="text-xs font-semibold text-white">{{ initials }}</span>
        </div>
        <div class="font-semibold">{{ store.name || t('catalog.storeFallback') }}</div>
      </div>
      <div class="flex items-center gap-4">
        <div v-if="isSearchOpen" class="absolute inset-x-0 top-0 z-50 flex h-full items-center bg-white px-4 md:relative md:inset-auto md:h-auto md:bg-transparent md:px-0">
           <div class="relative w-full max-w-md mx-auto md:mx-0">
             <input 
               ref="searchInput"
               v-model="headerSearchQuery"
               type="text"
               :placeholder="t('catalog.search')"
               class="w-full rounded-full border border-gray-300 pl-10 pr-10 py-1.5 text-sm focus:border-primary focus:ring-primary"
               @keyup.enter="handleSearch"
               @blur="closeSearchIfEmpty"
             />
             <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
             <button @click="isSearchOpen = false" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
               <X class="h-4 w-4" />
             </button>
           </div>
        </div>

        <div v-else class="hidden sm:flex items-center gap-2">
          <select v-model="locale" class="rounded border border-gray-200 bg-gray-50 px-2 py-1 text-sm focus:border-primary focus:ring-primary">
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="it">Italiano</option>
          </select>
        </div>
        <button v-if="!isSearchOpen" class="flex items-center gap-1 text-gray-700 hover:text-primary" :aria-label="t('catalog.search')" @click="openSearch">
          <Search class="h-5 w-5" />
          <span class="inline text-xs sm:text-sm">{{ t('catalog.search') }}</span>
        </button>
        <NuxtLink :to="`/${slug}/cart`" class="relative flex items-center gap-1 text-gray-700 hover:text-primary">
          <ShoppingCart class="h-5 w-5" />
          <span class="inline text-xs sm:text-sm">{{ t('catalog.cart') }}</span>
          <span v-if="count>0" class="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs text-white">{{ count }}</span>
        </NuxtLink>

        <!-- Auth UI -->
        <div v-if="!isSearchOpen" class="flex items-center ml-1 pl-2 border-l border-gray-200">
          <NuxtLink v-if="user" :to="`/${slug}/myAccount`" class="flex items-center gap-1 text-gray-700 hover:text-primary" :title="t('account.dashboard')">
            <div class="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
              <User class="h-5 w-5 text-gray-500" />
            </div>
          </NuxtLink>
          <button v-else @click="showAuthModal = true" class="flex items-center gap-1 text-gray-700 hover:text-primary">
            <LogIn class="h-5 w-5" />
            <span class="inline text-xs sm:text-sm">{{ t('auth.login.signIn') }}</span>
          </button>
        </div>
      </div>
    </div>
  </header>

  <AuthModal 
    :is-open="showAuthModal" 
    @close="showAuthModal = false" 
    @login-success="showAuthModal = false"
  />
</template>

<script setup lang="ts">
import { ShoppingCart, Search, X, LogIn, User } from 'lucide-vue-next'
import { useCartStore } from '~/stores/cart'
import { useI18n } from '~/composables/i18n'

const { locale, t } = useI18n()
const { user } = useAuth()
const showAuthModal = ref(false)

const props = defineProps<{
  store?: {
    name?: string
    logoUrl?: string
    color?: string
  }
}>()
const route = useRoute()
const slug = computed(() => String(route.params['boutiqueSlug'] || ''))
const localStore = reactive({ name: '', logoUrl: '', color: '#111827' })

// Search State
const isSearchOpen = ref(false)
const headerSearchQuery = ref('')
const searchInput = ref<HTMLInputElement | null>(null)

function openSearch() {
  isSearchOpen.value = true
  nextTick(() => {
    searchInput.value?.focus()
  })
}

function closeSearchIfEmpty() {
  // Give time for X button click or other interactions
  setTimeout(() => {
    if (!headerSearchQuery.value) {
      isSearchOpen.value = false
    }
  }, 200)
}

function handleSearch() {
  navigateTo({
    path: `/${slug.value}`,
    query: { q: headerSearchQuery.value }
  })
  // We keep isSearchOpen true so user sees what they searched, or we can close it.
  // Usually if we navigate, the component might remount or route changes.
  // If we stay on same page (query change), we might want to close it to show results?
  // Let's close it to show the full header again.
  isSearchOpen.value = false
}

watch(() => route.query.q, (newQ) => {
  if (newQ) {
    headerSearchQuery.value = String(newQ)
  } else {
      headerSearchQuery.value = ''
  }
}, { immediate: true })

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
