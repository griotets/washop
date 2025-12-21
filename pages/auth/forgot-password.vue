<template>
  <main class="min-h-screen w-full bg-background-light flex items-center">
    <div class="mx-auto w-full max-w-xl px-6 py-10">
      <div class="rounded-2xl bg-white p-6 shadow-sm">
        <div class="mb-8">
          <NuxtLink to="/" class="inline-block mb-4">
            <img src="/logo.svg" alt="Wa-Shop" class="h-12 w-12" />
          </NuxtLink>
          <h1 class="text-2xl font-bold mb-1">{{ t('auth.forgot.title') }}</h1>
          <p class="text-gray-600">{{ t('auth.forgot.subtitle') }}</p>
        </div>

        <div class="space-y-4">
          <div class="space-y-2">
            <label class="block text-sm font-medium">{{ t('auth.forgot.emailLabel') }}</label>
            <input
              v-model.trim="email"
              type="email"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none transition-colors"
              :placeholder="t('auth.login.placeholderEmail')"
              @keyup.enter="emailValid && !loading ? sendReset() : null"
            />
          </div>

          <button
            :disabled="!emailValid || loading"
            class="w-full rounded-lg bg-primary px-5 py-3 font-semibold text-white disabled:opacity-50 hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
            @click="sendReset"
          >
            <span v-if="loading" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
            <span>{{ loading ? t('common.sending') : t('auth.forgot.sendLink') }}</span>
          </button>

          <p v-if="sent" class="text-sm text-green-700">{{ t('auth.forgot.linkSent') }}</p>
          <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

          <div class="pt-4 border-t border-gray-100 text-center">
            <NuxtLink to="/auth/login" class="text-sm font-semibold text-primary hover:underline">{{ t('auth.forgot.backToLogin') }}</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { useToast } from '~/composables/useToast'
import { useI18n } from '~/composables/i18n'

const nuxt = useNuxtApp()
const supabase = nuxt.$supabase
const toast = useToast()
const requestURL = useRequestURL()
const { t } = useI18n()

const email = ref('')
const loading = ref(false)
const error = ref('')
const sent = ref(false)
const emailValid = computed(() => /.+@.+\..+/.test(String(email.value || '')))

const redirectTo = computed(() => {
  return `${requestURL.origin}/auth/reset-password`
})

async function sendReset() {
  sent.value = false
  error.value = ''
  loading.value = true
  try {
    if (!supabase?.auth) throw new Error('Supabase non initialisé')
    const { error: e } = await supabase.auth.resetPasswordForEmail(String(email.value || ''), { redirectTo: redirectTo.value })
    if (e) throw e
    sent.value = true
    toast.success(t('auth.forgot.linkSent'))
  } catch (e) {
    const msg = String(e?.message || e || 'Erreur')
    error.value = msg
    toast.error(msg)
  } finally {
    loading.value = false
  }
}
</script>
