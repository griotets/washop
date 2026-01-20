<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Full Page Skeleton -->
    <div v-if="isLoadingStore" class="fixed inset-0 z-50 flex bg-white">
      <!-- Sidebar Skeleton -->
      <div class="hidden w-64 flex-col border-r border-gray-200 bg-white lg:flex">
        <div class="border-b border-gray-100 p-6">
          <div class="flex items-center gap-3">
            <div class="h-8 w-8 animate-pulse rounded-lg bg-gray-200"></div>
            <div class="h-6 w-24 animate-pulse rounded bg-gray-200"></div>
          </div>
        </div>
        <div class="flex-1 space-y-4 px-4 py-6">
          <div v-for="i in 6" :key="i" class="flex items-center gap-3 rounded-lg px-3 py-2">
            <div class="h-4 w-4 animate-pulse rounded bg-gray-200"></div>
            <div class="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
          </div>
        </div>
      </div>

      <!-- Main Content Skeleton -->
      <div class="flex-1">
        <div class="border-b border-gray-200 bg-white p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="h-10 w-10 animate-pulse rounded-full bg-gray-200"></div>
              <div class="space-y-2">
                <div class="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
                <div class="h-3 w-24 animate-pulse rounded bg-gray-200"></div>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="h-10 w-64 animate-pulse rounded-xl bg-gray-200"></div>
              <div class="h-10 w-10 animate-pulse rounded-full bg-gray-200"></div>
            </div>
          </div>
        </div>
        <div class="p-6">
          <div class="mb-6 h-8 w-48 animate-pulse rounded bg-gray-200"></div>
          <div class="grid gap-6 lg:grid-cols-3">
            <div v-for="i in 3" :key="i" class="h-32 animate-pulse rounded-xl bg-gray-200"></div>
          </div>
          <div class="mt-6 h-64 animate-pulse rounded-xl bg-gray-200"></div>
        </div>
      </div>
    </div>

    <div v-else class="flex">
      <aside class="hidden lg:flex flex-col w-64 border-r border-gray-200 bg-white sticky top-0 h-screen z-30">
        <!-- Logo -->
        <div class="p-6 border-b border-gray-100">
          <div class="flex items-center gap-3">
            <img src="/logo.svg" alt="Wa-Shop" class="h-8 w-auto" />
            <div class="text-lg font-bold text-gray-900 tracking-tight">Wa‑Shop</div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 overflow-y-auto px-4 py-6 space-y-8">
          <!-- Main Group -->
          <div class="space-y-1">
            <NuxtLink to="/admin/dashboard"
              class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              :class="route.path === '/admin/dashboard' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'">
              <LayoutDashboard class="h-4 w-4" />
              <span>{{ t('admin.dashboard') }}</span>
            </NuxtLink>

            <NuxtLink to="/admin/orders"
              class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              :class="route.path.startsWith('/admin/orders') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'">
              <ShoppingBag class="h-4 w-4" />
              <span>{{ t('admin.orders') }}</span>
            </NuxtLink>

            <NuxtLink to="/admin/products"
              class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              :class="route.path.startsWith('/admin/products') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'">
              <Package class="h-4 w-4" />
              <span>{{ t('admin.products') }}</span>
            </NuxtLink>

            <NuxtLink to="/admin/clients"
              class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              :class="route.path.startsWith('/admin/clients') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'">
              <Users class="h-4 w-4" />
              <span>{{ t('admin.clients') }}</span>
            </NuxtLink>

            <NuxtLink to="/admin/stats"
              class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              :class="route.path.startsWith('/admin/stats') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'">
              <BarChart3 class="h-4 w-4" />
              <span>{{ t('admin.stats') }}</span>
            </NuxtLink>

            <NuxtLink to="/admin/settings"
              class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              :class="route.path.startsWith('/admin/settings') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'">
              <Settings class="h-4 w-4" />
              <span>{{ t('admin.settings') }}</span>
            </NuxtLink>
          </div>

          <!-- Sales Channels Group -->
          <div class="space-y-1">
            <h3 class="px-3 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">{{ t('admin.salesChannels') }}</h3>

            <NuxtLink to="/admin/website"
              class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              :class="route.path.startsWith('/admin/website') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'">
              <Palette class="h-4 w-4" />
              <span>{{ t('admin.website') }}</span>
            </NuxtLink>


          </div>
        </nav>

        <!-- Footer Actions -->
        <div class="p-4 space-y-4 border-t border-gray-100 bg-gray-50/50">
          <!-- Free Plan Widget -->
          <div v-if="admin.isFreePlan"
            class="rounded-xl bg-gray-900 p-4 text-white shadow-sm relative overflow-hidden group">
            <div class="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <Sparkles class="h-12 w-12" />
            </div>
            <div class="relative z-10">
              <div class="mb-2 flex items-center gap-2 text-yellow-400">
                <Sparkles class="h-4 w-4" />
                <span class="text-xs font-bold uppercase tracking-wider">{{ t('admin.freePlan') }}</span>
              </div>
              <p class="mb-3 text-xs text-gray-300 font-medium leading-relaxed">
                {{ t('admin.unlockPotential') }}
              </p>
              <NuxtLink to="/admin/settings?tab=billing"
                class="block w-full rounded-lg bg-white/10 py-2 text-center text-xs font-bold text-white hover:bg-white/20 transition-colors border border-white/10">
                {{ t('admin.upgrade') }}
              </NuxtLink>
            </div>
          </div>

          <!-- Language Selector -->
          <div class="flex items-center gap-2 px-1">
            <Globe class="h-4 w-4 text-gray-400" />
            <select class="w-full bg-transparent text-sm text-gray-600 font-medium focus:outline-none cursor-pointer"
              v-model="locale">
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
                <button class="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  @click.stop="toggleSidebar">
                  <Menu class="h-5 w-5" />
                </button>

                <div class="flex items-center gap-3">
                  <div class="relative group cursor-pointer">
                    <img v-if="store.logoUrl" :src="store.logoUrl" alt="logo"
                      class="h-10 w-10 rounded-full object-cover" />
                    <div v-else
                      class="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm transition-transform group-hover:scale-105"
                      :style="{ backgroundColor: store.color || '#25D366' }">
                      <span class="text-sm font-bold">{{ storeInitials }}</span>
                    </div>
                    <!-- Status Indicator -->
                    <div class="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-green-500">
                    </div>
                  </div>

                  <div class="flex flex-col min-w-0 relative max-w-[55vw] sm:max-w-none">
                    <div class="flex items-center gap-2">
                      <button type="button" @click="isStoreMenuOpen = !isStoreMenuOpen"
                        class="flex items-center gap-1">
                        <h1 class="font-bold text-gray-900 leading-tight truncate">
                          {{ store.name || t('admin.storeFallback') }}
                        </h1>
                        <ChevronDown class="h-4 w-4 text-gray-400 transition-transform duration-200"
                          :class="{ 'rotate-180': isStoreMenuOpen }" />
                      </button>
                    </div>

                    <a v-if="publicUrl" :href="`https://${publicUrl}`" target="_blank"
                      class="mt-0.5 flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-green-600 transition-colors truncate">
                      {{ publicUrl }}
                      <ExternalLink class="h-3 w-3" />
                    </a>

                    <div v-if="isStoreMenuOpen" @click="isStoreMenuOpen = false"
                      class="fixed inset-0 z-40 cursor-default">
                    </div>

                    <div v-if="isStoreMenuOpen"
                      class="absolute left-0 top-full mt-2 w-72 rounded-xl border border-gray-100 bg-white shadow-xl shadow-gray-900/5 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                      <div class="px-4 py-3 border-b border-gray-50 bg-gray-50/60">
                        <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">
                          {{ t('admin.store.switchStore') }}
                        </p>
                        <p class="mt-1 text-sm text-gray-700 truncate">
                          {{ store.name || t('admin.storeFallback') }}
                        </p>
                      </div>

                      <div class="max-h-80 overflow-y-auto">
                        <button v-for="s in stores" :key="s.id" type="button"
                          class="w-full flex items-center justify-between gap-3 px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors"
                          @click="selectStore(s)">
                          <div class="flex items-center gap-3 min-w-0">
                            <div class="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white"
                              :style="{ backgroundColor: s.color || '#111827' }">
                              {{ storeInitialsFromName(s.name) }}
                            </div>
                            <div class="min-w-0">
                              <div class="font-medium text-gray-900 truncate">
                                {{ s.name }}
                              </div>
                              <div class="text-xs text-gray-500 truncate">
                                /{{ s.slug }}
                              </div>
                            </div>
                          </div>
                          <div class="text-xs text-gray-400">
                            {{ s.id === store.id ? t('common.current') : '' }}
                          </div>
                        </button>

                        <div v-if="stores.length === 0" class="px-4 py-3 text-xs text-gray-500">
                          {{ t('admin.storeFallback') }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right: Search & Actions -->
              <div class="flex items-center gap-3 sm:gap-4">

                <!-- Search -->
                <div
                  class="hidden md:flex items-center w-64 rounded-xl bg-gray-100 px-3 py-2.5 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-gray-900/5 focus-within:shadow-sm">
                  <Search class="h-4 w-4 text-gray-400" />
                  <input type="text" :placeholder="t('admin.search')"
                    class="ml-2 w-full bg-transparent text-sm font-medium outline-none placeholder:text-gray-400"
                    v-model="search" />
                </div>

                <!-- Action Buttons -->
                <div class="flex items-center gap-2 border-l border-gray-200 pl-2 sm:pl-4">
                  <button class="relative p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                    <Bell class="h-5 w-5" />
                    <span class="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500 border border-white"></span>
                  </button>

                  <NuxtLink :to="`/${store.slug || ''}`"
                    class="hidden sm:flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-gray-800 transition-all hover:shadow-md active:scale-95">
                    <Share2 class="h-4 w-4" />
                    <span>{{ t('admin.visit') }}</span>
                  </NuxtLink>
                </div>

                <!-- User Profile Dropdown -->
                <div class="relative pl-2">
                  <button @click="isUserMenuOpen = !isUserMenuOpen"
                    class="flex items-center gap-2 rounded-full p-1 hover:bg-gray-100 transition-colors outline-none focus:ring-2 focus:ring-gray-900/5">
                    <div
                      class="h-9 w-9 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-xs font-bold text-white shadow-sm ring-2 ring-white">
                      {{ userInitials }}
                    </div>
                    <ChevronDown class="h-4 w-4 text-gray-400 transition-transform duration-200"
                      :class="{ 'rotate-180': isUserMenuOpen }" />
                  </button>

                  <!-- Backdrop for clicking outside -->
                  <div v-if="isUserMenuOpen" @click="isUserMenuOpen = false" class="fixed inset-0 z-40 cursor-default">
                  </div>

                  <!-- Dropdown Menu -->
                  <div v-if="isUserMenuOpen"
                    class="absolute right-0 top-full mt-2 w-64 origin-top-right rounded-xl border border-gray-100 bg-white shadow-xl shadow-gray-900/5 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    
                    <!-- User Header -->
                    <div class="px-4 py-4 border-b border-gray-50 bg-gray-50/50">
                      <p class="text-sm font-semibold text-gray-900 truncate">{{ userEmail }}</p>
                      <p class="text-xs text-gray-500 mt-0.5">{{ t('admin.administrator') }}</p>
                    </div>

                    <!-- Menu Items -->
                    <div class="p-1">
                      <NuxtLink to="/admin/settings?tab=profile" @click="isUserMenuOpen = false"
                        class="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors">
                        <User class="h-4 w-4" />
                        <span>{{ t('admin.myProfile') }}</span>
                      </NuxtLink>
                      
                      <NuxtLink to="/admin/settings" @click="isUserMenuOpen = false"
                        class="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors">
                        <Settings class="h-4 w-4" />
                        <span>{{ t('admin.parameters') }}</span>
                      </NuxtLink>
                    </div>

                    <div class="h-px bg-gray-100 my-1 mx-2"></div>

                    <!-- Logout -->
                    <div class="p-1">
                      <button @click="handleLogout"
                        class="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                        <LogOut class="h-4 w-4" />
                        <span>{{ t('admin.logout') }}</span>
                      </button>
                    </div>
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

    <!-- Mobile Sidebar -->
    <div v-if="isSidebarOpen" class="fixed inset-0 z-[100] lg:hidden">
      <div class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" @click="isSidebarOpen = false"></div>
      <aside class="fixed inset-y-0 left-0 w-64 bg-white shadow-xl flex flex-col z-[101]">
        <div class="p-6 border-b border-gray-100 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <img src="/logo.svg" alt="Wa-Shop" class="h-8 w-auto" />
            <div class="text-lg font-bold text-gray-900 tracking-tight">Wa‑Shop</div>
          </div>
          <button @click="isSidebarOpen = false" class="text-gray-500 hover:bg-gray-100 p-1 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <nav class="flex-1 overflow-y-auto px-4 py-6 space-y-8">
          <!-- Main Group -->
          <div class="space-y-1">
            <NuxtLink to="/admin/dashboard"
              class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              :class="route.path === '/admin/dashboard' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'">
              <LayoutDashboard class="h-4 w-4" />
              <span>{{ t('admin.dashboard') }}</span>
            </NuxtLink>

            <NuxtLink to="/admin/orders"
              class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              :class="route.path.startsWith('/admin/orders') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'">
              <ShoppingBag class="h-4 w-4" />
              <span>{{ t('admin.orders') }}</span>
            </NuxtLink>

            <NuxtLink to="/admin/products"
              class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              :class="route.path.startsWith('/admin/products') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'">
              <Package class="h-4 w-4" />
              <span>{{ t('admin.products') }}</span>
            </NuxtLink>

            <NuxtLink to="/admin/clients"
              class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              :class="route.path.startsWith('/admin/clients') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'">
              <Users class="h-4 w-4" />
              <span>{{ t('admin.clients') }}</span>
            </NuxtLink>

            <NuxtLink to="/admin/stats"
              class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              :class="route.path.startsWith('/admin/stats') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'">
              <BarChart3 class="h-4 w-4" />
              <span>{{ t('admin.stats') }}</span>
            </NuxtLink>

            <NuxtLink to="/admin/settings"
              class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              :class="route.path.startsWith('/admin/settings') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'">
              <Settings class="h-4 w-4" />
              <span>{{ t('admin.settings') }}</span>
            </NuxtLink>
          </div>

          <!-- Sales Channels Group -->
          <div class="space-y-1">
            <h3 class="px-3 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">{{ t('admin.salesChannels') }}</h3>

            <NuxtLink to="/admin/website"
              class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              :class="route.path.startsWith('/admin/website') ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'">
              <Palette class="h-4 w-4" />
              <span>{{ t('admin.website') }}</span>
            </NuxtLink>


          </div>
        </nav>

        <!-- Footer Actions -->
        <div class="p-4 space-y-4 border-t border-gray-100 bg-gray-50/50">
          <!-- Free Plan Widget -->
          <div v-if="admin.isFreePlan"
            class="rounded-xl bg-gray-900 p-4 text-white shadow-sm relative overflow-hidden group">
            <div class="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <Sparkles class="h-12 w-12" />
            </div>
            <div class="relative z-10">
              <div class="mb-2 flex items-center gap-2 text-yellow-400">
                <Sparkles class="h-4 w-4" />
                <span class="text-xs font-bold uppercase tracking-wider">{{ t('admin.freePlan') }}</span>
              </div>
              <p class="mb-3 text-xs text-gray-300 font-medium leading-relaxed">
                {{ t('admin.unlockPotential') }}
              </p>
              <NuxtLink to="/admin/settings?tab=billing"
                class="block w-full rounded-lg bg-white/10 py-2 text-center text-xs font-bold text-white hover:bg-white/20 transition-colors border border-white/10">
                {{ t('admin.upgrade') }}
              </NuxtLink>
            </div>
          </div>

          <!-- Language Selector -->
          <div class="flex items-center gap-2 px-1">
            <Globe class="h-4 w-4 text-gray-400" />
            <select class="w-full bg-transparent text-sm text-gray-600 font-medium focus:outline-none cursor-pointer"
              v-model="locale">
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="it">Italiano</option>
            </select>
          </div>
        </div>
      </aside>
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
  ExternalLink,
  LogOut,
  User
} from 'lucide-vue-next'
const route = useRoute()
const url = useRequestURL()
const domain = url.host
const nuxt = useNuxtApp()
const supabase = nuxt.$supabase as SupabaseClient
const admin = useAdminStore()
const { locale, t } = useI18n()
const store = reactive<{ id?: string; name?: string; slug?: string; color?: string, logoUrl?: string }>({})
const isLoadingStore = ref(true)
const search = ref('')
const userEmail = ref('')
const isUserMenuOpen = ref(false)
const isStoreMenuOpen = ref(false)
const stores = ref<Array<{ id: string; name: string; slug: string; color?: string }>>([])

const userInitials = computed(() => {
  const e = String(userEmail.value || '').trim()
  return e ? e[0].toUpperCase() : 'U'
})

const handleLogout = async () => {
  await supabase.auth.signOut()
  await navigateTo('/auth/login')
}

const storeInitials = computed(() => {
  const n = String(store.name || 'Boutique').trim()
  return n.split(/\s+/).map(s => s[0]).join('.').slice(0, 12)
})
const storeInitialsFromName = (name: string) => (name || '').split(/\s+/).map(s => s[0]).join('.').slice(0, 6)
const publicUrl = computed(() => store.slug ? `${domain}/${store.slug}` : '')
const isSidebarOpen = ref(false)

function toggleSidebar() {
  console.log('toggleSidebar', isSidebarOpen.value)
  isSidebarOpen.value = !isSidebarOpen.value
}

// Close sidebar on route change
watch(() => route.path, () => {
  isSidebarOpen.value = false
})

function selectStore(s: { id: string }) {
  admin.selectShop(String(s.id))
  if (s.id !== store.id) {
    store.id = String(s.id)
    const found = stores.value.find(x => String(x.id) === String(s.id))
    if (found) {
      store.name = String(found.name || '')
      store.slug = String(found.slug || '')
      store.color = String(found.color || '')
    }
  }
  isStoreMenuOpen.value = false
  navigateTo('/admin/dashboard')
}

onMounted(async () => {
  isLoadingStore.value=true
  const { data } = await supabase.auth.getUser()
  const uid = data?.user?.id
  userEmail.value = String(data?.user?.email || '')
  if (!uid) { await navigateTo('/auth/login'); return }
  const { data: ent } = await supabase.from('enterprises').select('id').eq('owner_id', uid).maybeSingle()
  const enterprise_id = ent?.id
  if (!enterprise_id) { await navigateTo('/admin/stores/create'); return }
  const { data: list } = await supabase.from('stores').select('id,name,slug,color').eq('enterprise_id', enterprise_id)
  stores.value = Array.isArray(list) ? list : []
  let currentStoreId = admin.selectedShopId
  if (!currentStoreId) {
    const { data: s } = await supabase.from('stores').select('id').eq('enterprise_id', enterprise_id).limit(1)
    currentStoreId = Array.isArray(s) && s[0]?.id ? String(s[0].id) : ''
    if (currentStoreId) admin.selectShop(currentStoreId)
  }
  if (!currentStoreId) { await navigateTo('/admin/stores/create'); return }
  const { data: sone } = await supabase.from('stores').select('id,name,slug,color,image_url').eq('id', currentStoreId).maybeSingle()
  console.log('some', sone)
  store.id = String(sone?.id || '')
  store.name = String(sone?.name || '')
  store.slug = String(sone?.slug || '')
  store.color = String(sone?.color || '')
  store.logoUrl = String(sone?.image_url || '')
  isLoadingStore.value = false

  // Load subscription and limits
  await admin.fetchSubscription(supabase)
})
</script>
