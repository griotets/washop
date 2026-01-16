<template>
  <div>
    <div class="flex items-center justify-between flex-wrap gap-3">
      <h1 class="text-2xl font-bold">{{ t('admin.ordersPage.title') }}</h1>
      <div class="flex items-center gap-2 flex-wrap">
        <div class="flex items-center rounded-lg border bg-white px-3 py-2 w-full max-w-xl min-w-0 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
          <Search class="h-4 w-4 text-gray-500" />
          <input v-model.trim="search" type="text" :placeholder="t('admin.ordersPage.searchPlaceholder')" class="ml-2 w-full bg-transparent text-sm outline-none" />
        </div>
        <select v-model="statusFilter" class="rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-primary">
          <option value="">{{ t('admin.ordersPage.statusAll') }}</option>
          <option value="new">{{ t('admin.ordersPage.status.new') }}</option>
          <option value="sent_to_whatsapp">{{ t('admin.ordersPage.status.sent_to_whatsapp') }}</option>
          <option value="processing">{{ t('admin.ordersPage.status.processing') }}</option>
          <option value="completed">{{ t('admin.ordersPage.status.completed') }}</option>
          <option value="cancelled">{{ t('admin.ordersPage.status.cancelled') }}</option>
        </select>
        <NuxtLink to="/admin/orders/new" class="rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white">{{ t('admin.ordersPage.create') }}</NuxtLink>
      </div>
    </div>

    <div class="mt-4 rounded-xl border bg-white">
      <!-- Desktop table -->
      <div class="hidden md:block overflow-x-auto">
        <table class="min-w-full bg-white">
          <thead class="bg-gray-50 text-sm text-gray-600">
            <tr>
              <th class="px-4 py-3 text-left">{{ t('admin.ordersPage.colDate') }}</th>
              <th class="px-4 py-3 text-left">{{ t('admin.ordersPage.colClient') }}</th>
              <th class="px-4 py-3 text-left">{{ t('admin.ordersPage.colPhone') }}</th>
              <th class="px-4 py-3 text-left">{{ t('admin.ordersPage.colTotal') }}</th>
              <th class="px-4 py-3 text-left">{{ t('admin.ordersPage.colStatus') }}</th>
              <th class="px-4 py-3 text-left">{{ t('admin.ordersPage.colActions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="o in orders" :key="o.id" class="border-t">
              <td class="px-4 py-3 text-sm">{{ formatDate(o.created_at) }}</td>
              <td class="px-4 py-3">
                <div class="font-medium">{{ o.client_name || o.client?.name || '—' }}</div>
              </td>
              <td class="px-4 py-3 text-sm">{{ o.client_phone || o.client?.phone || '—' }}</td>
              <td class="px-4 py-3 font-medium">FCFA {{ Number(o.total_price || 0).toLocaleString(getNumberLocale()) }}</td>
              <td class="px-4 py-3">
                <span class="inline-flex rounded-full px-2 py-1 text-xs font-semibold" :class="statusColor(o.status)">
                  {{ t(`admin.ordersPage.status.${o.status}`) }}
                </span>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <NuxtLink :to="`/admin/orders/${o.id}`" class="rounded border px-2 py-1 text-xs">{{ t('admin.ordersPage.details') }}</NuxtLink>
                  <button class="rounded border px-2 py-1 text-xs text-red-600" @click="deleteOrder(o)">{{ t('admin.ordersPage.delete') }}</button>
                </div>
              </td>
            </tr>
            <tr v-if="loading">
              <td colspan="6" class="px-4 py-6 text-center text-sm text-gray-500">{{ t('admin.ordersPage.loading') }}</td>
            </tr>
            <tr v-if="!loading && orders.length===0">
              <td colspan="6" class="px-4 py-6 text-center text-sm text-gray-500">{{ t('admin.ordersPage.empty') }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile cards -->
      <div class="md:hidden divide-y divide-gray-100">
        <div v-for="o in orders" :key="o.id" class="px-4 py-3">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <div class="text-xs text-gray-500">{{ formatDate(o.created_at) }}</div>
              <div class="mt-1 font-medium text-sm truncate">
                {{ o.client_name || o.client?.name || '—' }}
              </div>
              <div class="mt-1 text-xs text-gray-700">
                <div>{{ o.client_phone || o.client?.phone || '—' }}</div>
              </div>
              <div class="mt-1 text-sm font-semibold">
                FCFA {{ Number(o.total_price || 0).toLocaleString(getNumberLocale()) }}
              </div>
              <div class="mt-1">
                <span class="inline-flex rounded-full px-2 py-1 text-[11px] font-semibold" :class="statusColor(o.status)">
                  {{ t(`admin.ordersPage.status.${o.status}`) }}
                </span>
              </div>
            </div>
            <div class="flex flex-col items-end gap-1">
              <NuxtLink :to="`/admin/orders/${o.id}`" class="rounded border px-2 py-1 text-[11px]">
                {{ t('admin.ordersPage.details') }}
              </NuxtLink>
              <button class="rounded border px-2 py-1 text-[11px] text-red-600" @click="deleteOrder(o)">
                {{ t('admin.ordersPage.delete') }}
              </button>
            </div>
          </div>
        </div>
        <div v-if="loading" class="px-4 py-6 text-center text-sm text-gray-500">
          {{ t('admin.ordersPage.loading') }}
        </div>
        <div v-if="!loading && orders.length===0" class="px-4 py-6 text-center text-sm text-gray-500">
          {{ t('admin.ordersPage.empty') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SupabaseClient } from '@supabase/supabase-js'
import { useAdminStore } from '~/stores/admin'
import { useI18n } from '~/composables/i18n'
import { Search } from 'lucide-vue-next'

definePageMeta({ layout: 'admin' })
const nuxt = useNuxtApp()
const supabase = nuxt.$supabase as SupabaseClient
const admin = useAdminStore()
const { t, locale } = useI18n()

const search = ref('')
const statusFilter = ref('')
const orders = ref<any[]>([])
const loading = ref(false)

function getNumberLocale() {
  if (locale.value === 'fr') return 'fr-FR'
  if (locale.value === 'it') return 'it-IT'
  return 'en-US'
}
function getDateLocale() {
  if (locale.value === 'fr') return 'fr-FR'
  if (locale.value === 'it') return 'it-IT'
  return 'en-US'
}
function formatDate(d: string) {
  try { return new Date(d).toLocaleDateString(getDateLocale(), { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) } catch { return d }
}

function statusColor(s: string) {
  switch (s) {
    case 'new': return 'bg-blue-100 text-blue-800'
    case 'sent_to_whatsapp': return 'bg-green-100 text-green-800'
    case 'processing': return 'bg-yellow-100 text-yellow-800'
    case 'completed': return 'bg-gray-100 text-gray-800'
    case 'cancelled': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

async function loadOrders() {
  const storeId = admin.selectedShopId
  if (!storeId) return
  loading.value = true
  let query = supabase.from('orders').select('*, client:client_id(name,phone)').eq('store_id', storeId)
  
  if (statusFilter.value) {
    query = query.eq('status', statusFilter.value)
  }
  
  const { data } = await query.order('created_at', { ascending: false })
  orders.value = Array.isArray(data) ? data : []
  
  // Client-side filtering for search
  const term = String(search.value || '').trim()
  if (term) {
    const lower = term.toLowerCase()
    orders.value = orders.value.filter(o => {
      const name = (o.client_name || o.client?.name || '').toLowerCase()
      const phone = (o.client_phone || o.client?.phone || '').toLowerCase()
      const id = String(o.id)
      return name.includes(lower) || phone.includes(lower) || id.includes(lower)
    })
  }

  loading.value = false
}

async function deleteOrder(o: any) {
  if (!confirm(t('admin.ordersPage.deleteConfirm'))) return
  const storeId = admin.selectedShopId
  const { error } = await supabase.from('orders').delete().eq('id', o.id).eq('store_id', storeId)
  if (!error) loadOrders()
}

watch([search, statusFilter], () => loadOrders())

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
  loadOrders()
})

useHead({ title: t('admin.ordersPage.headTitle') })
</script>
