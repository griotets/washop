<template>
  <div>
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Modification en bloc</h1>
      <button v-if="!isFreePlan" class="rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50" :disabled="saving || modifiedIds.size === 0" @click="save">
        {{ saving ? 'Enregistrement...' : 'Sauvegarder' }}
      </button>
    </div>

    <!-- Premium Lock -->
    <div v-if="isFreePlan" class="mt-8">
      <PremiumLock 
        title="Modification en bloc" 
        description="Gagnez du temps en modifiant tous vos produits simultanément. Cette fonctionnalité est disponible sur les plans Business." 
      />
      
      <!-- Blurred Preview -->
      <div class="mt-8 opacity-50 pointer-events-none filter blur-sm select-none" aria-hidden="true">
        <div class="mt-4 flex items-center justify-between">
           <div class="flex items-center rounded-lg border bg-white px-3 py-2 w-full max-w-xl">
             <Search class="h-4 w-4 text-gray-500" />
             <input type="text" placeholder="Recherche..." class="ml-2 w-full bg-transparent text-sm outline-none" />
           </div>
        </div>
        <div class="mt-2 overflow-auto rounded-xl border">
          <table class="min-w-full bg-white">
            <thead class="bg-gray-50 text-xs text-gray-600">
              <tr>
                <th class="px-3 py-2 text-left">Nom</th>
                <th class="px-3 py-2 text-left">Prix</th>
                <th class="px-3 py-2 text-left">Stock</th>
              </tr>
            </thead>
            <tbody>
               <tr v-for="i in 5" :key="i" class="border-t">
                 <td class="px-3 py-2">Produit {{ i }}</td>
                 <td class="px-3 py-2">10000</td>
                 <td class="px-3 py-2">10</td>
               </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Active Content -->
    <div v-else>
      <div class="mt-4 flex items-center justify-between">
        <div class="flex items-center rounded-lg border bg-white px-3 py-2 w-full max-w-xl focus-within:ring-2 focus-within:ring-green-500 focus-within:border-transparent">
          <Search class="h-4 w-4 text-gray-500" />
          <input v-model="search" type="text" placeholder="Recherche par produit, par variante ou UGS" class="ml-2 w-full bg-transparent text-sm outline-none" />
        </div>
        <div class="flex items-center gap-2">
          <!-- Additional filters could go here -->
        </div>
      </div>

      <div class="mt-3 text-sm text-gray-600">
        <span v-if="modifiedIds.size > 0" class="text-amber-600 font-medium">
          {{ modifiedIds.size }} modification(s) en attente
        </span>
        <span v-else>Aucune modification</span>
      </div>

      <div class="mt-2 overflow-auto rounded-xl border max-h-[calc(100vh-250px)] relative">
        <table class="min-w-full bg-white border-separate border-spacing-0">
          <thead class="bg-gray-50 text-xs text-gray-600 sticky top-0 z-10 shadow-sm">
            <tr>
              <th class="px-3 py-2 text-left font-medium border-b bg-gray-50">Nom</th>
              <th class="px-3 py-2 text-left font-medium border-b bg-gray-50 w-24">Suivre inv.</th>
              <th class="px-3 py-2 text-left font-medium border-b bg-gray-50 w-24">Stock</th>
              <th class="px-3 py-2 text-left font-medium border-b bg-gray-50 w-32">UGS</th>
              <th class="px-3 py-2 text-left font-medium border-b bg-gray-50 w-28">Prix</th>
              <th class="px-3 py-2 text-left font-medium border-b bg-gray-50 w-28">Prix barré</th>
              <th class="px-3 py-2 text-left font-medium border-b bg-gray-50 w-24">Suivre coût</th>
              <th class="px-3 py-2 text-left font-medium border-b bg-gray-50 w-28">Coût</th>
              <th class="px-3 py-2 text-left font-medium border-b bg-gray-50 w-20">Visible</th>
              <th class="px-3 py-2 text-left font-medium border-b bg-gray-50 min-w-[200px]">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in rows" :key="p.id" class="group hover:bg-gray-50">
              <td class="px-3 py-2 border-b">
                <input v-model="p.name" type="text" class="w-48 rounded border-gray-300 px-2 py-1 text-sm focus:border-green-500 focus:ring-green-500" @input="markModified(p.id)" />
              </td>
              <td class="px-3 py-2 border-b text-center">
                <input type="checkbox" v-model="p.track_inventory" class="rounded text-green-600 focus:ring-green-500" @change="markModified(p.id)" />
              </td>
              <td class="px-3 py-2 border-b">
                <input v-model.number="p.stock_quantity" type="number" min="0" :disabled="!p.track_inventory" class="w-full rounded border-gray-300 px-2 py-1 text-sm focus:border-green-500 focus:ring-green-500 disabled:bg-gray-100 disabled:text-gray-400" @input="markModified(p.id)" />
              </td>
              <td class="px-3 py-2 border-b">
                <input v-model="p.sku" type="text" class="w-full rounded border-gray-300 px-2 py-1 text-sm focus:border-green-500 focus:ring-green-500" @input="markModified(p.id)" />
              </td>
              <td class="px-3 py-2 border-b">
                <input v-model.number="p.price" type="number" min="0" step="1" class="w-full rounded border-gray-300 px-2 py-1 text-sm focus:border-green-500 focus:ring-green-500" @input="markModified(p.id)" />
              </td>
              <td class="px-3 py-2 border-b">
                <input v-model.number="p.original_price" type="number" min="0" step="1" class="w-full rounded border-gray-300 px-2 py-1 text-sm focus:border-green-500 focus:ring-green-500" @input="markModified(p.id)" />
              </td>
              <td class="px-3 py-2 border-b text-center">
                <input type="checkbox" v-model="p.track_cost" class="rounded text-green-600 focus:ring-green-500" @change="markModified(p.id)" />
              </td>
              <td class="px-3 py-2 border-b">
                <input v-model.number="p.cost_per_item" type="number" min="0" step="1" :disabled="!p.track_cost" class="w-full rounded border-gray-300 px-2 py-1 text-sm focus:border-green-500 focus:ring-green-500 disabled:bg-gray-100 disabled:text-gray-400" @input="markModified(p.id)" />
              </td>
              <td class="px-3 py-2 border-b text-center">
                <input type="checkbox" v-model="p.is_visible" class="rounded text-green-600 focus:ring-green-500" @change="markModified(p.id)" />
              </td>
              <td class="px-3 py-2 border-b">
                <input v-model="p.description" type="text" class="w-full rounded border-gray-300 px-2 py-1 text-sm focus:border-green-500 focus:ring-green-500" @input="markModified(p.id)" />
              </td>
            </tr>
            <tr v-if="loading">
              <td colspan="10" class="px-4 py-12 text-center text-sm text-gray-500">
                <div class="flex flex-col items-center justify-center gap-2">
                  <div class="h-6 w-6 animate-spin rounded-full border-2 border-green-600 border-t-transparent"></div>
                  <span>Chargement des produits...</span>
                </div>
              </td>
            </tr>
            <tr v-if="!loading && rows.length===0">
              <td colspan="10" class="px-4 py-12 text-center text-sm text-gray-500">
                Aucun produit trouvé.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SupabaseClient } from '@supabase/supabase-js'
import { useAdminStore } from '~/stores/admin'
import { Search, Filter, ArrowUpDown } from 'lucide-vue-next'
import PremiumLock from '~/components/admin/PremiumLock.vue'
import { useToast } from '~/composables/useToast'

definePageMeta({ layout: 'admin' })

const nuxt = useNuxtApp()
const supabase = nuxt.$supabase as SupabaseClient
const admin = useAdminStore()
const toast = useToast()

const search = ref('')
const loading = ref(false)
const saving = ref(false)
const rows = ref<any[]>([])
const modifiedIds = reactive(new Set<string>())
let searchTimeout: NodeJS.Timeout

const isFreePlan = computed(() => admin.isFreePlan)

function markModified(id: string | number) {
  modifiedIds.add(String(id))
}

async function loadProducts() {
  if (isFreePlan.value) return // Don't load if locked

  const storeId = admin.selectedShopId
  if (!storeId) return

  loading.value = true
  try {
    let query = supabase.from('products')
      .select('id,name,sku,price,original_price,track_cost,cost_per_item,track_inventory,stock_quantity,is_visible,description')
      .eq('store_id', storeId)
      .order('created_at', { ascending: false })
      .limit(100)

    const term = String(search.value || '').trim()
    if (term) query = query.ilike('name', `%${term}%`)

    const { data, error } = await query
    if (error) throw error

    rows.value = Array.isArray(data) ? data.map((d: any) => ({ ...d })) : []
  } catch (e: any) {
    console.error(e)
    toast.error('Erreur lors du chargement: ' + e.message)
  } finally {
    loading.value = false
  }
}

async function save() {
  if (modifiedIds.size === 0) return
  
  saving.value = true
  const storeId = admin.selectedShopId
  const toUpdate = rows.value.filter(r => modifiedIds.has(String(r.id)))
  
  let successCount = 0
  let errorCount = 0

  try {
    // Process updates in parallel batches of 5 to avoid overwhelming but speed up
    const batchSize = 5
    for (let i = 0; i < toUpdate.length; i += batchSize) {
      const batch = toUpdate.slice(i, i + batchSize)
      await Promise.all(batch.map(async (r) => {
        try {
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
          const { error } = await supabase.from('products').update(patch).eq('id', r.id).eq('store_id', storeId)
          if (error) throw error
          successCount++
        } catch (e) {
          errorCount++
          console.error(`Failed to update product ${r.id}`, e)
        }
      }))
    }

    if (errorCount === 0) {
      toast.success(`${successCount} produit(s) mis à jour avec succès`)
      modifiedIds.clear()
    } else {
      toast.warning(`${successCount} mis à jour, ${errorCount} échec(s)`)
    }
  } catch (e: any) {
    toast.error('Erreur critique lors de la sauvegarde: ' + e.message)
  } finally {
    saving.value = false
  }
}

// Debounced search
watch(search, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadProducts()
  }, 500)
})

onMounted(async () => {
  if (!admin.selectedShopId) {
    // Basic auth/store check logic kept from original
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
  
  // Ensure subscription is loaded to check for free plan
  await admin.fetchSubscription(supabase)
  
  if (!isFreePlan.value) {
    await loadProducts()
  }
})

useHead({ title: 'Admin | Modification en bloc' })
</script>
