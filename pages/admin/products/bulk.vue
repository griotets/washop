<template>
  <div>
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Modification en bloc</h1>
      <button class="rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white" :disabled="saving" @click="save">Sauvegarder</button>
    </div>
    <div class="mt-3 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">Mise à niveau nécessaire pour utiliser Premium</div>

    <div class="mt-4 flex items-center justify-between">
      <div class="flex items-center rounded-lg border bg-white px-3 py-2 w-full max-w-xl">
        <Search class="h-4 w-4 text-gray-500" />
        <input v-model.trim="search" type="text" placeholder="Recherche par produit, par variante ou UGS" class="ml-2 w-full bg-transparent text-sm outline-none" />
      </div>
      <div class="flex items-center gap-2">
        <button class="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-white"><Filter class="h-4 w-4 text-gray-700" /></button>
        <button class="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-white"><ArrowUpDown class="h-4 w-4 text-gray-700" /></button>
      </div>
    </div>

    <div class="mt-3 text-sm text-gray-600">Lignes modifiées : {{ modifiedIds.size }}</div>

    <div class="mt-2 overflow-auto rounded-xl border">
      <table class="min-w-full bg-white">
        <thead class="bg-gray-50 text-xs text-gray-600">
          <tr>
            <th class="px-3 py-2 text-left">Nom</th>
            <th class="px-3 py-2 text-left">Suivre l'inventaire</th>
            <th class="px-3 py-2 text-left">Inventaire</th>
            <th class="px-3 py-2 text-left">UGS</th>
            <th class="px-3 py-2 text-left">Prix</th>
            <th class="px-3 py-2 text-left">Prix original</th>
            <th class="px-3 py-2 text-left">Coût de la voie</th>
            <th class="px-3 py-2 text-left">Coût</th>
            <th class="px-3 py-2 text-left">Visibilité</th>
            <th class="px-3 py-2 text-left">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in rows" :key="p.id" class="border-t">
            <td class="px-3 py-2"><input v-model.trim="p.name" type="text" class="w-48 rounded border px-2 py-1 text-sm" @input="markModified(p.id)" /></td>
            <td class="px-3 py-2"><input type="checkbox" v-model="p.track_inventory" @change="markModified(p.id)" /></td>
            <td class="px-3 py-2"><input v-model.number="p.stock_quantity" type="number" min="0" class="w-24 rounded border px-2 py-1 text-sm" @input="markModified(p.id)" /></td>
            <td class="px-3 py-2"><input v-model.trim="p.sku" type="text" class="w-32 rounded border px-2 py-1 text-sm" @input="markModified(p.id)" /></td>
            <td class="px-3 py-2"><input v-model.number="p.price" type="number" min="0" step="0.01" class="w-24 rounded border px-2 py-1 text-sm" @input="markModified(p.id)" /></td>
            <td class="px-3 py-2"><input v-model.number="p.original_price" type="number" min="0" step="0.01" class="w-24 rounded border px-2 py-1 text-sm" @input="markModified(p.id)" /></td>
            <td class="px-3 py-2"><input type="checkbox" v-model="p.track_cost" @change="markModified(p.id)" /></td>
            <td class="px-3 py-2"><input v-model.number="p.cost_per_item" type="number" min="0" step="0.01" class="w-24 rounded border px-2 py-1 text-sm" @input="markModified(p.id)" /></td>
            <td class="px-3 py-2"><input type="checkbox" v-model="p.is_visible" @change="markModified(p.id)" /></td>
            <td class="px-3 py-2"><input v-model.trim="p.description" type="text" class="w-64 rounded border px-2 py-1 text-sm" @input="markModified(p.id)" /></td>
          </tr>
          <tr v-if="loading">
            <td colspan="10" class="px-4 py-6 text-center text-sm text-gray-500">Chargement...</td>
          </tr>
          <tr v-if="!loading && rows.length===0">
            <td colspan="10" class="px-4 py-6 text-center text-sm text-gray-500">Aucun produit.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SupabaseClient } from '@supabase/supabase-js'
import { useAdminStore } from '~/stores/admin'
import { Search, Filter, ArrowUpDown } from 'lucide-vue-next'
definePageMeta({ layout: 'admin' })
const nuxt = useNuxtApp()
const supabase = nuxt.$supabase as SupabaseClient
const admin = useAdminStore()
const search = ref('')
const loading = ref(false)
const saving = ref(false)
const rows = ref<any[]>([])
const modifiedIds = reactive(new Set<string>())
function markModified(id: string | number) { modifiedIds.add(String(id)) }
async function loadProducts() {
  const storeId = admin.selectedShopId
  if (!storeId) return
  loading.value = true
  let query = supabase.from('products').select('id,name,sku,price,original_price,track_cost,cost_per_item,track_inventory,stock_quantity,is_visible,description').eq('store_id', storeId).order('created_at', { ascending: false }).limit(200)
  const term = String(search.value || '').trim()
  if (term) query = query.ilike('name', `%${term}%`)
  const { data } = await query
  rows.value = Array.isArray(data) ? data.map((d: any) => ({ ...d })) : []
  loading.value = false
}
async function save() {
  if (modifiedIds.size === 0) return
  saving.value = true
  const storeId = admin.selectedShopId
  const toUpdate = rows.value.filter(r => modifiedIds.has(String(r.id)))
  for (const r of toUpdate) {
    const patch = {
      name: r.name,
      sku: r.sku,
      price: r.price,
      original_price: r.original_price,
      track_cost: r.track_cost,
      cost_per_item: r.cost_per_item,
      track_inventory: r.track_inventory,
      stock_quantity: r.stock_quantity,
      is_visible: r.is_visible,
      description: r.description
    }
    await supabase.from('products').update(patch).eq('id', r.id).eq('store_id', storeId)
  }
  modifiedIds.clear()
  saving.value = false
}
watch(search, () => loadProducts())
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
useHead({ title: 'Admin | Modification en bloc' })
</script>
