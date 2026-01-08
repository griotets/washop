<template>
  <div>
    <div class="flex items-center justify-between flex-wrap gap-3">
      <h1 class="text-2xl font-bold">{{ t('admin.clientsPage.title') }}</h1>
      <div class="flex items-center gap-2 flex-wrap">
        <div class="flex items-center rounded-lg border bg-white px-3 py-2 w-full max-w-xl min-w-0">
          <Search class="h-4 w-4 text-gray-500" />
          <input v-model.trim="search" type="text" :placeholder="t('admin.clientsPage.searchPlaceholder')" class="ml-2 w-full bg-transparent text-sm outline-none" />
        </div>
        <NuxtLink to="/admin/clients/new" class="rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white">{{ t('admin.clientsPage.addClient') }}</NuxtLink>
      </div>
    </div>

    <div class="mt-4 overflow-x-auto rounded-xl border">
      <table class="min-w-full bg-white">
        <thead class="bg-gray-50 text-sm text-gray-600">
          <tr>
            <th class="px-4 py-3 text-left">{{ t('admin.clientsPage.colName') }}</th>
            <th class="px-4 py-3 text-left">{{ t('admin.clientsPage.colPhone') }}</th>
            <th class="px-4 py-3 text-left">{{ t('admin.clientsPage.colEmail') }}</th>
            <th class="px-4 py-3 text-left">{{ t('admin.clientsPage.colCreatedAt') }}</th>
            <th class="px-4 py-3 text-left">{{ t('admin.clientsPage.colActions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in clients" :key="c.id" class="border-t">
            <td class="px-4 py-3">
              <div class="font-medium">{{ c.name }}</div>
              <div class="text-xs text-gray-500">{{ c.address || '—' }}</div>
            </td>
            <td class="px-4 py-3">{{ c.phone }}</td>
            <td class="px-4 py-3">{{ c.email || '—' }}</td>
            <td class="px-4 py-3">{{ formatDate(c.created_at) }}</td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-2">
                <NuxtLink :to="`/admin/clients/${c.id}`" class="rounded border px-2 py-1 text-xs">{{ t('admin.clientsPage.edit') }}</NuxtLink>
                <button class="rounded border px-2 py-1 text-xs" @click="deleteClient(c)">{{ t('admin.clientsPage.delete') }}</button>
              </div>
            </td>
          </tr>
          <tr v-if="loading">
            <td colspan="5" class="px-4 py-6 text-center text-sm text-gray-500">{{ t('admin.clientsPage.loading') }}</td>
          </tr>
          <tr v-if="!loading && clients.length===0">
            <td colspan="5" class="px-4 py-6 text-center text-sm text-gray-500">{{ t('admin.clientsPage.empty') }}</td>
          </tr>
        </tbody>
      </table>
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
const clients = ref<any[]>([])
const loading = ref(false)

function getDateLocale() {
  if (locale.value === 'fr') return 'fr-FR'
  if (locale.value === 'it') return 'it-IT'
  return 'en-US'
}
function formatDate(d: string) {
  try { return new Date(d).toLocaleDateString(getDateLocale()) } catch { return d }
}
async function loadClients() {
  const storeId = admin.selectedShopId
  if (!storeId) return
  loading.value = true
  let query = supabase.from('clients').select('id,name,phone,email,address,created_at').eq('store_id', storeId)
  const term = String(search.value || '').trim()
  if (term) query = query.or(`name.ilike.%${term}%,phone.ilike.%${term}%,email.ilike.%${term}%`)
  const { data } = await query.order('created_at', { ascending: false })
  clients.value = Array.isArray(data) ? data : []
  loading.value = false
}
async function deleteClient(c: any) {
  const storeId = admin.selectedShopId
  if (!storeId) return
  if (!confirm(t('admin.clientsPage.deleteConfirm'))) return
  await supabase.from('clients').delete().eq('id', c.id).eq('store_id', storeId)
  await loadClients()
}
watch(search, () => loadClients())
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
  await loadClients()
})
useHead({ title: t('admin.clientsPage.headTitle') })
</script>
