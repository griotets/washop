<template>
  <main class="mx-auto max-w-md px-6 py-12">
    <h1 class="text-2xl font-semibold">Connexion</h1>
    <form class="mt-6 space-y-4" @submit.prevent="onSubmit">
      <div>
        <label class="block text-sm">Email</label>
        <input v-model="email" type="email" class="mt-1 w-full rounded border px-3 py-2" required />
      </div>
      <div>
        <label class="block text-sm">Mot de passe</label>
        <input v-model="password" type="password" class="mt-1 w-full rounded border px-3 py-2" required />
      </div>
      <button :disabled="loading" class="w-full rounded bg-primary px-4 py-2 text-white">
        {{ loading ? 'Connexion...' : 'Se connecter' }}
      </button>
      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
    </form>
  </main>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/auth'
import type { SupabaseClient } from '@supabase/supabase-js'
import { useAdminStore } from '~/stores/admin'

const { signIn, loading, error } = useAuth()
const email = ref('')
const password = ref('')
const router = useRouter()
const nuxt = useNuxtApp()
const supabase = nuxt.$supabase as SupabaseClient
const admin = useAdminStore()

async function onSubmit() {
  const res = await signIn(String(email.value || ''), password.value)
  if (!res.error) {
    const { data } = await supabase.auth.getUser()
    const uid = data?.user?.id
    if (!uid) return router.push('/auth/login')
    let { data: ent } = await supabase.from('enterprises').select('id,name').eq('owner_id', uid).maybeSingle()
    if (!ent) {
      const name = String(data?.user?.email || 'My Business').split('@')[0]
      const ins = await supabase.from('enterprises').insert({ owner_id: uid, name }).select('id').maybeSingle()
      ent = ins.data as any
    }
    if (!ent?.id) return router.push('/admin/stores/create')
    const { data: stores } = await supabase.from('stores').select('id,name,slug').eq('enterprise_id', ent.id)
    if (!stores || stores.length === 0) {
      router.push('/admin/stores/create')
    } else if (stores.length === 1) {
      admin.selectShop(String(stores[0].id))
      router.push('/admin/dashboard')
    } else {
      router.push('/admin/stores/switch')
    }
  }
}
</script>
