<template>
  <main class="mx-auto max-w-md px-6 py-12">
    <h1 class="text-2xl font-semibold">Connexion</h1>
    <div class="mt-6 space-y-4">
      <div v-if="!otpSent" class="space-y-2">
        <label class="block text-sm">Email</label>
        <input v-model.trim="email" type="email" class="mt-1 w-full rounded border px-3 py-2" />
        <button :disabled="!emailValid || loading" class="w-full rounded bg-primary px-4 py-2 text-white" @click="sendEmailOtp">
          {{ loading ? 'Envoi...' : 'Continuer avec l’e‑mail' }}
        </button>
        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
      </div>
      <div v-else class="space-y-2">
        <label class="block text-sm">Code reçu par e‑mail</label>
        <input v-model.trim="code" inputmode="numeric" pattern="[0-9]*" maxlength="8" placeholder="12345678" class="mt-1 w-full rounded border px-3 py-2 tracking-widest text-center" />
        <button :disabled="!codeValid || loading" class="w-full rounded bg-primary px-4 py-2 text-white" @click="verifyEmailOtp">
          {{ loading ? 'Vérification...' : 'Se connecter' }}
        </button>
        <button :disabled="loading || resendCooldown>0" class="w-full rounded border px-4 py-2" @click="resend">
          <span v-if="resendCooldown>0">Renvoyer dans {{ resendCooldown }}s</span>
          <span v-else>Renvoyer le code</span>
        </button>
        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/auth'
import type { SupabaseClient } from '@supabase/supabase-js'
import { useAdminStore } from '~/stores/admin'

const { sendOtp, verifyOtp, loading, error } = useAuth()
const email = ref('')
const emailValid = computed(() => /.+@.+\..+/.test(String(email.value || '')))
const code = ref('')
const codeValid = computed(() => /^\d{8}$/.test(code.value))
const otpSent = ref(false)
const resendCooldown = ref(0)
let resendTimer: any = null
const router = useRouter()
const nuxt = useNuxtApp()
const supabase = nuxt.$supabase as SupabaseClient
const admin = useAdminStore()
const cfg = useRuntimeConfig()
const otpDelay = Number((cfg.public as any)?.otpResendDelay || 30)

async function sendEmailOtp() {
  const res = await sendOtp(String(email.value || ''))
  if (!res.error) {
    otpSent.value = true
    startCooldown()
  }
}
async function verifyEmailOtp() {
  const res = await verifyOtp(String(email.value || ''), String(code.value || ''))
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
      return
    }
    if (stores.length === 1) {
      admin.selectShop(String(stores[0].id))
    } else {
      router.push('/admin/stores/switch')
      return
    }
    try {
      const raw = localStorage.getItem('postLoginPath')
      localStorage.removeItem('postLoginPath')
      const target = String(raw || '')
      if (target) { router.push(target); return }
    } catch {}
    router.push('/admin/dashboard')
  }
}
async function resend() {
  const res = await sendOtp(String(email.value || ''))
  if (!res.error) {
    code.value = ''
    startCooldown()
  }
}
function startCooldown() {
  resendCooldown.value = otpDelay
  if (resendTimer) clearInterval(resendTimer)
  resendTimer = setInterval(() => {
    if (resendCooldown.value > 0) resendCooldown.value--
    else { clearInterval(resendTimer); resendTimer = null }
  }, 1000)
}
</script>
