<template>
  <div>
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Produits</h1>
      <div class="flex items-center gap-2">
        <button class="rounded-lg bg-gray-100 px-3 py-2 text-sm">Importation</button>
        <NuxtLink to="/admin/products/bulk" class="rounded-lg bg-gray-100 px-3 py-2 text-sm">Modification en bloc</NuxtLink>
        <NuxtLink to="/admin/products/new" class="rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white">Ajouter un produit</NuxtLink>
      </div>
    </div>

    <div class="mt-4 flex items-center justify-between">
      <div class="flex items-center rounded-lg border bg-white px-3 py-2 w-full max-w-xl">
        <Search class="h-4 w-4 text-gray-500" />
        <input v-model.trim="search" type="text" placeholder="Recherche par produit, variante ou UGS" class="ml-2 w-full bg-transparent text-sm outline-none" />
      </div>
      <div class="flex items-center gap-2">
        <button class="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-white"><Filter class="h-4 w-4 text-gray-700" /></button>
        <button class="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-white"><ArrowUpDown class="h-4 w-4 text-gray-700" /></button>
        <button class="rounded-lg border bg-white px-3 py-2 text-sm">Exportation</button>
      </div>
    </div>

    <div class="mt-4 overflow-hidden rounded-xl border">
      <table class="min-w-full bg-white">
        <thead class="bg-gray-50 text-sm text-gray-600">
          <tr>
            <th class="w-12 px-4 py-3 text-left"><input type="checkbox" v-model="selectAll" @change="toggleSelectAll" /></th>
            <th class="px-4 py-3 text-left">Nom</th>
            <th class="px-4 py-3 text-left">Prix</th>
            <th class="px-4 py-3 text-left">Inventaire</th>
            <th class="px-4 py-3 text-left">Marquer comme épuisé</th>
            <th class="px-4 py-3 text-left">Visibilité</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in products" :key="p.id" class="border-t">
            <td class="px-4 py-3"><input type="checkbox" v-model="selected" :value="p.id" /></td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <img :src="firstImage(p)" alt="" class="h-10 w-10 rounded object-cover bg-gray-100" />
                <div>
                  <div class="font-medium">{{ p.name }}</div>
                  <div class="text-xs text-gray-500">UGS: {{ p.sku || '—' }}</div>
                </div>
              </div>
            </td>
            <td class="px-4 py-3">
              <div>FCFA {{ Number(p.price || 0).toLocaleString('fr-FR') }}</div>
            </td>
            <td class="px-4 py-3">
              <label class="inline-flex items-center gap-2">
                <input type="checkbox" v-model="p.track_inventory" @change="updateField(p.id, { track_inventory: p.track_inventory })" />
                <span class="text-sm text-gray-600">Suivre</span>
              </label>
            </td>
            <td class="px-4 py-3">
              <label class="inline-flex items-center gap-2">
                <input type="checkbox" v-model="p.is_out_of_stock" @change="updateField(p.id, { is_out_of_stock: p.is_out_of_stock })" />
              </label>
            </td>
            <td class="px-4 py-3">
              <button :class="p.is_visible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'" class="rounded px-2 py-1 text-xs font-semibold" @click="toggleVisibility(p)">
                {{ p.is_visible ? 'VISIBLE' : 'MASQUÉ' }}
              </button>
            </td>
          </tr>
          <tr v-if="loading">
            <td colspan="6" class="px-4 py-6 text-center text-sm text-gray-500">Chargement...</td>
          </tr>
          <tr v-if="!loading && products.length===0">
            <td colspan="6" class="px-4 py-6 text-center text-sm text-gray-500">Aucun produit.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="mt-3 flex items-center justify-end gap-2">
      <select v-model="limit" class="rounded border px-2 py-1 text-sm">
        <option :value="50">50</option>
        <option :value="25">25</option>
        <option :value="10">10</option>
      </select>
      <button class="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-white" :disabled="page===1" @click="prevPage"><ChevronLeft class="h-4 w-4 text-gray-700" /></button>
      <button class="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-white" :disabled="products.length<limit" @click="nextPage"><ChevronRight class="h-4 w-4 text-gray-700" /></button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SupabaseClient } from '@supabase/supabase-js'
import { useAdminStore } from '~/stores/admin'
import { Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-vue-next'
definePageMeta({ layout: 'admin' })
const nuxt = useNuxtApp()
const supabase = nuxt.$supabase as SupabaseClient
const admin = useAdminStore()
const search = ref('')
const limit = ref(50)
const page = ref(1)
const loading = ref(false)
const products = ref<any[]>([])
const selected = ref<string[]>([])
const selectAll = ref(false)
function toggleSelectAll() {
  if (selectAll.value) selected.value = products.value.map(p => String(p.id))
  else selected.value = []
}
function firstImage(p: any) {
  const arr = Array.isArray(p.images) ? p.images : (typeof p.images === 'string' ? JSON.parse(p.images || '[]') : [])
  return arr[0] || p.variant_image || ''
}
async function loadProducts() {
  const storeId = admin.selectedShopId
  if (!storeId) return
  loading.value = true
  const from = (page.value - 1) * limit.value
  const to = from + limit.value - 1
  let query = supabase.from('products').select('id,name,sku,price,images,is_visible,track_inventory,is_out_of_stock').eq('store_id', storeId).order('created_at', { ascending: false }).range(from, to)
  const term = String(search.value || '').trim()
  if (term) query = query.ilike('name', `%${term}%`)
  const { data } = await query
  products.value = Array.isArray(data) ? data : []
  loading.value = false
}
function toggleVisibility(p: any) {
  const next = !p.is_visible
  updateField(p.id, { is_visible: next })
  p.is_visible = next
}
async function updateField(id: string | number, patch: Record<string, any>) {
  const storeId = admin.selectedShopId
  if (!storeId) return
  await supabase.from('products').update(patch).eq('id', id).eq('store_id', storeId)
}
watch([search, limit], () => { page.value = 1; loadProducts() })
watch(page, () => loadProducts())
onMounted(async () => {
  if (!admin.selectedShopId) {
    const { data } = await supabase.auth.getUser()
    const uid = data?.user?.id
    if (!uid) return navigateTo('/auth/login')
    const { data: ent } = await supabase.from('enterprises').select('id').eq('owner_id', uid).maybeSingle()
    const enterprise_id = ent?.id
    if (!enterprise_id) return navigateTo('/admin/stores/create')
    const { data: s } = await supabase.from('stores').select('id').eq('enterprise_id', enterprise_id).limit(1)
    const sid = Array.isArray(s) && s[0]?.id ? String(s[0].id) : ''
    if (sid) admin.selectShop(sid)
  }
  await loadProducts()
})
function prevPage() { if (page.value > 1) page.value-- }
function nextPage() { page.value++ }
useHead({ title: 'Admin | Produits' })
</script>
