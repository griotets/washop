<template>
  <div>
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Produits</h1>
      <div class="flex items-center gap-2">
        <button class="rounded-lg bg-gray-100 px-3 py-2 text-sm" @click="openImportModal">Importation</button>
        <NuxtLink to="/admin/products/bulk" class="rounded-lg bg-gray-100 px-3 py-2 text-sm">Modification en bloc</NuxtLink>
        
        <NuxtLink 
          v-if="admin.canAddProduct"
          to="/admin/products/new" 
          class="rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white"
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
  <!-- Import Modal -->
  <div v-if="showImportModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
    <div 
      class="w-full rounded-xl bg-white shadow-xl transition-all duration-300"
      :class="importStep === 'mapping' ? 'max-w-3xl' : 'max-w-md'"
    >
      <div class="flex items-center justify-between border-b p-4">
        <div>
          <h3 class="font-semibold text-gray-900">Importer des produits</h3>
          <p class="text-xs text-gray-500">
            {{ importStep === 'upload' ? 'Étape 1 : Choix du fichier' : 'Étape 2 : Correspondance des colonnes' }}
          </p>
        </div>
        <button @click="showImportModal = false" class="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
          <X class="h-5 w-5" />
        </button>
      </div>
      
      <!-- Stepper -->
      <div class="border-b bg-gray-50 px-8 py-3">
        <div class="flex items-center justify-center">
          <div class="flex items-center">
            <div class="flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold"
              :class="importStep === 'upload' ? 'bg-green-600 text-white' : 'bg-green-600 text-white'"
            >1</div>
            <span class="ml-2 text-sm font-medium text-gray-900">Upload</span>
          </div>
          <div class="mx-4 h-0.5 w-16 bg-gray-200">
            <div class="h-full bg-green-600 transition-all duration-300" :style="{ width: importStep === 'mapping' ? '100%' : '0%' }"></div>
          </div>
          <div class="flex items-center">
            <div class="flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors"
              :class="importStep === 'mapping' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'"
            >2</div>
            <span class="ml-2 text-sm font-medium" :class="importStep === 'mapping' ? 'text-gray-900' : 'text-gray-500'">Mapping</span>
          </div>
        </div>
      </div>
      
      <div class="p-6">
        <!-- Method Selection (Only visible in Upload step) -->
        <div v-if="importStep === 'upload' && importMethod !== 'website'" class="mb-6 grid grid-cols-2 gap-3">
          <button 
            @click="importMethod = 'csv'"
            class="flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 text-sm font-medium transition-all"
            :class="importMethod === 'csv' ? 'border-green-600 bg-green-50 text-green-700' : 'border-gray-100 bg-white text-gray-600 hover:border-gray-200'"
          >
            <div class="rounded-full bg-white p-2 shadow-sm">
              <Upload class="h-5 w-5" :class="importMethod === 'csv' ? 'text-green-600' : 'text-gray-400'" />
            </div>
            Fichier CSV
          </button>
          
          <button 
            @click="importMethod = 'website'"
            class="flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 text-sm font-medium transition-all"
            :class="importMethod === 'website' ? 'border-green-600 bg-green-50 text-green-700' : 'border-gray-100 bg-white text-gray-600 hover:border-gray-200'"
          >
            <div class="rounded-full bg-white p-2 shadow-sm">
              <Globe class="h-5 w-5" :class="importMethod === 'website' ? 'text-green-600' : 'text-gray-400'" />
            </div>
            Site Web
          </button>
        </div>

        <!-- CSV Content -->
        <div v-if="importMethod === 'csv'">
          <div v-if="importStep === 'upload'" class="space-y-4">
            <div class="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center transition-colors hover:bg-gray-100">
              <Upload class="mx-auto h-12 w-12 text-gray-400" />
              <p class="mt-4 text-sm font-medium text-gray-900">Glissez votre fichier CSV ici</p>
              <p class="mt-1 text-xs text-gray-500">ou cliquez pour parcourir vos dossiers</p>
              <button @click="openFileDialog" class="mt-6 rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50">
                Sélectionner un fichier
              </button>
            </div>
            <div class="rounded-lg bg-blue-50 p-4">
              <div class="flex">
                <Info class="h-5 w-5 text-blue-400" />
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-blue-800">Format Recommandé</h3>
                  <div class="mt-2 text-sm text-blue-700">
                    <p>Pour un import réussi, votre fichier doit idéalement contenir les colonnes :</p>
                    <ul class="mt-1 list-disc list-inside">
                      <li>Nom du produit</li>
                      <li>Prix</li>
                      <li>UGS (SKU)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="importStep === 'mapping'" class="space-y-6">
            <div class="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
              <p>Nous avons détecté <span class="font-bold text-gray-900">{{ csvRows.length }} lignes</span> dans votre fichier. Veuillez associer vos colonnes aux champs du système.</p>
            </div>

            <div class="grid max-h-[50vh] gap-6 overflow-y-auto pr-2 md:grid-cols-2">
              <div v-for="field in systemFields" :key="field.key" class="rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                <div class="mb-3 flex items-center justify-between">
                  <label class="block text-sm font-semibold text-gray-900">
                    {{ field.label }}
                    <span v-if="field.required" class="text-red-500">*</span>
                  </label>
                  <span class="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{{ field.key }}</span>
                </div>
                
                <select 
                  v-model="columnMapping[field.key as keyof typeof columnMapping]" 
                  class="block w-full rounded-lg border-gray-300 bg-gray-50 py-2 text-sm focus:border-green-500 focus:bg-white focus:ring-green-500"
                >
                  <option value="">-- Ne pas importer --</option>
                  <option v-for="header in csvHeaders" :key="header" :value="header">
                    {{ header }}
                  </option>
                </select>

                <!-- Preview Value -->
                <div v-if="columnMapping[field.key as keyof typeof columnMapping]" class="mt-3 rounded border border-gray-100 bg-gray-50 p-2">
                  <p class="text-[10px] font-medium uppercase text-gray-400">Exemple de valeur (Ligne 1)</p>
                  <p class="mt-1 truncate text-xs font-medium text-gray-700">
                    {{ csvRows[0][columnMapping[field.key as keyof typeof columnMapping]] || '(Vide)' }}
                  </p>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between border-t pt-4">
              <button 
                @click="importStep = 'upload'"
                class="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Retour
              </button>
              <button 
                @click="finalizeImport"
                class="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
              >
                <Check class="h-4 w-4" />
                Confirmer et Importer {{ csvRows.length }} produits
              </button>
            </div>
          </div>
        </div>

        <!-- Website Content -->
        <div v-if="importMethod === 'website'" class="space-y-4">
          <button 
             @click="importMethod = 'csv'"
             class="mb-4 text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <ChevronLeft class="h-3 w-3" /> Retour au choix
          </button>
          
          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700">Lien du produit ou de la collection</label>
            <div class="flex rounded-lg border shadow-sm focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500">
              <span class="inline-flex items-center rounded-l-lg border-r bg-gray-50 px-3 text-gray-500">https://</span>
              <input 
                v-model="websiteUrl"
                type="text" 
                class="block w-full rounded-r-lg border-0 bg-transparent p-2.5 text-sm focus:ring-0" 
                placeholder="www.exemple.com/produit"
              />
            </div>
          </div>
          <div class="rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
            <p class="font-medium text-gray-900">Note :</p>
            <p>L'importation depuis un site externe peut prendre quelques minutes selon le nombre de produits.</p>
          </div>
          <button 
            @click="handleWebsiteImport"
            :disabled="!websiteUrl"
            class="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download class="h-4 w-4" />
            Démarrer l'importation
          </button>
        </div>
      </div>
    </div>
  </div>

  <div v-if="toastShow" class="fixed bottom-4 right-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-lg">
    {{ toastMsg }}
  </div>
</template>

<script setup lang="ts">
import type { SupabaseClient } from '@supabase/supabase-js'
import { useAdminStore } from '~/stores/admin'
import { Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, Lock, AlertTriangle, Upload, Globe, X, Download, Info, Check } from 'lucide-vue-next'
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
const showImportModal = ref(false)
const importMethod = ref<'csv' | 'website'>('csv')
const importStep = ref<'upload' | 'mapping'>('upload')
const websiteUrl = ref('')

const csvHeaders = ref<string[]>([])
const csvRows = ref<any[]>([])
const columnMapping = reactive({
  name: '',
  price: '',
  sku: '',
  description: '',
  images: '',
  stock_quantity: '',
  category_id: ''
})

const systemFields = [
  { key: 'name', label: 'Nom du produit (Requis)', required: true },
  { key: 'price', label: 'Prix (Requis)', required: true },
  { key: 'sku', label: 'UGS (SKU)' },
  { key: 'description', label: 'Description' },
  { key: 'images', label: 'Images (URLs séparées par ;)' },
  { key: 'stock_quantity', label: 'Quantité en stock' },
  { key: 'category_id', label: 'ID Catégorie' }
]

function openImportModal() {
  showImportModal.value = true
  importMethod.value = 'csv'
  importStep.value = 'upload'
  websiteUrl.value = ''
  csvHeaders.value = []
  csvRows.value = []
  Object.keys(columnMapping).forEach(k => columnMapping[k as keyof typeof columnMapping] = '')
}

function openFileDialog() {
  importInput.value?.click()
}

async function handleWebsiteImport() {
  if (!websiteUrl.value) return
  
  // Simulation/Placeholder for website import
  const url = websiteUrl.value.startsWith('http') ? websiteUrl.value : `https://${websiteUrl.value}`
  
  notify(`Analyse de ${url} en cours...`)
  
  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  notify("Fonctionnalité d'import web bientôt disponible")
  showImportModal.value = false
}

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
  if (rows.length === 0) {
    notify('Le fichier CSV est vide ou invalide')
    return
  }
  
  // Extract headers and sample rows
  const headers = Object.keys(rows[0])
  csvHeaders.value = headers
  csvRows.value = rows
  
  // Auto-map fields
  headers.forEach(h => {
    const lower = h.toLowerCase().trim()
    if (lower === 'name' || lower === 'nom' || lower === 'title' || lower === 'titre') columnMapping.name = h
    if (lower === 'price' || lower === 'prix') columnMapping.price = h
    if (lower === 'sku' || lower === 'ugs') columnMapping.sku = h
    if (lower === 'description' || lower === 'desc') columnMapping.description = h
    if (lower === 'images' || lower === 'photo' || lower === 'photos') columnMapping.images = h
    if (lower === 'stock' || lower === 'quantity' || lower === 'quantité') columnMapping.stock_quantity = h
    if (lower === 'category_id' || lower === 'categorie' || lower === 'catégorie') columnMapping.category_id = h
  })
  
  importStep.value = 'mapping'
}

async function finalizeImport() {
  const storeId = admin.selectedShopId
  if (!storeId) return
  
  if (!columnMapping.name || !columnMapping.price) {
    notify('Veuillez mapper les champs obligatoires (Nom et Prix)')
    return
  }
  
  notify('Importation en cours...')
  
  const payloads = csvRows.value.map(r => ({
    store_id: storeId,
    name: r[columnMapping.name],
    sku: columnMapping.sku ? r[columnMapping.sku] : null,
    price: Number(r[columnMapping.price] || 0),
    description: columnMapping.description ? r[columnMapping.description] : '',
    images: columnMapping.images ? String(r[columnMapping.images] || '').split(';').filter(Boolean) : [],
    is_visible: true,
    track_inventory: !!columnMapping.stock_quantity,
    stock_quantity: columnMapping.stock_quantity ? Number(r[columnMapping.stock_quantity] || 0) : 0,
    category_id: columnMapping.category_id ? Number(r[columnMapping.category_id]) : null
  }))
  
  const BATCH_SIZE = 50
  for (let i = 0; i < payloads.length; i += BATCH_SIZE) {
    const batch = payloads.slice(i, i + BATCH_SIZE)
    const { error } = await supabase.from('products').insert(batch)
    if (error) console.error('Batch import error:', error)
  }
  
  await loadProducts()
  notify('Importation terminée avec succès')
  showImportModal.value = false
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
