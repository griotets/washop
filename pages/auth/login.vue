<template>
  <main class="min-h-screen w-full bg-background-light flex items-center">
    <div class="mx-auto w-full max-w-7xl px-6 py-8 md:py-0 grid gap-8 md:grid-cols-2 md:h-screen md:items-center">
      <!-- Left Column: Login Form -->
      <div class="rounded-2xl bg-white p-6 shadow-sm">
        <div class="flex items-center justify-between mb-8">
          <div>
            <a href="/" class="inline-block mb-4">
              <img src="/logo.svg" alt="Wa-Shop" class="h-12 w-12" />
            </a>
            <h1 class="text-2xl font-bold mb-1">{{ t('login.title') }}</h1>
            <p class="text-gray-600">Gérez votre boutique en toute simplicité</p>
          </div>
        </div>

        <div class="space-y-6">
          <!-- Step 1: Email -->
          <div v-if="!otpSent" class="space-y-4">
            <div class="space-y-3">
              <label class="block text-sm font-medium">{{ t('register.emailLabel') }}</label>
              <input 
                v-model.trim="email" 
                type="email" 
                class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none transition-colors"
                placeholder="vous@exemple.com"
                @keyup.enter="emailValid && !loading ? sendEmailOtp() : null"
              />
            </div>
            <div class="flex justify-end">
              <NuxtLink to="/auth/forgot-password" class="text-xs text-primary hover:underline">Mot de passe oublié ?</NuxtLink>
            </div>
            <button 
              :disabled="!emailValid || loading" 
              class="w-full rounded-lg bg-primary px-5 py-3 font-semibold text-white disabled:opacity-50 hover:bg-primary-dark transition-colors flex items-center justify-center gap-2" 
              @click="sendEmailOtp"
            >
              <span v-if="loading" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              {{ loading ? t('common.sending') : t('register.continueEmail') }}
            </button>
            <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
          </div>

          <!-- Step 2: OTP -->
          <div v-else class="space-y-4">
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <label class="block text-sm font-medium">{{ t('register.codeLabel') }}</label>
                <button @click="otpSent = false" class="text-xs text-primary hover:underline">Modifier l'email</button>
              </div>
              <input 
                v-model.trim="code" 
                inputmode="numeric" 
                pattern="[0-9]*" 
                maxlength="8" 
                placeholder="12345678" 
                class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none tracking-widest text-center text-lg letter-spacing-2"
                @keyup.enter="codeValid && !loading ? verifyEmailOtp() : null"
              />
            </div>
            
            <button 
              :disabled="!codeValid || loading" 
              class="w-full rounded-lg bg-primary px-5 py-3 font-semibold text-white disabled:opacity-50 hover:bg-primary-dark transition-colors flex items-center justify-center gap-2" 
              @click="verifyEmailOtp"
            >
              <span v-if="loading" class="animate-spin h-4 w-4 border-white border-t-transparent rounded-full border-2"></span>
              {{ loading ? t('common.verifying') : 'Se connecter' }}
            </button>

            <button 
              :disabled="loading || resendCooldown>0" 
              class="w-full rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50" 
              @click="resend"
            >
              <span v-if="resendCooldown>0">{{ t('register.resendIn', { s: resendCooldown }) }}</span>
              <span v-else>{{ t('register.resendCode') }}</span>
            </button>
            
            <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
          </div>

          <div class="pt-4 border-t border-gray-100 text-center">
            <p class="text-sm text-gray-600">
              Pas encore de compte ? 
              <a href="/auth/register" class="font-semibold text-primary hover:underline">Créer un compte</a>
            </p>
          </div>
        </div>
      </div>

      <!-- Right Column: Visual -->
      <div class="hidden md:block rounded-2xl bg-green-50 p-6 h-full max-h-[600px] flex items-center justify-center">
        <div class="relative w-full max-w-sm aspect-[11/18] rounded-[2.5rem] border-[8px] border-gray-900 bg-white shadow-2xl overflow-hidden">
          <!-- Mockup Header -->
          <div class="absolute top-0 left-0 right-0 h-6 bg-gray-100 border-b z-10 flex items-center justify-center">
            <div class="h-1.5 w-16 bg-gray-300 rounded-full"></div>
          </div>

          <!-- Mockup Content -->
          <div class="pt-8 px-4 pb-4 h-full overflow-hidden flex flex-col">
            <!-- Header -->
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-2">
                <div class="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <div class="h-4 w-4 rounded-full bg-primary"></div>
                </div>
                <div>
                  <div class="h-3 w-20 bg-gray-200 rounded mb-1"></div>
                  <div class="h-2 w-12 bg-gray-100 rounded"></div>
                </div>
              </div>
              <div class="h-8 w-8 rounded-full bg-gray-100"></div>
            </div>

            <!-- Stats Card -->
            <div class="bg-gray-900 rounded-xl p-4 text-white mb-4 shadow-lg transform transition-transform hover:scale-105 duration-500">
              <div class="flex justify-between items-start mb-4">
                <div class="h-2 w-16 bg-gray-700 rounded"></div>
                <div class="h-4 w-4 rounded bg-green-500"></div>
              </div>
              <div class="h-8 w-24 bg-gray-700 rounded mb-2"></div>
              <div class="h-2 w-full bg-gray-800 rounded"></div>
            </div>

            <!-- List Items -->
            <div class="space-y-3 flex-1">
              <div v-for="i in 4" :key="i" class="flex items-center gap-3 p-3 rounded-lg border border-gray-100 shadow-sm">
                <div class="h-10 w-10 rounded-lg bg-gray-100"></div>
                <div class="flex-1">
                  <div class="h-3 w-24 bg-gray-200 rounded mb-1.5"></div>
                  <div class="h-2 w-16 bg-gray-100 rounded"></div>
                </div>
                <div class="h-4 w-12 bg-gray-100 rounded"></div>
              </div>
            </div>

            <!-- Bottom Nav -->
            <div class="mt-auto pt-4 border-t flex justify-between px-4">
              <div class="h-6 w-6 rounded bg-primary"></div>
              <div class="h-6 w-6 rounded bg-gray-200"></div>
              <div class="h-6 w-6 rounded bg-gray-200"></div>
              <div class="h-6 w-6 rounded bg-gray-200"></div>
            </div>
          </div>
        </div>
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
