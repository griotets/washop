<template>
  <div class="min-h-screen bg-gray-50">
    <div class="flex">
      <aside class="hidden lg:flex flex-col w-64 border-r border-gray-200 bg-white sticky top-0 h-screen z-30">
        <!-- Logo -->
        <div class="p-6 border-b border-gray-100">
          <div class="flex items-center gap-3">
            <div class="h-8 w-8 rounded-lg bg-gray-900 flex items-center justify-center text-white font-bold text-xl">W</div>
            <div class="text-lg font-bold text-gray-900 tracking-tight">Wa‑Shop</div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 overflow-y-auto px-4 py-6 space-y-8">
          <!-- Main Group -->
          <div class="space-y-1">
            <NuxtLink to="/admin/dashboard" 
              class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors" 
              :class="route.path === '/admin/dashboard' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
            >
              <LayoutDashboard class="h-4 w-4" />
              <span>Tableau de bord</span>
            </NuxtLink>

            <NuxtLink to="/admin/orders" 
              class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              :class="route.path.startsWith('/admin/orders') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
            >
              <ShoppingBag class="h-4 w-4" />
              <span>Commandes</span>
            </NuxtLink>

            <NuxtLink to="/admin/products" 
              class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              :class="route.path.startsWith('/admin/products') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
            >
              <Package class="h-4 w-4" />
              <span>Produits</span>
            </NuxtLink>

            <NuxtLink to="/admin/clients" 
              class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              :class="route.path.startsWith('/admin/clients') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
            >
              <Users class="h-4 w-4" />
              <span>Clients</span>
            </NuxtLink>

            <NuxtLink to="/admin/stats" 
              class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              :class="route.path.startsWith('/admin/stats') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
            >
              <BarChart3 class="h-4 w-4" />
              <span>Statistiques</span>
            </NuxtLink>

            <NuxtLink to="/admin/settings" 
              class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              :class="route.path.startsWith('/admin/settings') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
            >
              <Settings class="h-4 w-4" />
              <span>Réglages</span>
            </NuxtLink>
          </div>

          <!-- Sales Channels Group -->
          <div class="space-y-1">
            <h3 class="px-3 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Canaux de vente</h3>
            
            <NuxtLink to="/admin/website" 
              class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              :class="route.path.startsWith('/admin/website') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
            >
              <Palette class="h-4 w-4" />
              <span>Site web</span>
            </NuxtLink>

            <NuxtLink to="/admin/whatsapp" 
              class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              :class="route.path.startsWith('/admin/whatsapp') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
            >
              <MessageCircle class="h-4 w-4" />
              <span>WhatsApp</span>
            </NuxtLink>
          </div>
        </nav>

        <!-- Footer Actions -->
        <div class="p-4 space-y-4 border-t border-gray-100 bg-gray-50/50">
          <!-- Free Plan Widget -->
          <div v-if="admin.isFreePlan" class="rounded-xl bg-gray-900 p-4 text-white shadow-sm relative overflow-hidden group">
            <div class="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <Sparkles class="h-12 w-12" />
            </div>
            <div class="relative z-10">
              <div class="mb-2 flex items-center gap-2 text-yellow-400">
                <Sparkles class="h-4 w-4" />
                <span class="text-xs font-bold uppercase tracking-wider">Plan Gratuit</span>
              </div>
              <p class="mb-3 text-xs text-gray-300 font-medium leading-relaxed">
                Débloquez tout le potentiel de votre boutique.
              </p>
              <NuxtLink to="/admin/settings?tab=billing" class="block w-full rounded-lg bg-white/10 py-2 text-center text-xs font-bold text-white hover:bg-white/20 transition-colors border border-white/10">
                Mise à niveau
              </NuxtLink>
            </div>
          </div>

          <!-- Language Selector -->
          <div class="flex items-center gap-2 px-1">
            <Globe class="h-4 w-4 text-gray-400" />
            <select class="w-full bg-transparent text-sm text-gray-600 font-medium focus:outline-none cursor-pointer" v-model="locale">
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="it">Italiano</option>
            </select>
          </div>
        </div>
      </aside>

      <main class="flex-1 min-w-0">
        <header class="sticky top-0 z-20 border-b border-gray-200 bg-white/80 backdrop-blur-xl">
          <div class="px-6 py-4">
            <div class="flex items-center justify-between gap-4">
              
              <!-- Left: Mobile Menu & Store Info -->
              <div class="flex items-center gap-4">
                <button class="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg" @click="isSidebarOpen = true">
                  <Menu class="h-5 w-5" />
                </button>

                <div class="flex items-center gap-3">
                  <div class="relative group cursor-pointer">
                    <div class="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm transition-transform group-hover:scale-105" :style="{ backgroundColor: store.color || '#25D366' }">
                      <span class="text-sm font-bold">{{ storeInitials }}</span>
                    </div>
                    <!-- Status Indicator -->
                    <div class="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-green-500"></div>
                  </div>
                  
                  <div class="hidden sm:block">
                    <h1 class="font-bold text-gray-900 leading-tight">{{ store.name || 'Ma Boutique' }}</h1>
                    <a v-if="publicUrl" :href="`https://${publicUrl}`" target="_blank" class="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-green-600 transition-colors">
                      {{ publicUrl }}
                      <ExternalLink class="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>

              <!-- Right: Search & Actions -->
              <div class="flex items-center gap-3 sm:gap-4">
                
                <!-- Search -->
                <div class="hidden md:flex items-center w-64 rounded-xl bg-gray-100 px-3 py-2.5 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-gray-900/5 focus-within:shadow-sm">
                  <Search class="h-4 w-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Rechercher..." 
                    class="ml-2 w-full bg-transparent text-sm font-medium outline-none placeholder:text-gray-400" 
                    v-model="search" 
                  />
                </div>

                <!-- Action Buttons -->
                <div class="flex items-center gap-2 border-l border-gray-200 pl-2 sm:pl-4">
                  <button class="relative p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                    <Bell class="h-5 w-5" />
                    <span class="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500 border border-white"></span>
                  </button>
                  
                  <NuxtLink :to="`/${store.slug||''}`" class="hidden sm:flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-gray-800 transition-all hover:shadow-md active:scale-95">
                    <Share2 class="h-4 w-4" />
                    <span>Visiter</span>
                  </NuxtLink>
                </div>

                <!-- User Profile -->
                <div class="flex items-center gap-3 pl-2">
                  <div class="h-9 w-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-700 cursor-pointer hover:border-gray-300 transition-colors">
                    {{ userInitials }}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </header>

        <div class="mx-auto max-w-6xl px-6 py-6">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SupabaseClient } from '@supabase/supabase-js'
import { useAdminStore } from '~/stores/admin'
import { useI18n } from '~/composables/i18n'
import { 
  Search, 
  Share2, 
  Sparkles, 
  AlertCircle,
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  BarChart3,
  Settings,
  Palette,
  MessageCircle,
  Globe,
  Bell,
  Menu,
  ChevronDown,
  ExternalLink
} from 'lucide-vue-next'
const route = useRoute()
const nuxt = useNuxtApp()
const supabase = nuxt.$supabase as SupabaseClient
const admin = useAdminStore()
const { locale } = useI18n()
const store = reactive<{ id?: string; name?: string; slug?: string; color?: string }>({})
const search = ref('')
const userEmail = ref('')
const userInitials = computed(() => {
  const e = String(userEmail.value || '').trim()
  return e ? e[0].toUpperCase() : 'U'
})
const storeInitials = computed(() => {
  const n = String(store.name || 'Boutique').trim()
  return n.split(/\s+/).map(s => s[0]).join('.').slice(0, 12)
})
const publicUrl = computed(() => store.slug ? `wa-shop.cm/${store.slug}` : '')
const isSidebarOpen = ref(false)

// Close sidebar on route change
watch(() => route.path, () => {
  isSidebarOpen.value = false
})

onMounted(async () => {
  const { data } = await supabase.auth.getUser()
  const uid = data?.user?.id
  userEmail.value = String(data?.user?.email || '')
  if (!uid) { await navigateTo('/auth/login'); return }
  const { data: ent } = await supabase.from('enterprises').select('id').eq('owner_id', uid).maybeSingle()
  const enterprise_id = ent?.id
  if (!enterprise_id) { await navigateTo('/admin/stores/create'); return }
  let currentStoreId = admin.selectedShopId
  if (!currentStoreId) {
    const { data: s } = await supabase.from('stores').select('id').eq('enterprise_id', enterprise_id).limit(1)
    currentStoreId = Array.isArray(s) && s[0]?.id ? String(s[0].id) : ''
    if (currentStoreId) admin.selectShop(currentStoreId)
  }
  if (!currentStoreId) { await navigateTo('/admin/stores/create'); return }
  const { data: sone } = await supabase.from('stores').select('id,name,slug,color').eq('id', currentStoreId).maybeSingle()
  store.id = String(sone?.id || '')
  store.name = String(sone?.name || '')
  store.slug = String(sone?.slug || '')
  store.color = String(sone?.color || '')

  // Load subscription and limits
  await admin.fetchSubscription(supabase)
})
</script>
