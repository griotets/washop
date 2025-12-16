<template>
  <div class="min-h-screen bg-gray-50">
    <CatalogHeader />
    
    <main class="mx-auto max-w-3xl px-4 py-8 pb-32">
      <!-- Stepper -->
      <div class="mb-8 flex items-center justify-between px-4">
        <div class="flex flex-col items-center gap-2">
          <div :class="['flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold', step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500']">1</div>
          <div class="text-xs font-medium text-gray-600">Panier</div>
        </div>
        <div :class="['h-1 flex-1 rounded-full mx-2', step >= 2 ? 'bg-primary' : 'bg-gray-200']"></div>
        <div class="flex flex-col items-center gap-2">
          <div :class="['flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold', step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500']">2</div>
          <div class="text-xs font-medium text-gray-600">Livraison</div>
        </div>
        <div :class="['h-1 flex-1 rounded-full mx-2', step >= 3 ? 'bg-primary' : 'bg-gray-200']"></div>
        <div class="flex flex-col items-center gap-2">
          <div :class="['flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold', step >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500']">3</div>
          <div class="text-xs font-medium text-gray-600">Confirmer</div>
        </div>
      </div>

      <!-- Step 1: Cart -->
      <div v-if="step === 1">
        <h1 class="text-2xl font-bold">Votre Panier</h1>
        
        <div v-if="cart.items.length === 0" class="mt-8 text-center">
          <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <ShoppingCart class="h-8 w-8 text-gray-400" />
          </div>
          <p class="text-gray-600">Votre panier est vide.</p>
          <NuxtLink :to="`/${slug}`" class="mt-4 inline-block rounded-lg bg-primary px-6 py-2 text-white">
            Retour à la boutique
          </NuxtLink>
        </div>

        <div v-else class="mt-6 space-y-4">
          <div v-for="item in cart.items" :key="item.id" class="flex items-center gap-4 rounded-xl border bg-white p-4 shadow-sm">
            <div class="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
              <img v-if="item.image" :src="item.image" class="h-full w-full object-cover" />
              <div v-else class="flex h-full w-full items-center justify-center text-gray-400">
                <Package class="h-6 w-6" />
              </div>
            </div>
            <div class="flex-1">
              <div class="font-semibold">{{ item.name }}</div>
              <div class="text-sm font-medium text-primary">{{ item.price.toLocaleString('fr-FR') }} XAF</div>
            </div>
            <div class="flex items-center gap-3 rounded-lg bg-gray-50 p-1">
              <button class="h-7 w-7 rounded bg-white shadow-sm hover:bg-gray-100 disabled:opacity-50" @click="cart.setQuantity(item.id, item.quantity - 1)" :disabled="item.quantity <= 1">
                -
              </button>
              <span class="w-4 text-center text-sm font-medium">{{ item.quantity }}</span>
              <button class="h-7 w-7 rounded bg-white shadow-sm hover:bg-gray-100" @click="cart.setQuantity(item.id, item.quantity + 1)">
                +
              </button>
            </div>
            <button class="text-red-500 hover:text-red-700" @click="cart.remove(item.id)">
              <Trash2 class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Step 2: Delivery -->
      <div v-if="step === 2">
        <h1 class="text-2xl font-bold">Informations de livraison</h1>
        
        <div class="mt-6 space-y-6 rounded-xl border bg-white p-6 shadow-sm">
          <!-- Delivery Method -->
          <div v-if="availableMethods.length > 1">
            <label class="mb-3 block text-sm font-medium text-gray-700">Mode de réception</label>
            <div class="grid grid-cols-2 gap-4">
              <label :class="['flex cursor-pointer flex-col items-center rounded-xl border-2 p-4 transition-colors', form.method === 'pickup' ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200']">
                <input type="radio" v-model="form.method" value="pickup" class="sr-only" />
                <Store class="mb-2 h-6 w-6" :class="form.method === 'pickup' ? 'text-primary' : 'text-gray-400'" />
                <span :class="['font-medium', form.method === 'pickup' ? 'text-primary' : 'text-gray-600']">Retrait</span>
              </label>
              <label :class="['flex cursor-pointer flex-col items-center rounded-xl border-2 p-4 transition-colors', form.method === 'delivery' ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200']">
                <input type="radio" v-model="form.method" value="delivery" class="sr-only" />
                <Truck class="mb-2 h-6 w-6" :class="form.method === 'delivery' ? 'text-primary' : 'text-gray-400'" />
                <span :class="['font-medium', form.method === 'delivery' ? 'text-primary' : 'text-gray-600']">Livraison</span>
              </label>
            </div>
          </div>

          <!-- Contact Info -->
          <div class="space-y-4">
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">Nom complet *</label>
              <input v-model="form.name" type="text" class="w-full rounded-lg border-gray-300 px-4 py-2 focus:border-primary focus:ring-primary" placeholder="Votre nom" />
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">Téléphone WhatsApp *</label>
              <PhoneInput v-model="form.phone" />
            </div>

            <div v-if="form.method === 'delivery'" class="space-y-4">
              <div>
                <label class="mb-1 block text-sm font-medium text-gray-700">Ville *</label>
                <input v-model="form.city" type="text" class="w-full rounded-lg border-gray-300 px-4 py-2 focus:border-primary focus:ring-primary" placeholder="Votre ville" />
              </div>
              <div>
                <label class="mb-1 block text-sm font-medium text-gray-700">Adresse / Quartier *</label>
                <textarea v-model="form.address" rows="2" class="w-full rounded-lg border-gray-300 px-4 py-2 focus:border-primary focus:ring-primary" placeholder="Détails de localisation (quartier, repère...)"></textarea>
              </div>
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">Note (optionnel)</label>
              <textarea v-model="form.note" rows="2" class="w-full rounded-lg border-gray-300 px-4 py-2 focus:border-primary focus:ring-primary" placeholder="Instructions spéciales..."></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 3: Confirmation -->
      <div v-if="step === 3">
        <h1 class="text-2xl font-bold">Confirmation</h1>
        
        <div class="mt-6 space-y-6">
          <!-- Summary Card -->
          <div class="rounded-xl border bg-white p-6 shadow-sm">
            <h3 class="mb-4 font-semibold text-gray-900">Récapitulatif de la commande</h3>
            <div class="space-y-3">
              <div v-for="item in cart.items" :key="item.id" class="flex justify-between text-sm">
                <span class="text-gray-600">{{ item.quantity }}x {{ item.name }}</span>
                <span class="font-medium">{{ (item.price * item.quantity).toLocaleString('fr-FR') }} XAF</span>
              </div>
            </div>
            <div class="my-4 border-t border-dashed"></div>
            <div class="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span class="text-primary">{{ cart.total.toLocaleString('fr-FR') }} XAF</span>
            </div>
          </div>

          <!-- Info Card -->
          <div class="rounded-xl border bg-white p-6 shadow-sm">
            <h3 class="mb-4 font-semibold text-gray-900">Vos informations</h3>
            <dl class="space-y-3 text-sm">
              <div class="flex justify-between">
                <dt class="text-gray-500">Nom</dt>
                <dd class="font-medium">{{ form.name }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-gray-500">Téléphone</dt>
                <dd class="font-medium">{{ form.phone }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-gray-500">Mode</dt>
                <dd class="inline-flex items-center gap-1 font-medium text-primary">
                  <component :is="form.method === 'pickup' ? Store : Truck" class="h-4 w-4" />
                  {{ form.method === 'pickup' ? 'Retrait en boutique' : 'Livraison' }}
                </dd>
              </div>
              <div v-if="form.method === 'delivery'">
                <dt class="mt-2 text-gray-500">Adresse de livraison</dt>
                <dd class="mt-1 rounded bg-gray-50 p-2 font-medium text-gray-700">
                  {{ form.city }}, {{ form.address }}
                </dd>
              </div>
              <div v-if="form.note">
                <dt class="mt-2 text-gray-500">Note</dt>
                <dd class="mt-1 italic text-gray-600">"{{ form.note }}"</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </main>

    <!-- Bottom Action Bar -->
    <div class="fixed bottom-0 left-0 right-0 border-t bg-white p-4 shadow-lg">
      <div class="mx-auto flex max-w-3xl items-center justify-between gap-4">
        <div v-if="step === 1" class="font-bold text-lg">
          {{ cart.total.toLocaleString('fr-FR') }} XAF
        </div>
        
        <button v-if="step > 1" @click="step--" class="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50">
          Retour
        </button>
        
        <button v-if="step === 1" @click="step++" :disabled="cart.items.length === 0" class="ml-auto rounded-lg bg-primary px-8 py-3 font-semibold text-white shadow-sm hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed">
          Commander
        </button>
        
        <button v-else-if="step === 2" @click="validateStep2" class="ml-auto rounded-lg bg-primary px-8 py-3 font-semibold text-white shadow-sm hover:brightness-110">
          Continuer
        </button>
        
        <button v-else-if="step === 3" @click="sendWhatsApp" class="ml-auto flex items-center gap-2 rounded-lg bg-[#25D366] px-6 py-3 font-semibold text-white shadow-sm hover:brightness-110">
          <MessageCircle class="h-5 w-5" />
          Envoyer sur WhatsApp
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ShoppingCart, Trash2, Package, Store, Truck, MessageCircle } from 'lucide-vue-next'
import { useCartStore } from '~/stores/cart'
import PhoneInput from '~/components/PhoneInput.vue'

const route = useRoute()
const slug = computed(() => String(route.params['boutiqueSlug'] || ''))
const cart = useCartStore()

useHead({ title: `Panier | ${slug.value}` })

// State
const step = ref(1)
const storeConfig = ref<any>({})
const form = reactive({
  name: '',
  phone: '',
  method: 'delivery', // default
  city: '',
  address: '',
  note: ''
})

// Computed
const availableMethods = computed(() => {
  const methods = []
  const deliveryConfig = storeConfig.value?.checkout?.delivery
  if (deliveryConfig?.pickup) methods.push('pickup')
  if (deliveryConfig?.delivery) methods.push('delivery')
  return methods.length > 0 ? methods : ['pickup', 'delivery'] // fallback
})

// Methods
onMounted(() => {
  cart.load(slug.value)
  loadStoreConfig()
})

function loadStoreConfig() {
  try {
    const raw = localStorage.getItem(`design:${slug.value}`)
    if (raw) {
      storeConfig.value = JSON.parse(raw)
      // Set default method
      const deliveryConfig = storeConfig.value.checkout?.delivery
      if (deliveryConfig?.pickup && !deliveryConfig?.delivery) form.method = 'pickup'
      else if (!deliveryConfig?.pickup && deliveryConfig?.delivery) form.method = 'delivery'
    }
  } catch {}
}

function validateStep2() {
  if (!form.name.trim()) return alert('Veuillez entrer votre nom')
  if (!form.phone.trim() || form.phone.length < 9) return alert('Veuillez entrer un numéro de téléphone valide')
  if (form.method === 'delivery' && (!form.city.trim() || !form.address.trim())) {
    return alert('Veuillez compléter l\'adresse de livraison')
  }
  step.value = 3
}

function sendWhatsApp() {
  const storePhone = getStorePhone()
  const lines = cart.items.map(i => `- ${i.quantity}x ${i.name} (${(i.price * i.quantity).toLocaleString('fr-FR')} XAF)`).join('\n')
  
  let deliveryDetails = ''
  if (form.method === 'pickup') {
    deliveryDetails = `📍 *Mode:* Retrait en boutique\n👤 *Nom:* ${form.name}\n📞 *Tél:* ${form.phone}`
  } else {
    deliveryDetails = `🚚 *Mode:* Livraison\n👤 *Nom:* ${form.name}\n📞 *Tél:* ${form.phone}\n🏠 *Adresse:* ${form.city}, ${form.address}`
  }
  if (form.note) deliveryDetails += `\n📝 *Note:* ${form.note}`

  const message = `*Nouvelle Commande Wa-Shop*\n\n${lines}\n\n*Total : ${cart.total.toLocaleString('fr-FR')} XAF*\n\n----------------\n${deliveryDetails}\n\nLien: ${window.location.href}`
  
  const encoded = encodeURIComponent(message)
  const url = `https://wa.me/${storePhone}?text=${encoded}`
  window.open(url, '_blank')
}

function getStorePhone() {
  try {
    const raw = localStorage.getItem(`store:${slug.value}`)
    const data = raw ? JSON.parse(raw) : {}
    return String(data.phone || '').replace(/\D/g, '')
  } catch {
    return ''
  }
}
</script>

