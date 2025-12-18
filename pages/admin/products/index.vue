<template>
  <div>
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Produits</h1>
      <div class="flex items-center gap-2">
        <button class="rounded-lg bg-gray-100 px-3 py-2 text-sm" @click="triggerImport">Importation</button>
        <NuxtLink to="/admin/products/bulk" class="rounded-lg bg-gray-100 px-3 py-2 text-sm">Modification en bloc</NuxtLink>
        
        <NuxtLink 
          v-if="admin.canAddProduct"
          to="/admin/products/new" 
          class="rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white"
        >
          Ajouter un produit
        </NuxtLink>
        <button 
          v-else
          @click="notify('Limite de produits atteinte. Passez au plan supérieur.')"
          class="flex items-center gap-2 rounded-lg bg-gray-300 px-3 py-2 text-sm font-semibold text-gray-500 cursor-not-allowed"
        >
          <Lock class="h-4 w-4" />
          <span>Ajouter un produit</span>
        </button>
      </div>
    </div>

    <!-- Limit Warning -->
    <div v-if="!admin.canAddProduct" class="mt-4 rounded-lg bg-yellow-50 p-4 border border-yellow-200">
      <div class="flex">
        <div class="flex-shrink-0">
          <AlertTriangle class="h-5 w-5 text-yellow-400" aria-hidden="true" />
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-yellow-800">Limite de produits atteinte</h3>
          <div class="mt-2 text-sm text-yellow-700">
            <p>
              Vous avez atteint la limite de {{ admin.maxProducts }} produits incluse dans votre plan {{ admin.planName }}.
              Mettez à niveau votre abonnement pour ajouter plus de produits.
            </p>
          </div>
          <div class="mt-4">
            <div class="-mx-2 -my-1.5 flex">
              <NuxtLink to="/admin/settings?tab=billing" class="rounded-md bg-yellow-50 px-2 py-1.5 text-sm font-medium text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 focus:ring-offset-yellow-50">
                Voir les plans
              </NuxtLink>
            </div>
          </div>
        </div>
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
        <input ref="importInput" type="file" accept=".csv,text/csv" class="hidden" @change="importCsv" />
        <button class="rounded-lg border bg-white px-3 py-2 text-sm" @click="exportCsv">Exportation</button>
      </div>
    </div>

    <div class="mt-3 flex items-center gap-3">
      <select v-model="categoryFilter" class="rounded border px-2 py-1 text-sm">
        <option value="">Toutes catégories</option>
        <option v-for="c in categories" :key="c.id" :value="String(c.id)">{{ c.name }}</option>
      </select>
      <div class="flex flex-wrap gap-2">
        <button v-for="t in tags" :key="t.id" class="rounded-full border px-3 py-1 text-xs" :class="tagsFilter.has(Number(t.id))?'bg-green-100 border-green-300':'bg-white'" @click="toggleTagFilter(Number(t.id))">{{ t.name }}</button>
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
              <div class="flex items-center gap-2">
                <button :class="p.is_visible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'" class="rounded px-2 py-1 text-xs font-semibold" @click="toggleVisibility(p)">
                  {{ p.is_visible ? 'VISIBLE' : 'MASQUÉ' }}
                </button>
                <NuxtLink :to="`/admin/products/${p.id}`" class="rounded border px-2 py-1 text-xs">Modifier</NuxtLink>
                <button class="rounded border px-2 py-1 text-xs" @click="deleteRow(p)">Supprimer</button>
              </div>
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
  <div v-if="toastShow" class="fixed bottom-4 right-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-lg">
    {{ toastMsg }}
  </div>
</template>

<script setup lang="ts">
import type { SupabaseClient } from '@supabase/supabase-js'
import { useAdminStore } from '~/stores/admin'
import { Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, Lock, AlertTriangle } from 'lucide-vue-next'
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
const categories = ref<any[]>([])
const tags = ref<any[]>([])
const categoryFilter = ref<string>('')
const tagsFilter = reactive(new Set<number>())
const productTagMap = ref<Record<string, number[]>>({})
const importInput = ref<HTMLInputElement | null>(null)
function triggerImport() { importInput.value?.click() }
const toastShow = ref(false)
const toastMsg = ref('')
function notify(msg: string) { toastMsg.value = msg; toastShow.value = true; setTimeout(() => toastShow.value = false, 1500) }
function toggleSelectAll() {
  if (selectAll.value) selected.value = products.value.map(p => String(p.id))
  else selected.value = []
}
function firstImage(p: any) {
  try {
    const arr = Array.isArray(p.images) ? p.images : (typeof p.images === 'string' ? JSON.parse(p.images || '[]') : [])
    return arr[0] || p.variant_image || ''
  } catch (e) {
    return ''
  }
}
async function loadProducts() {
  const storeId = admin.selectedShopId
  if (!storeId) return
  loading.value = true
  const from = (page.value - 1) * limit.value
  const to = from + limit.value - 1
  let query = supabase.from('products').select('id,name,sku,price,images,is_visible,track_inventory,is_out_of_stock,category_id').eq('store_id', storeId).order('created_at', { ascending: false }).range(from, to)
  const term = String(search.value || '').trim()
  if (term) query = query.ilike('name', `%${term}%`)
  if (categoryFilter.value) query = query.eq('category_id', Number(categoryFilter.value))
  const { data, error } = await query
  if (error) {
    console.error('loadProducts error:', error)
    notify('Erreur de chargement des produits')
    loading.value = false
    return
  }
  let list = Array.isArray(data) ? data : []
  if (tagsFilter.size > 0) {
    const ids = new Set(list.map((p: any) => String(p.id)))
    const relevant = Object.entries(productTagMap.value).filter(([pid, arr]) => ids.has(pid) && Array.from(tagsFilter).every(t => arr.includes(t)))
    const keepIds = new Set(relevant.map(([pid]) => pid))
    list = list.filter((p: any) => keepIds.has(String(p.id)))
  }
  products.value = list
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
async function deleteRow(p: any) {
  const storeId = admin.selectedShopId
  if (!storeId) return
  if (!confirm('Supprimer ce produit ?')) return
  await supabase.from('products').delete().eq('id', p.id).eq('store_id', storeId)
  await loadProducts()
}
async function loadFilters() {
  const storeId = admin.selectedShopId
  if (!storeId) return
  const { data: c } = await supabase.from('categories').select('id,name').eq('store_id', storeId)
  categories.value = Array.isArray(c) ? c : []
  const { data: tg } = await supabase.from('tags').select('id,name').eq('store_id', storeId)
  tags.value = Array.isArray(tg) ? tg : []
  
  const { data: allProducts } = await supabase.from('products').select('id').eq('store_id', storeId)
  const allIds = Array.isArray(allProducts) ? allProducts.map((x: any) => x.id) : []
  
  if (allIds.length === 0) {
    productTagMap.value = {}
    return
  }

  const { data: pt } = await supabase.from('product_tags').select('product_id,tag_id').in('product_id', allIds)
  const map: Record<string, number[]> = {}
  for (const row of Array.isArray(pt) ? pt : []) {
    const pid = String(row.product_id)
    map[pid] = map[pid] || []
    map[pid].push(Number(row.tag_id))
  }
  productTagMap.value = map
}
function toggleTagFilter(tid: number) {
  if (tagsFilter.has(tid)) tagsFilter.delete(tid)
  else tagsFilter.add(tid)
  page.value = 1
  loadProducts()
}
function toCsvRow(p: any) {
  const images = Array.isArray(p.images) ? p.images.join(';') : ''
  const vals = [
    `"${String(p.name || '').replace(/"/g, '""')}"`,
    `"${String(p.sku || '').replace(/"/g, '""')}"`,
    String(p.price || 0),
    `"${String(p.description || '').replace(/"/g, '""')}"`,
    `"${images}"`,
    String(p.is_visible ? 1 : 0),
    String(p.track_inventory ? 1 : 0),
    String(p.stock_quantity || 0),
    String(p.category_id || '')
  ]
  return vals.join(',')
}
async function exportCsv() {
  const storeId = admin.selectedShopId
  if (!storeId) return
  const { data } = await supabase.from('products').select('id,name,sku,price,description,images,is_visible,track_inventory,stock_quantity,category_id').eq('store_id', storeId).order('created_at', { ascending: false }).limit(1000)
  const rows = Array.isArray(data) ? data : []
  const header = ['name','sku','price','description','images','is_visible','track_inventory','stock_quantity','category_id'].join(',')
  const csv = [header, ...rows.map(toCsvRow)].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'products.csv'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  notify('Exportation terminée')
}
function parseCsv(text: string) {
  const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0)
  if (lines.length === 0) return []
  const headers = lines[0].split(',').map(h => h.trim())
  const rows: any[] = []
  for (let i = 1; i < lines.length; i++) {
    const cols = []
    let cur = ''
    let inQuotes = false
    for (const ch of lines[i]) {
      if (ch === '"') { inQuotes = !inQuotes; continue }
      if (ch === ',' && !inQuotes) { cols.push(cur); cur = ''; continue }
      cur += ch
    }
    cols.push(cur)
    const obj: any = {}
    headers.forEach((h, idx) => obj[h] = cols[idx])
    rows.push(obj)
  }
  return rows
}
async function importCsv(e: any) {
  const f = e.target.files?.[0]
  if (!f) return
  const text = await f.text()
  const rows = parseCsv(text)
  const storeId = admin.selectedShopId
  const payloads = rows.map(r => ({
    store_id: storeId,
    name: r.name,
    sku: r.sku,
    price: Number(r.price || 0),
    description: r.description || '',
    images: String(r.images || '').split(';').filter(Boolean),
    is_visible: r.is_visible === '1' || r.is_visible === 'true',
    track_inventory: r.track_inventory === '1' || r.track_inventory === 'true',
    stock_quantity: Number(r.stock_quantity || 0),
    category_id: r.category_id ? Number(r.category_id) : null
  }))
  for (const pl of payloads) { await supabase.from('products').insert(pl) }
  await loadProducts()
  notify('Importation terminée')
}
watch([search, limit, categoryFilter], () => { page.value = 1; loadProducts() })
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
  await loadFilters()
  await loadProducts()
})
function prevPage() { if (page.value > 1) page.value-- }
function nextPage() { page.value++ }
useHead({ title: 'Admin | Produits' })
</script>
