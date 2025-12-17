<template>
  <main class="mx-auto max-w-md px-6 py-12">
    <div class="mb-6 flex justify-center">
      <NuxtLink to="/">
        <img src="/logo.svg" alt="Wa-Shop" class="h-16 w-16" />
      </NuxtLink>
    </div>
    <h1 class="text-2xl font-semibold text-center">{{ t('login.title') }}</h1>
    <div class="mt-6 space-y-4">
      <div v-if="!otpSent" class="space-y-2">
        <label class="block text-sm">{{ t('register.emailLabel') }}</label>
        <input v-model.trim="email" type="email" class="mt-1 w-full rounded border px-3 py-2" />
        <button :disabled="!emailValid || loading" class="w-full rounded bg-primary px-4 py-2 text-white" @click="sendEmailOtp">
          {{ loading ? t('common.sending') : t('register.continueEmail') }}
        </button>
        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
      </div>
      <div v-else class="space-y-2">
        <label class="block text-sm">{{ t('register.codeLabel') }}</label>
        <input v-model.trim="code" inputmode="numeric" pattern="[0-9]*" maxlength="8" placeholder="12345678" class="mt-1 w-full rounded border px-3 py-2 tracking-widest text-center" />
        <button :disabled="!codeValid || loading" class="w-full rounded bg-primary px-4 py-2 text-white" @click="verifyEmailOtp">
          {{ loading ? t('common.verifying') : t('login.title') }}
        </button>
        <button :disabled="loading || resendCooldown>0" class="w-full rounded border px-4 py-2" @click="resend">
          <span v-if="resendCooldown>0">{{ t('register.resendIn', { s: resendCooldown }) }}</span>
          <span v-else>{{ t('register.resendCode') }}</span>
        </button>
        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/auth'
import { useI18n } from '~/composables/i18n'
import type { SupabaseClient } from '@supabase/supabase-js'
import { useAdminStore } from '~/stores/admin'

const { t } = useI18n()
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

onMounted(async () => {
  // Ensure we start with a clean session state
  const { data } = await supabase.auth.getSession()
  if (data?.session) {
    console.log('[Login] Clearing existing session')
    await supabase.auth.signOut()
  }
})

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
    if (!supabase?.auth) return

    const { data } = await supabase.auth.getUser()
    const uid = data?.user?.id
    if (!uid) return router.push('/auth/login')
    let { data: ent, error: entErr } = await supabase.from('enterprises').select('id,name').eq('owner_id', uid).maybeSingle()
    if (entErr) {
      console.error(entErr)
      useToast().error(entErr.message)
    }
    if (!ent) {
      const name = String(data?.user?.email || 'My Business').split('@')[0]
      const { data: insData, error: insErr } = await supabase.from('enterprises').insert({ owner_id: uid, name }).select('id').maybeSingle()
      if (insErr) {
         console.error(insErr)
         useToast().error(insErr.message)
      } else {
         ent = insData as any
      }
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
