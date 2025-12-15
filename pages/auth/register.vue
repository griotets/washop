<template>
  <main class="min-h-screen w-full bg-background-light flex items-center">
    <div class="mx-auto w-full max-w-7xl px-6 py-8 md:py-0 grid gap-8 md:grid-cols-2 md:h-screen md:items-center">
      <div class="rounded-2xl bg-white p-6 shadow-sm">
        <h1 class="text-2xl font-bold mb-2">Démarrer</h1>
        <p class="text-gray-600 mb-6">Créez votre compte commerçant en quelques étapes.</p>

        

        <div v-if="step===1" class="space-y-6">
          <div class="space-y-3">
            <label class="block text-sm font-medium">Adresse e‑mail *</label>
            <input v-model.trim="email" type="email" class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none" placeholder="vous@exemple.com" />
          </div>
          <button :disabled="!emailValid" class="w-full rounded-lg bg-primary px-5 py-3 font-semibold text-white disabled:opacity-50" @click="submitEmail">Continuer avec l’e‑mail</button>
          <div class="text-center text-sm text-gray-500">ou</div>
          <button class="w-full rounded-lg border border-gray-300 px-5 py-3 font-semibold" @click="continueWithGoogle">Continuer avec Google</button>
        </div>

        <div v-else-if="step===2" class="space-y-6">
          <h2 class="text-lg font-semibold">Entrez le code envoyé par e‑mail</h2>
          <p class="text-gray-600">Un code de vérification a été envoyé à <span class="font-semibold">{{ email }}</span>.</p>
          <div class="space-y-3">
            <label class="block text-sm font-medium">Code de vérification *</label>
            <input v-model.trim="enteredCode" inputmode="numeric" pattern="[0-9]*" maxlength="6" placeholder="123456" class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none tracking-widest text-center" />
            <p v-if="codeError" class="text-sm text-red-600">Code invalide. Veuillez réessayer.</p>
          </div>
          <button :disabled="!codeValid" class="w-full rounded-lg bg-primary px-5 py-3 font-semibold text-white disabled:opacity-50" @click="verifyCode">Vérifier et continuer</button>
          <button class="w-full rounded-lg border border-gray-300 px-5 py-3 font-semibold" @click="resendCode">Renvoyer le code</button>
        </div>

        <div v-else-if="step===3" class="space-y-6">
          <label class="block text-sm font-medium">Quel type d’entreprise dirigez‑vous ? *</label>
          <select v-model="industry" class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none">
            <option value="" disabled>Sélectionnez un secteur d’activité</option>
            <option v-for="opt in industries" :key="opt" :value="opt">{{ opt }}</option>
          </select>
          <button :disabled="!industry" class="w-full rounded-lg bg-primary px-5 py-3 font-semibold text-white disabled:opacity-50" @click="goStep(4)">Continuer</button>
        </div>

        <div v-else-if="step===4" class="space-y-6">
          <h2 class="text-lg font-semibold">Quel est votre objectif ?</h2>
          <div class="space-y-3">
            <label v-for="g in goalsList" :key="g" class="flex items-center gap-3">
              <input type="checkbox" :value="g" v-model="goals" />
              <span>{{ g }}</span>
            </label>
          </div>
          <button :disabled="goals.length===0" class="w-full rounded-lg bg-primary px-5 py-3 font-semibold text-white disabled:opacity-50" @click="goStep(5)">Continuer</button>
        </div>

        <div v-else-if="step===5" class="space-y-6">
          <h2 class="text-xl font-bold">Obtenez votre premier mois pour 1 $</h2>
          <div class="rounded-xl border border-gray-200 p-4 space-y-3">
            <div class="flex items-start gap-3"><Lock class="w-4 h-4" /><div><div class="font-semibold">Aujourd’hui : accès instantané</div><div class="text-sm text-gray-600">Débloquez toutes les fonctionnalités. Aucun plafond.</div></div></div>
            <div class="flex items-start gap-3"><Clock class="w-4 h-4" /><div><div class="font-semibold">Jan 8 : rappel</div><div class="text-sm text-gray-600">Rappels par WhatsApp et e‑mail avant la fin de l’essai.</div></div></div>
            <div class="flex items-start gap-3"><CreditCard class="w-4 h-4" /><div><div class="font-semibold">Jan 15 : forfait payant</div><div class="text-sm text-gray-600">Annulez à tout moment dans les réglages.</div></div></div>
          </div>
          <button class="w-full rounded-lg bg-gray-900 text-white px-5 py-3 font-semibold" @click="subscribe">Commencer pour 1 $</button>
          <button class="w-full rounded-lg border border-gray-300 px-5 py-3 font-semibold" @click="skip">Sauter pour l’instant</button>
        </div>
      </div>

      <div class="rounded-2xl bg-indigo-50 p-6">
        <div class="mx-auto max-w-sm">
          <div class="relative aspect-[9/18] rounded-[2rem] border-8 border-gray-900 bg-white shadow-xl overflow-hidden">
            <div v-if="step===1" class="p-6 space-y-4">
              <div class="h-4 w-1/2 bg-gray-100 rounded"></div>
              <div class="h-3 w-full bg-gray-200 rounded"></div>
              <div class="h-3 w-5/6 bg-gray-200 rounded"></div>
              <div class="h-10 w-full bg-primary/10 rounded animate-pulse"></div>
            </div>
            <div v-else-if="step===2" class="p-6 space-y-5">
              <div class="h-4 w-2/3 bg-gray-100 rounded"></div>
              <div class="grid grid-cols-6 gap-2">
                <div v-for="i in 6" :key="i" :class="['h-10 rounded-md border', i===6 ? 'border-primary' : 'border-gray-300']"></div>
              </div>
              <div class="text-center text-xs text-gray-500">Saisissez votre code reçu par e‑mail</div>
            </div>
            <div v-else-if="step===3" class="p-4">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <div class="h-8 w-8 rounded-full bg-gray-200"></div>
                  <div class="font-bold">Votre Boutique</div>
                </div>
                <div class="px-2 py-1 text-xs rounded bg-gray-100 text-gray-600">{{ industry || 'Secteur' }}</div>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div v-for="(p,idx) in 6" :key="idx" :class="['rounded-xl border p-2 space-y-2', animTick===idx ? 'border-primary animate-pulse' : 'border-gray-200']">
                  <div class="h-20 bg-gray-100 rounded"></div>
                  <div class="h-3 w-2/3 bg-gray-200 rounded"></div>
                  <div class="flex items-center justify-between">
                    <div class="h-3 w-12 bg-gray-200 rounded"></div>
                    <div class="h-6 w-12 rounded bg-green-100 text-green-700 text-xs flex items-center justify-center">Add +</div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else-if="step===4" class="p-5 space-y-3">
              <div class="flex items-center justify-between border-b pb-2">
                <span class="font-bold text-sm">Order #1024</span>
                <span :class="['px-2 py-1 text-xs rounded', animTick%2===0 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800']">{{ animTick%2===0 ? 'Pending' : 'Accepted' }}</span>
              </div>
              <div class="space-y-2">
                <div class="h-2 bg-gray-200 rounded w-3/4"></div>
                <div class="h-2 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div class="mt-2 flex gap-2">
                <button class="flex-1 bg-primary text-white text-xs py-2 rounded">Accept</button>
                <button class="flex-1 bg-gray-200 text-gray-700 text-xs py-2 rounded">Decline</button>
              </div>
            </div>
            <div v-else class="p-6 space-y-3">
              <div class="flex items-center gap-2 justify-center">
                <div class="px-3 py-1 rounded-full bg-gray-100 text-sm">bali dining.com</div>
                <div class="h-5 w-5 rounded bg-gray-200"></div>
              </div>
              <div class="flex flex-col items-center pt-2">
                <div class="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center"><div class="h-10 w-10 rounded-full bg-white"></div></div>
                <div class="mt-3 h-3 w-24 bg-gray-200 rounded"></div>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div class="rounded-xl border border-gray-200 p-3 space-y-2">
                  <div class="h-3 w-16 bg-gray-200 rounded"></div>
                  <div class="h-2 w-24 bg-gray-100 rounded"></div>
                </div>
                <div class="rounded-xl border border-gray-200 p-3 space-y-2">
                  <div class="h-3 w-16 bg-gray-200 rounded"></div>
                  <div class="h-2 w-24 bg-gray-100 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
  
</template>

<script setup lang="ts">
import { useAdminStore } from '~/stores/admin'
import { Lock, Clock, CreditCard } from 'lucide-vue-next'

const store = useAdminStore()
store.load()

const step = ref(1)
const email = ref(store.onboarding.email)
const emailValid = computed(() => /.+@.+\..+/.test(email.value))
const industry = ref(store.onboarding.industry)
const goals = ref([...store.onboarding.goals])
const enteredCode = ref('')
const codeValid = computed(() => /^\d{6}$/.test(enteredCode.value))
const codeError = ref(false)
const animTick = ref(0)
let animTimer: any
onMounted(() => { animTimer = setInterval(() => { animTick.value = (animTick.value + 1) % 6 }, 1200) })
onUnmounted(() => { if (animTimer) clearInterval(animTimer) })
const industries = [
  'Restauration & Gastronomie',
  'Épicerie & Supermarché',
  'Santé & Beauté (Spa, Salon, Gym, etc.)',
  'Voyage & Location',
  'Détail & Shopping',
  'Cadeaux & Artisanat',
  'Animaux & Toilettage',
  'Services à domicile (Nettoyage, Réparation, Jardinage, etc.)',
  'Éducation',
  'Services Professionnels (Automobile, Légal, Immobilier, etc.)',
  'B2B',
  'Autres'
]
const goalsList = [
  'Gérez les livraisons & suivi',
  'Augmentez les ventes avec des automatisations WhatsApp',
  'Acceptez les paiements en ligne',
  'Créer des magasins en ligne et des domaines',
  'Analyser les ventes & clients'
]

function goStep(n: number) { step.value = n }
function submitEmail() {
  store.setEmail(email.value)
  const code = String(Math.floor(100000 + Math.random() * 900000))
  store.setEmailCode(code)
  store.persist()
  step.value = 2
}
function continueWithGoogle() {
  store.setEmail('google-user@example.com')
  const code = String(Math.floor(100000 + Math.random() * 900000))
  store.setEmailCode(code)
  store.persist()
  step.value = 2
}
function verifyCode() {
  codeError.value = enteredCode.value !== (store.onboarding.emailCode || '')
  if (!codeError.value) { store.verifyEmail(); store.persist(); step.value = 3 }
}
function resendCode() {
  const code = String(Math.floor(100000 + Math.random() * 900000))
  store.setEmailCode(code)
  store.persist()
  codeError.value = false
  enteredCode.value = ''
}

watch(industry, (v) => { store.setIndustry(v); store.persist() })
watch(goals, (v) => { store.onboarding.goals = v; store.persist() })

async function subscribe() {
  store.setSubscribed(true); store.persist(); await navigateTo('/admin/stores/create')
}
async function skip() {
  store.setSubscribed(false); store.persist(); await navigateTo('/admin/stores/create')
}

useHead({ title: 'Inscription | Wa-Shop Cameroun' })
</script>
