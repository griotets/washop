<template>
  <div>
    <div class="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div class="space-y-6">
        <div class="rounded-xl border bg-white p-6">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">{{ rangeLabel }}</div>
            <input type="date" class="rounded border px-2 py-1 text-sm" v-model="rangeStartStr" />
          </div>
          <div class="mt-4 grid gap-4 sm:grid-cols-3">
            <div class="rounded-lg border bg-white p-4">
              <div class="text-xs text-gray-600">Points de vue</div>
              <div class="mt-1 text-2xl font-bold">{{ metrics.views }}</div>
            </div>
            <div class="rounded-lg border bg-white p-4">
              <div class="text-xs text-gray-600">Commandes</div>
              <div class="mt-1 text-2xl font-bold">{{ metrics.orders }}</div>
            </div>
            <div class="rounded-lg border bg-white p-4">
              <div class="text-xs text-gray-600">Vente</div>
              <div class="mt-1 text-2xl font-bold">FCFA {{ metrics.sales.toLocaleString('fr-FR') }}</div>
            </div>
          </div>
        </div>

        <div class="rounded-xl border bg-white p-6">
          <div class="flex items-center justify-between">
            <div class="font-semibold">Commandes</div>
            <button class="inline-flex items-center gap-1 rounded border px-2 py-1 text-sm">
              <Plus class="h-4 w-4" />
              <span>Ajouter</span>
            </button>
          </div>
          <div class="mt-4 h-32 rounded bg-gray-100"></div>
        </div>

        <div class="rounded-xl border bg-white p-6">
          <div class="font-semibold">Ajoutez vos communautés</div>
          <div class="mt-4 space-y-3">
            <div class="flex items-center gap-3">
              <div class="h-8 w-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                <MessageCircle class="h-4 w-4" />
              </div>
              <input v-model.trim="communities.whatsapp" type="text" class="flex-1 rounded-lg border px-3 py-2 text-sm" placeholder="Lien vers un groupe, une communauté ou un canal" />
            </div>
            <div class="flex items-center gap-3">
              <div class="h-8 w-8 rounded-full bg-pink-500 text-white flex items-center justify-center">
                <Instagram class="h-4 w-4" />
              </div>
              <input v-model.trim="communities.instagram" type="text" class="flex-1 rounded-lg border px-3 py-2 text-sm" placeholder="Lien vers un groupe, un canal ou un profil" />
            </div>
            <div class="flex items-center gap-3">
              <div class="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                <Facebook class="h-4 w-4" />
              </div>
              <input v-model.trim="communities.facebook" type="text" class="flex-1 rounded-lg border px-3 py-2 text-sm" placeholder="Lien vers un groupe ou une page" />
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="rounded-xl border bg-white p-6">
          <div class="flex items-center justify-between">
            <div class="font-semibold">Basic plan</div>
            <button class="rounded-lg bg-green-600 px-3 py-1.5 text-sm font-semibold text-white">Mise à niveau</button>
          </div>
          <div class="mt-4 space-y-2 text-sm">
            <NuxtLink to="/admin/products" class="flex items-center justify-between rounded border px-3 py-2">
              <span>Ajouter des produits</span>
              <ExternalLink class="h-4 w-4 text-gray-500" />
            </NuxtLink>

            <NuxtLink to="/admin/clients/new" class="flex items-center justify-between rounded border px-3 py-2">
              <span>Ajouter un nouveau client</span>
              <ExternalLink class="h-4 w-4 text-gray-500" />
            </NuxtLink>

            <NuxtLink to="/admin/orders/new" class="flex items-center justify-between rounded border px-3 py-2">
              <span>Ajouter une commande</span>
              <ExternalLink class="h-4 w-4 text-gray-500" />
            </NuxtLink>

            <NuxtLink to="/support" class="flex items-center justify-between rounded border px-3 py-2">
              <span>Service d'assistance</span>
              <ExternalLink class="h-4 w-4 text-gray-500" />
            </NuxtLink>
          </div>
        </div>

        <div class="rounded-xl border bg-white p-6">
          <div class="font-semibold">Recevez des mises à jour et des promotions</div>
          <p class="mt-2 text-sm text-gray-600">Suivez‑nous pour rester informé des dernières fonctionnalités et astuces.</p>
          <div class="mt-3 flex items-center gap-3">
            <MessageCircle class="h-5 w-5 text-green-600" />
            <Instagram class="h-5 w-5 text-pink-600" />
            <Facebook class="h-5 w-5 text-blue-600" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SupabaseClient } from '@supabase/supabase-js'
import { useAdminStore } from '~/stores/admin'
import { Plus, ExternalLink, MessageCircle, Instagram, Facebook } from 'lucide-vue-next'
definePageMeta({ layout: 'admin' })
const nuxt = useNuxtApp()
const supabase = nuxt.$supabase as SupabaseClient
const admin = useAdminStore()
const metrics = reactive({ views: 0, orders: 0, sales: 0 })
const rangeStart = ref(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
const rangeEnd = ref(new Date())
const rangeStartStr = computed({
  get() { return rangeStart.value.toISOString().slice(0, 10) },
  set(v: string) { rangeStart.value = new Date(v) }
})
const rangeLabel = computed(() => {
  const s = rangeStart.value.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
  const e = rangeEnd.value.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
  return `${s} — ${e}`
})
const communities = reactive<{ whatsapp: string; instagram: string; facebook: string }>({ whatsapp: '', instagram: '', facebook: '' })
watch(() => admin.selectedShopId, async () => {
  const { data: sone } = await supabase.from('stores').select('slug').eq('id', admin.selectedShopId).maybeSingle()
  const slug = String(sone?.slug || '')
  if (!slug) return
  try {
    const raw = localStorage.getItem(`community:${slug}`)
    const v = raw ? JSON.parse(raw) : null
    communities.whatsapp = v?.whatsapp || ''
    communities.instagram = v?.instagram || ''
    communities.facebook = v?.facebook || ''
  } catch {}
})
watch(communities, () => {
  const currentStoreId = admin.selectedShopId
  if (!currentStoreId) return
  // persist by slug
  ;(async () => {
    const { data: sone } = await supabase.from('stores').select('slug').eq('id', currentStoreId).maybeSingle()
    const slug = String(sone?.slug || '')
    if (!slug) return
    try { localStorage.setItem(`community:${slug}`, JSON.stringify(communities)) } catch {}
  })()
}, { deep: true })

onMounted(async () => {
  const { data } = await supabase.auth.getUser()
  const uid = data?.user?.id
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
  await loadMetrics()
})

async function loadMetrics() {
  const currentStoreId = admin.selectedShopId
  if (!currentStoreId) return
  const startIso = rangeStart.value.toISOString()
  const { count: viewsCount } = await supabase.from('analytics_log').select('id', { count: 'exact', head: true }).eq('store_id', currentStoreId).eq('event_type', 'page_view').gte('created_at', startIso)
  metrics.views = Number(viewsCount || 0)
  const { data: ordersData } = await supabase.from('orders').select('id,total_amount,created_at,status').eq('store_id', currentStoreId).gte('created_at', startIso)
  const rows = Array.isArray(ordersData) ? ordersData : []
  metrics.orders = rows.length
  metrics.sales = rows
    .filter((r: any) => r.status !== 'cancelled')
    .reduce((sum: number, r: any) => sum + Number(r.total_amount || 0), 0)

  // Fetch recent orders
  const { data: recent } = await supabase
    .from('orders')
    .select('id, created_at, total_amount, status, customer_name')
    .eq('store_id', currentStoreId)
    .order('created_at', { ascending: false })
    .limit(5)
  recentOrders.value = recent || []
}

watch(rangeStart, () => { loadMetrics() })
useHead({ title: 'Admin | Tableau de bord' })
</script>
