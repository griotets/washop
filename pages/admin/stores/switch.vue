<template>
  <main class="mx-auto max-w-5xl px-6 py-12">
    <h1 class="text-3xl font-bold">Changer de magasin</h1>
    <p class="mt-3 text-gray-600">Sélectionnez le magasin actif.</p>
    <div class="mt-6 grid gap-4 sm:grid-cols-2">
      <button v-for="s in stores" :key="s.id" class="flex items-center justify-between rounded-lg border p-4 hover:border-primary" @click="select(s)">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-full" :style="{ backgroundColor: s.color || '#111827' }">
            <span class="text-xs font-semibold text-white">{{ initials(s.name) }}</span>
          </div>
          <div>
            <div class="font-semibold">{{ s.name }}</div>
            <div class="text-sm text-gray-600">/{{ s.slug }}</div>
          </div>
        </div>
        <div class="text-sm text-gray-500">Sélectionner</div>
      </button>
    </div>
    <p v-if="stores.length===0" class="mt-6 text-gray-600">Aucun magasin. Créez votre premier magasin.</p>
    <div class="mt-6">
      <NuxtLink to="/admin/stores/create" class="rounded bg-primary px-4 py-2 text-white">Créer un magasin</NuxtLink>
    </div>
  </main>
  </template>
<script setup lang="ts">
useHead({ title: 'Admin | Changer de magasin' })
import type { SupabaseClient } from '@supabase/supabase-js'
import { useAdminStore } from '~/stores/admin'
const admin = useAdminStore()
const nuxt = useNuxtApp()
const supabase = nuxt.$supabase as SupabaseClient
const stores = ref<Array<{ id: string; name: string; slug: string; color?: string }>>([])
const initials = (name: string) => (name || '').split(/\s+/).map(s => s[0]).join('.').slice(0, 6)
onMounted(async () => {
  const { data } = await supabase.auth.getUser()
  const uid = data?.user?.id
  if (!uid) { navigateTo('/auth/login'); return }
  const { data: ent } = await supabase.from('enterprises').select('id').eq('owner_id', uid).maybeSingle()
  if (!ent?.id) { navigateTo('/admin/stores/create'); return }
  const { data: list } = await supabase.from('stores').select('id,name,slug,color').eq('enterprise_id', ent.id)
  stores.value = list || []
})
function select(s: { id: string }) {
  admin.selectShop(String(s.id))
  navigateTo('/admin/dashboard')
}
</script>
