<template>
  <main class="min-h-screen w-full bg-background-light flex items-center">
    <div class="mx-auto w-full max-w-xl px-6 py-10">
      <div class="rounded-2xl bg-white p-6 shadow-sm">
        <div class="mb-8">
          <NuxtLink to="/" class="inline-block mb-4">
            <img src="/logo.svg" alt="Wa-Shop" class="h-12 w-12" />
          </NuxtLink>
          <h1 class="text-2xl font-bold mb-1">Nouveau mot de passe</h1>
          <p class="text-gray-600">Choisissez un nouveau mot de passe pour votre compte.</p>
        </div>

        <div class="space-y-4">
          <div v-if="status === 'loading'" class="text-sm text-gray-600">Vérification du lien...</div>
          <div v-else-if="status === 'error'" class="text-sm text-red-600">{{ statusMessage }}</div>

          <div v-else class="space-y-4">
            <div class="space-y-2">
              <label class="block text-sm font-medium">Nouveau mot de passe</label>
              <input
                v-model="password"
                type="password"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none transition-colors"
                placeholder="********"
              />
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-medium">Confirmer</label>
              <input
                v-model="password2"
                type="password"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none transition-colors"
                placeholder="********"
                @keyup.enter="canSubmit && !saving ? save() : null"
              />
            </div>

            <button
              :disabled="!canSubmit || saving"
              class="w-full rounded-lg bg-primary px-5 py-3 font-semibold text-white disabled:opacity-50 hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
              @click="save"
            >
              <span v-if="saving" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              <span>{{ saving ? 'Enregistrement...' : 'Mettre à jour' }}</span>
            </button>
          </div>

          <div class="pt-4 border-t border-gray-100 text-center">
            <NuxtLink to="/auth/login" class="text-sm font-semibold text-primary hover:underline">Retour à la connexion</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { useToast } from '~/composables/useToast'

const nuxt = useNuxtApp()
const supabase = nuxt.$supabase
const toast = useToast()
const route = useRoute()

const status = ref('loading')
const statusMessage = ref('')

const password = ref('')
const password2 = ref('')
const saving = ref(false)
const canSubmit = computed(() => {
  const p1 = String(password.value || '')
  const p2 = String(password2.value || '')
  return p1.length >= 8 && p1 === p2
})

function parseHashTokens(hash) {
  const clean = String(hash || '').replace(/^#/, '')
  const params = new URLSearchParams(clean)
  const access_token = params.get('access_token')
  const refresh_token = params.get('refresh_token')
  if (!access_token || !refresh_token) return null
  return { access_token, refresh_token }
}

onMounted(async () => {
  try {
    if (!supabase?.auth) throw new Error('Supabase non initialisé')

    const code = route.query?.code ? String(route.query.code) : ''
    if (code) {
      const { error: e } = await supabase.auth.exchangeCodeForSession(code)
      if (e) throw e
    } else if (process.client) {
      const tokens = parseHashTokens(window.location.hash)
      if (tokens) {
        const { error: e } = await supabase.auth.setSession(tokens)
        if (e) throw e
      }
    }

    const { data, error: e } = await supabase.auth.getSession()
    if (e) throw e
    if (!data?.session) throw new Error('Lien invalide ou expiré. Veuillez recommencer.')

    status.value = 'ready'
  } catch (e) {
    status.value = 'error'
    statusMessage.value = String(e?.message || e || 'Erreur')
  }
})

async function save() {
  saving.value = true
  try {
    const p1 = String(password.value || '')
    if (!supabase?.auth) throw new Error('Supabase non initialisé')
    const { error: e } = await supabase.auth.updateUser({ password: p1 })
    if (e) throw e
    toast.success('Mot de passe mis à jour')
    await supabase.auth.signOut()
    await navigateTo('/auth/login')
  } catch (e) {
    toast.error(String(e?.message || e || 'Erreur'))
  } finally {
    saving.value = false
  }
}
</script>
