<template>
  <div>
    <div class="print:hidden">
      <div class="flex items-center justify-between flex-wrap gap-3">
      <h1 class="text-2xl font-bold">{{ t('admin.ordersPage.title') }}</h1>
      <div class="flex items-center gap-2 flex-wrap">
        <select v-model="statusFilter" class="rounded border px-3 py-2 text-sm w-full sm:w-auto">
          <option value="">{{ t('admin.ordersPage.statusAll') }}</option>
          <option value="new">{{ t('admin.ordersPage.status.new') }}</option>
          <option value="sent_to_whatsapp">{{ t('admin.ordersPage.status.sent_to_whatsapp') }}</option>
          <option value="processing">{{ t('admin.ordersPage.status.processing') }}</option>
          <option value="completed">{{ t('admin.ordersPage.status.completed') }}</option>
          <option value="cancelled">{{ t('admin.ordersPage.status.cancelled') }}</option>
        </select>
        <input type="date" v-model="startDateStr" class="rounded border px-3 py-2 text-sm w-full sm:w-auto" />
        <div class="flex items-center rounded-lg border bg-white px-3 py-2 w-full max-w-xl min-w-0">
          <Search class="h-4 w-4 text-gray-500" />
          <input v-model.trim="search" type="text" :placeholder="t('admin.ordersPage.searchPlaceholder')" class="ml-2 w-full bg-transparent text-sm outline-none" />
        </div>
        <NuxtLink to="/admin/orders/new" class="rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white whitespace-nowrap">
          {{ t('admin.ordersPage.create') }}
        </NuxtLink>
      </div>
    </div>

    <div class="mt-4 overflow-x-auto rounded-xl border">
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
          <tr v-for="o in orders" :key="o.id" class="border-t align-top">
            <td class="px-4 py-3">
              <div class="text-sm">{{ formatDate(o.created_at) }}</div>
            </td>
            <td class="px-4 py-3">
              <div class="font-medium">{{ o.customer_name }}</div>
              <div class="text-xs text-gray-500">{{ o.customer_email || '—' }}</div>
            </td>
            <td class="px-4 py-3">
              <div class="text-sm">{{ o.customer_phone }}</div>
            </td>
            <td class="px-4 py-3">
              <div>FCFA {{ formatNumber(Number(o.total_amount || 0)) }}</div>
            </td>
            <td class="px-4 py-3">
              <select 
                v-model="o.status" 
                class="rounded border px-2 py-1 text-xs font-medium"
                :class="statusClass(o.status)"
                @change="updateStatus(o)"
              >
                <option value="new">{{ t('admin.ordersPage.status.new') }}</option>
                <option value="sent_to_whatsapp">{{ t('admin.ordersPage.status.sent_to_whatsapp') }}</option>
                <option value="processing">{{ t('admin.ordersPage.status.processing') }}</option>
                <option value="completed">{{ t('admin.ordersPage.status.completed') }}</option>
                <option value="cancelled">{{ t('admin.ordersPage.status.cancelled') }}</option>
              </select>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-2">
                <button class="rounded border px-2 py-1 text-xs hover:bg-gray-50" @click="toggleExpand(o.id)">{{ t('admin.ordersPage.details') }}</button>
                <button class="rounded border px-2 py-1 text-xs hover:bg-gray-50" @click="printReceipt(o)">
                   <Printer class="h-3 w-3" />
                </button>
                <button class="rounded border px-2 py-1 text-xs text-red-600 hover:bg-red-50" @click="deleteOrder(o)">{{ t('admin.ordersPage.delete') }}</button>
              </div>
            </td>
          </tr>
          <tr v-for="o in orders" :key="o.id + ':exp'" v-show="expanded.has(String(o.id))" class="border-t bg-gray-50">
            <td colspan="6" class="px-4 py-3">
              <div class="font-semibold text-sm">{{ t('admin.ordersPage.itemsTitle') }}</div>
              <div class="mt-2 grid gap-2 md:grid-cols-2">
                <div v-for="it in orderItems[o.id] || []" :key="it.id" class="rounded border bg-white p-3">
                  <div class="font-medium">{{ it.product_name }}</div>
                  <div class="text-xs text-gray-600">{{ t('admin.ordersPage.itemLine', { qty: it.quantity, price: formatNumber(Number(it.unit_price || 0)) }) }}</div>
                </div>
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
    </div>

    <!-- Receipt Modal -->
    <div v-if="showReceipt" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 print:p-0 print:bg-white print:block print:static">
      <div class="w-full max-w-sm bg-white rounded-lg shadow-xl overflow-hidden print:shadow-none print:w-full print:max-w-none">
        <div class="flex items-center justify-between p-4 border-b print:hidden">
          <h3 class="font-bold">{{ t('admin.ordersPage.receiptTitle') }}</h3>
          <button @click="showReceipt = false" class="p-1 hover:bg-gray-100 rounded"><X class="h-5 w-5" /></button>
        </div>
        
        <div class="p-6 text-sm font-mono" id="receipt-content">
          <div class="text-center mb-6">
             <div class="font-bold text-xl mb-1">{{ storeName || t('admin.ordersPage.storeFallback') }}</div>
             <div class="text-gray-500 text-xs">{{ receiptOrder?.created_at ? new Date(receiptOrder.created_at).toLocaleString(getDateLocale()) : '' }}</div>
             <div class="text-xs mt-1">{{ t('admin.ordersPage.orderNumber', { id: receiptOrder?.id?.slice(0, 8) }) }}</div>
          </div>
          
          <div class="border-b border-dashed border-gray-300 my-4"></div>
          
          <div class="space-y-3">
             <div v-for="item in receiptItems" :key="item.id" class="flex justify-between items-start">
                <div>
                  <div class="font-medium">{{ item.product_name }}</div>
                  <div class="text-xs text-gray-500">{{ t('admin.ordersPage.receiptItemLine', { qty: item.quantity, price: formatNumber(Number(item.unit_price)) }) }}</div>
                </div>
                <div class="font-medium">{{ formatNumber(Number(item.unit_price * item.quantity)) }}</div>
             </div>
          </div>
          
          <div class="border-b border-dashed border-gray-300 my-4"></div>
          
          <div class="flex justify-between font-bold text-lg">
             <div>{{ t('admin.ordersPage.total') }}</div>
             <div>FCFA {{ formatNumber(Number(receiptOrder?.total_amount || 0)) }}</div>
          </div>

          <div class="mt-4 pt-4 border-t border-dashed border-gray-300">
             <div class="flex justify-between text-xs text-gray-600">
               <span>{{ t('admin.ordersPage.customer') }}</span>
               <span>{{ receiptOrder?.customer_name }}</span>
             </div>
             <div class="flex justify-between text-xs text-gray-600 mt-1" v-if="receiptOrder?.customer_phone">
               <span>{{ t('admin.ordersPage.phone') }}</span>
               <span>{{ receiptOrder?.customer_phone }}</span>
             </div>
          </div>
          
          <div class="mt-8 text-center text-xs text-gray-500">
             {{ t('admin.ordersPage.thankYou') }}
          </div>
        </div>
        
        <div class="p-4 border-t bg-gray-50 print:hidden">
          <button @click="triggerPrint" class="w-full bg-gray-900 text-white rounded-lg py-3 font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors">
            <Printer class="h-4 w-4" /> {{ t('admin.ordersPage.printReceipt') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SupabaseClient } from '@supabase/supabase-js'
import { useAdminStore } from '~/stores/admin'
import { useI18n } from '~/composables/i18n'
import { Search, Printer, X } from 'lucide-vue-next'
definePageMeta({ layout: 'admin' })
const nuxt = useNuxtApp()
const supabase = nuxt.$supabase as SupabaseClient
const admin = useAdminStore()
const { t, locale } = useI18n()
const search = ref('')
const statusFilter = ref<string>('')
const startDate = ref(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
const startDateStr = computed({
  get() { return startDate.value.toISOString().slice(0, 10) },
  set(v: string) { startDate.value = new Date(v) }
})
const orders = ref<any[]>([])
const orderItems = reactive<Record<string, any[]>>({})
const expanded = reactive(new Set<string>())
const loading = ref(false)
const showReceipt = ref(false)
const receiptOrder = ref<any>(null)
const receiptItems = ref<any[]>([])
const storeName = ref('')

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800 border-blue-200',
  sent_to_whatsapp: 'bg-green-100 text-green-800 border-green-200',
  processing: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  completed: 'bg-gray-100 text-gray-800 border-gray-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200'
}

function statusClass(status: string) {
  return statusColors[status] || 'bg-white text-gray-700 border-gray-300'
}

function formatDate(d: string) {
  try { return new Date(d).toLocaleString(getDateLocale()) } catch { return d }
}
function toggleExpand(id: string) {
  const key = String(id)
  if (expanded.has(key)) { expanded.delete(key); return }
  expanded.add(key)
  loadOrderItems(key)
}
async function loadOrderItems(orderId: string) {
  const { data } = await supabase.from('order_items').select('id,product_name,unit_price,quantity').eq('order_id', orderId)
  orderItems[orderId] = Array.isArray(data) ? data : []
  return orderItems[orderId]
}

async function printReceipt(o: any) {
  receiptOrder.value = o
  receiptItems.value = []
  showReceipt.value = true
  if (orderItems[o.id]) {
    receiptItems.value = orderItems[o.id]
  } else {
    receiptItems.value = await loadOrderItems(o.id)
  }
}

function triggerPrint() {
  window.print()
}

async function loadOrders() {
  const storeId = admin.selectedShopId
  if (!storeId) return
  loading.value = true
  let query = supabase.from('orders').select('id,customer_name,customer_phone,customer_email,total_amount,status,created_at').eq('store_id', storeId).gte('created_at', startDate.value.toISOString())
  const term = String(search.value || '').trim()
  if (term) query = query.or(`customer_name.ilike.%${term}%,customer_phone.ilike.%${term}%`)
  if (statusFilter.value) query = query.eq('status', statusFilter.value)
  const { data } = await query.order('created_at', { ascending: false })
  orders.value = Array.isArray(data) ? data : []
  loading.value = false
}
async function updateStatus(o: any) {
  const storeId = admin.selectedShopId
  if (!storeId) return
  await supabase.from('orders').update({ status: o.status }).eq('id', o.id).eq('store_id', storeId)
}
async function deleteOrder(o: any) {
  const storeId = admin.selectedShopId
  if (!storeId) return
  if (!confirm(t('admin.ordersPage.deleteConfirm'))) return
  await supabase.from('orders').delete().eq('id', o.id).eq('store_id', storeId)
  await loadOrders()
}

async function loadStoreName() {
  if (!admin.selectedShopId) return
  const { data } = await supabase.from('stores').select('name').eq('id', admin.selectedShopId).maybeSingle()
  if (data) storeName.value = data.name
}

watch([search, statusFilter, startDate], () => loadOrders())
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
  await loadStoreName()
  await loadOrders()
})
useHead({ title: t('admin.ordersPage.headTitle') })

function getDateLocale() {
  if (locale.value === 'it') return 'it-IT'
  if (locale.value === 'en') return 'en-US'
  return 'fr-FR'
}

function formatNumber(n: number) {
  try {
    return Number(n || 0).toLocaleString(getDateLocale())
  } catch {
    return String(n || 0)
  }
}
</script>
