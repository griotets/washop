<template>
  <div class="min-h-screen bg-gray-50">
    <div class="flex">
      <aside class="hidden lg:block w-64 border-r bg-white sticky top-0 h-screen overflow-y-auto">
        <div class="p-4">
          <div class="flex items-center gap-3">
            <img src="/logo.svg" alt="Wa-Shop" class="h-10 w-10" />
            <div class="text-lg font-semibold">Wa‑Shop</div>
          </div>
        </div>
        <nav class="px-3 py-2">
          <NuxtLink to="/admin/dashboard" class="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100" :class="route.path==='/admin/dashboard'?'bg-gray-100':''">
            <span>Tableau de bord</span>
          </NuxtLink>
          <NuxtLink to="/admin/orders" class="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100">
            <span>Commandes</span>
          </NuxtLink>
          <NuxtLink to="/admin/products" class="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100">
            <span>Produits</span>
          </NuxtLink>
          <NuxtLink to="/admin/clients" class="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100">
            <span>Clients</span>
          </NuxtLink>
          <NuxtLink to="/admin/stats" class="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100">
            <span>Statistiques</span>
          </NuxtLink>
          <NuxtLink to="/admin/settings" class="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100">
            <span>Réglages</span>
          </NuxtLink>
          <div class="mt-6 px-3 text-xs font-semibold text-gray-500">Sales Channels</div>
          <NuxtLink to="/admin/website" class="mt-1 flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100">
            <span>Site web (Design)</span>
          </NuxtLink>
          <NuxtLink to="/admin/whatsapp" class="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100">
            <span>WhatsApp</span>
          </NuxtLink>
          
        </nav>
        <div class="mt-auto p-4">
          <label class="block text-xs font-semibold text-gray-500 mb-2">Langue</label>
          <select class="w-full rounded border px-2 py-1 text-sm" v-model="locale">
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="it">Italiano</option>
          </select>
        </div>
      </aside>

      <main class="flex-1">
        <div class="border-b bg-white">
          <div class="mx-auto max-w-6xl px-6 py-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="flex h-10 w-10 items-center justify-center rounded-lg text-white" :style="{ backgroundColor: store.color || '#25D366' }">
                  <span class="text-sm font-semibold">{{ storeInitials }}</span>
                </div>
                <div>
                  <div class="font-semibold">{{ store.name || 'Votre boutique' }}</div>
                  <div class="text-xs text-gray-600">{{ publicUrl }}</div>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="hidden md:flex items-center rounded-lg border bg-white px-3 py-2">
                  <Search class="h-4 w-4 text-gray-500" />
                  <input type="text" placeholder="Recherche" class="ml-2 w-64 bg-transparent text-sm outline-none" v-model="search" />
                </div>
                <NuxtLink :to="`/${store.slug||''}`" class="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white">
                  <Share2 class="h-4 w-4" />
                  <span>Partager</span>
                </NuxtLink>
                <div class="flex items-center gap-2 rounded-full border bg-white px-2 py-1">
                  <div class="flex h-7 w-7 items-center justify-center rounded-full bg-gray-900 text-white text-xs font-semibold">{{ userInitials }}</div>
                  <div class="hidden md:block text-sm text-gray-700">{{ userEmail }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

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
import { Search, Share2 } from 'lucide-vue-next'
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
})
</script>
