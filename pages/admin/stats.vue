<template>
  <div>
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">{{ t('admin.stats.title') }}</h1>
      <div class="flex items-center gap-2">
        <input type="date" v-model="startDateStr" class="rounded border px-3 py-2 text-sm" />
        <input type="date" v-model="endDateStr" class="rounded border px-3 py-2 text-sm" />
      </div>
    </div>

    <div class="mt-6 grid gap-6 sm:grid-cols-3">
      <div class="rounded-xl border bg-white p-6">
        <div class="text-sm text-gray-500">{{ t('admin.stats.views') }}</div>
        <div class="mt-2 text-3xl font-semibold">{{ metrics.views }}</div>
      </div>
      <div class="rounded-xl border bg-white p-6">
        <div class="text-sm text-gray-500">{{ t('admin.stats.orders') }}</div>
        <div class="mt-2 text-3xl font-semibold">{{ metrics.orders }}</div>
      </div>
      <div class="rounded-xl border bg-white p-6">
        <div class="text-sm text-gray-500">{{ t('admin.stats.sales') }}</div>
        <div class="mt-2 text-3xl font-semibold">FCFA {{ Number(metrics.sales || 0).toLocaleString('fr-FR') }}</div>
      </div>
    </div>

    <div class="mt-6 grid gap-6 lg:grid-cols-2">
      <div class="rounded-xl border bg-white p-6">
        <div class="font-semibold">{{ t('admin.stats.topProducts') }}</div>
        <div class="mt-3">
          <table class="min-w-full">
            <thead class="bg-gray-50 text-sm text-gray-600">
              <tr>
                <th class="px-4 py-3 text-left">{{ t('admin.stats.colProduct') }}</th>
                <th class="px-4 py-3 text-left">{{ t('admin.stats.colQuantity') }}</th>
                <th class="px-4 py-3 text-left">{{ t('admin.stats.colRevenue') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in topProducts" :key="p.name" class="border-t">
                <td class="px-4 py-3">{{ p.name }}</td>
                <td class="px-4 py-3">{{ p.qty }}</td>
                <td class="px-4 py-3">FCFA {{ Number(p.revenue || 0).toLocaleString('fr-FR') }}</td>
              </tr>
              <tr v-if="topProducts.length===0">
                <td colspan="3" class="px-4 py-6 text-center text-sm text-gray-500">{{ t('admin.stats.noData') }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="rounded-xl border bg-white p-6">
        <div class="font-semibold">{{ t('admin.stats.events') }}</div>
        <div class="mt-3 grid gap-2 sm:grid-cols-2">
          <div class="rounded border p-3">
            <div class="text-sm text-gray-600">{{ t('admin.stats.eventPageViews') }}</div>
            <div class="mt-1 font-semibold">{{ events.page_view }}</div>
          </div>
          <div class="rounded border p-3">
            <div class="text-sm text-gray-600">{{ t('admin.stats.eventProductViews') }}</div>
            <div class="mt-1 font-semibold">{{ events.product_view }}</div>
          </div>
          <div class="rounded border p-3">
            <div class="text-sm text-gray-600">{{ t('admin.stats.eventAddToCart') }}</div>
            <div class="mt-1 font-semibold">{{ events.add_to_cart }}</div>
          </div>
          <div class="rounded border p-3">
            <div class="text-sm text-gray-600">{{ t('admin.stats.eventWhatsAppClicks') }}</div>
            <div class="mt-1 font-semibold">{{ events.whatsapp_click }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SupabaseClient } from '@supabase/supabase-js'
import { useAdminStore } from '~/stores/admin'
import { useI18n } from '~/composables/i18n'
definePageMeta({ layout: 'admin' })
const { t } = useI18n()
const nuxt = useNuxtApp()
const supabase = nuxt.$supabase as SupabaseClient
const admin = useAdminStore()
const startDate = ref(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
const endDate = ref(new Date())
const startDateStr = computed({
  get() { return startDate.value.toISOString().slice(0, 10) },
  set(v: string) { startDate.value = new Date(v) }
})
const endDateStr = computed({
  get() { return endDate.value.toISOString().slice(0, 10) },
  set(v: string) { endDate.value = new Date(v) }
})
const metrics = reactive<{ views: number; orders: number; sales: number }>({ views: 0, orders: 0, sales: 0 })
const events = reactive<Record<string, number>>({ page_view: 0, product_view: 0, add_to_cart: 0, whatsapp_click: 0 })
const topProducts = ref<Array<{ name: string; qty: number; revenue: number }>>([])
async function loadMetrics() {
  const storeId = admin.selectedShopId
  if (!storeId) return
  const startIso = startDate.value.toISOString()
  const endIso = endDate.value.toISOString()
  const { count: viewsCount } = await supabase.from('analytics_log').select('id', { count: 'exact', head: true }).eq('store_id', storeId).eq('event_type', 'page_view').gte('created_at', startIso).lte('created_at', endIso)
  metrics.views = Number(viewsCount || 0)
  const { data: ordersData } = await supabase.from('orders').select('id,total_amount,created_at').eq('store_id', storeId).gte('created_at', startIso).lte('created_at', endIso)
  const rows = Array.isArray(ordersData) ? ordersData : []
  metrics.orders = rows.length
  metrics.sales = rows.reduce((sum: number, r: any) => sum + Number(r.total_amount || 0), 0)
}
async function loadEvents() {
  const storeId = admin.selectedShopId
  if (!storeId) return
  const startIso = startDate.value.toISOString()
  const endIso = endDate.value.toISOString()
  for (const t of ['page_view','product_view','add_to_cart','whatsapp_click']) {
    const { count } = await supabase.from('analytics_log').select('id', { count: 'exact', head: true }).eq('store_id', storeId).eq('event_type', t).gte('created_at', startIso).lte('created_at', endIso)
    events[t] = Number(count || 0)
  }
}
async function loadTopProducts() {
  const storeId = admin.selectedShopId
  if (!storeId) return
  const startIso = startDate.value.toISOString()
  const endIso = endDate.value.toISOString()
  const { data } = await supabase.from('order_items').select('product_name,unit_price,quantity,created_at').gte('created_at', startIso).lte('created_at', endIso)
  const rows = Array.isArray(data) ? data : []
  const map: Record<string, { qty: number; revenue: number }> = {}
  for (const r of rows) {
    const name = String(r.product_name || '')
    const qty = Number(r.quantity || 0)
    const rev = Number(r.unit_price || 0) * qty
    map[name] = map[name] || { qty: 0, revenue: 0 }
    map[name].qty += qty
    map[name].revenue += rev
  }
  const list = Object.entries(map).map(([name, v]) => ({ name, qty: v.qty, revenue: v.revenue })).sort((a, b) => b.revenue - a.revenue).slice(0, 10)
  topProducts.value = list
}
watch([startDate, endDate], async () => {
  await loadMetrics()
  await loadEvents()
  await loadTopProducts()
})
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
  await loadMetrics()
  await loadEvents()
  await loadTopProducts()
})
useHead({ title: t('admin.stats.headTitle') })
</script>
