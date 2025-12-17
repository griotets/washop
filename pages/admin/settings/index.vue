<template>
  <div class="flex flex-col md:flex-row gap-6 min-h-[calc(100vh-6rem)]">
    <!-- Sidebar Menu -->
    <aside class="w-full md:w-64 shrink-0 space-y-8">
      <div class="px-3 md:px-0">
         <NuxtLink to="/admin/dashboard" class="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6">
           <ArrowLeft class="h-4 w-4" />
           <span>Retour au tableau de bord</span>
         </NuxtLink>
      </div>

       <div v-for="(section, idx) in menu" :key="idx">
         <h3 v-if="section.title" class="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">{{ section.title }}</h3>
         <div class="space-y-1">
           <button 
             v-for="item in section.items" 
             :key="item.id"
             @click="activeTab = item.id"
             class="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors"
             :class="activeTab === item.id ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
           >
             <span>{{ item.label }}</span>
             <span v-if="item.badge" class="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-600 border border-gray-200">{{ item.badge }}</span>
           </button>
         </div>
       </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 bg-white rounded-xl border shadow-sm p-6 md:p-8">
      <!-- General Settings -->
      <div v-if="activeTab === 'general'">
        <h2 class="text-xl font-bold mb-6">Magasin général</h2>
        
        <div class="space-y-10">
          <!-- Profil Section -->
          <section class="space-y-6">
            <h3 class="font-semibold text-lg border-b pb-2">Profil</h3>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Nom</label>
              <input v-model="form.name" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Description</label>
              <textarea v-model="form.description" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"></textarea>
              <p class="mt-1 text-xs text-gray-500">Une brève description de votre magasin.</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Devise</label>
              <select v-model="form.currency" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2 bg-white">
                <option value="XAF">XAF (FCFA)</option>
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Lien de magasin</label>
              <div class="mt-1 flex rounded-md shadow-sm">
                <span class="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">take.app /</span>
                <input v-model="form.slug" type="text" class="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2" />
              </div>
              <p class="mt-1 text-xs text-gray-500">Lien vers votre magasin. Si vous modifiez ce paramètre, votre code QR et vos liens partagés ne seront plus valables.</p>
            </div>

            <div>
               <label class="block text-sm font-medium text-gray-700">Courriel</label>
               <input v-model="form.email" type="email" placeholder="ex: contact@maboutique.com" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2" />
               <p class="mt-1 text-xs text-gray-500">Les clients recevront des courriels à partir de cette adresse</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Adresse</label>
              <div class="mt-1">
                 <input v-model="form.address" placeholder="Entrer l'adresse" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2" />
              </div>
            </div>
          </section>

          <!-- WhatsApp Section -->
          <section class="space-y-6">
             <h3 class="font-semibold text-lg border-b pb-2">Numéro WhatsApp</h3>
             <p class="text-sm text-gray-500">Les clients enverront des messages de commande à ce numéro. Pour recevoir des notifications de commande automatiques, veuillez configurer votre flux de travail.</p>
             
             <div>
               <label class="block text-sm font-medium text-gray-700">Numéro primaire</label>
               <div class="mt-1 flex gap-2">
                 <select v-model="form.phoneCode" class="w-24 rounded-md border-gray-300 border p-2 bg-white">
                   <option value="+237">+237</option>
                   <option value="+33">+33</option>
                   <option value="+1">+1</option>
                   <option value="+241">+241</option>
                   <option value="+225">+225</option>
                   <option value="+221">+221</option>
                 </select>
                 <input v-model="form.phoneNumber" type="tel" placeholder="6..." class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2" />
               </div>
             </div>
          </section>

          <!-- Regional Section -->
          <section class="space-y-6">
             <div class="flex items-center gap-2 border-b pb-2">
               <h3 class="font-semibold text-lg">Régionale</h3>
               <div class="rounded-full border border-gray-300 w-4 h-4 flex items-center justify-center text-[10px] text-gray-500 cursor-help" title="Réglages régionaux">?</div>
             </div>
             
             <div>
               <label class="block text-sm font-medium text-gray-700">Pays/Région</label>
               <select v-model="form.country" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2 bg-white">
                 <option value="Cameroon">Cameroon</option>
                 <option value="France">France</option>
                 <option value="Gabon">Gabon</option>
                 <option value="Ivory Coast">Ivory Coast</option>
                 <option value="Senegal">Senegal</option>
               </select>
             </div>

             <div>
               <label class="block text-sm font-medium text-gray-700">Langue</label>
               <p class="text-xs text-gray-500 mb-1">Sélectionnez la langue de votre magasin. Cela changera la langue de l'interface de votre magasin.</p>
               <select v-model="form.language" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2 bg-white">
                 <option value="fr">Par défaut</option>
                 <option value="en">English</option>
               </select>
             </div>

             <div>
               <label class="block text-sm font-medium text-gray-700">Monnaie</label>
               <select v-model="form.currency" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2 bg-white">
                 <option value="XAF">XAF</option>
                 <option value="EUR">EUR</option>
                 <option value="USD">USD</option>
               </select>
             </div>

             <div>
               <label class="block text-sm font-medium text-gray-700">Unité de distance</label>
               <select v-model="form.distanceUnit" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2 bg-white">
                 <option value="km">Kilomètre</option>
                 <option value="mi">Mile</option>
               </select>
             </div>

             <div>
               <label class="block text-sm font-medium text-gray-700 mb-1">Fournisseur de carte</label>
               <div class="space-y-2">
                 <div class="flex items-center">
                   <input id="map-osm" name="map-provider" type="radio" value="osm" v-model="form.mapProvider" class="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500" />
                   <label for="map-osm" class="ml-3 block text-sm font-medium text-gray-700">OpenStreetMap</label>
                 </div>
                 <div class="flex items-center opacity-50 cursor-not-allowed">
                   <input id="map-google" name="map-provider" type="radio" value="google" disabled class="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500" />
                   <label for="map-google" class="ml-3 block text-sm font-medium text-gray-700">Google</label>
                 </div>
               </div>
               
               <div class="mt-2 rounded-md bg-blue-50 p-2 flex items-center justify-between">
                 <div class="flex items-center gap-2">
                   <div class="text-blue-500">⚡</div>
                   <span class="text-sm text-blue-700 font-medium">Mise à niveau nécessaire pour utiliser Business</span>
                 </div>
                 <button class="text-sm font-semibold text-gray-900 bg-white px-3 py-1 rounded border shadow-sm hover:bg-gray-50">Mise à niveau</button>
               </div>
             </div>

             <div>
               <label class="block text-sm font-medium text-gray-700">Taux d'imposition</label>
               <div class="mt-1 flex rounded-md shadow-sm">
                 <span class="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">%</span>
                 <input v-model="form.taxRate" type="number" step="0.01" class="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2" />
               </div>
             </div>

             <div>
               <label class="block text-sm font-medium text-gray-700 mb-1">Méthode fiscale</label>
               <div class="space-y-2">
                 <div class="flex items-center">
                   <input id="tax-inclusive" name="tax-method" type="radio" :value="true" v-model="form.taxInclusive" class="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500" />
                   <label for="tax-inclusive" class="ml-3 block text-sm font-medium text-gray-700">Inclusif</label>
                 </div>
                 <div class="flex items-center">
                   <input id="tax-exclusive" name="tax-method" type="radio" :value="false" v-model="form.taxInclusive" class="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500" />
                   <label for="tax-exclusive" class="ml-3 block text-sm font-medium text-gray-700">Exclusif</label>
                 </div>
               </div>
             </div>

             <div>
               <label class="block text-sm font-medium text-gray-700">ID de l'étiquette</label>
               <input v-model="form.taxId" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2" />
             </div>
          </section>

          <!-- Opening Hours -->
          <section class="rounded-lg border border-gray-200 bg-white p-4">
             <div class="flex items-center justify-between">
               <div class="flex items-center gap-2">
                  <h3 class="font-semibold text-gray-900">Heures d'ouverture</h3>
                  <div class="rounded-full border border-gray-300 w-4 h-4 flex items-center justify-center text-[10px] text-gray-500 cursor-help" title="Configurer les heures d'ouverture">?</div>
               </div>
               <div class="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                  <input type="checkbox" name="toggle" id="toggle-hours" v-model="form.openingHoursEnabled" class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                  <label for="toggle-hours" class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
               </div>
             </div>
             <p class="mt-1 text-sm text-gray-500">Les clients peuvent voir le statut "Ouvert" ou "Fermé" de votre magasin.</p>
          </section>

          <!-- Communities -->
          <section class="rounded-lg border border-gray-200 bg-white p-4 space-y-4">
             <div class="flex items-center gap-2">
                <h3 class="font-semibold text-gray-900">Communautés</h3>
                <div class="rounded-full border border-gray-300 w-4 h-4 flex items-center justify-center text-[10px] text-gray-500 cursor-help" title="Liens vers vos communautés">?</div>
             </div>
             <p class="text-sm text-gray-500">Mettez en valeur votre communauté en ligne dans votre magasin</p>
             
             <div>
               <label class="block text-sm font-medium text-gray-700">WhatsApp</label>
               <p class="text-xs text-gray-500 mb-1">Lien vers un groupe, une communauté ou un canal</p>
               <input v-model="form.socialWhatsapp" placeholder="https://" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2" />
             </div>

             <div>
               <label class="block text-sm font-medium text-gray-700">Télégramme</label>
               <p class="text-xs text-gray-500 mb-1">Lien de groupe ou de canal</p>
               <input v-model="form.socialTelegram" placeholder="https://" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2" />
             </div>

             <div>
               <label class="block text-sm font-medium text-gray-700">Instagram</label>
               <p class="text-xs text-gray-500 mb-1">Lien vers un groupe, un canal ou un profil</p>
               <input v-model="form.socialInstagram" placeholder="https://" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2" />
             </div>

             <div>
               <label class="block text-sm font-medium text-gray-700">Facebook</label>
               <p class="text-xs text-gray-500 mb-1">Lien vers un groupe ou une page</p>
               <input v-model="form.socialFacebook" placeholder="https://" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2" />
             </div>
          </section>

          <!-- Danger Zone -->
          <section class="rounded-lg border border-red-200 bg-white p-4 mt-8">
             <h3 class="font-semibold text-gray-900 mb-4">Zone de danger</h3>
             
             <div class="space-y-6">
                <!-- Disable Checkout -->
                <div class="flex items-start justify-between">
                   <div>
                      <h4 class="text-sm font-medium text-gray-900">Désactiver la caisse</h4>
                      <p class="text-sm text-gray-500">Les points d'entrée de la caisse seront désactivés et les clients ne pourront plus passer de commandes.</p>
                   </div>
                   <!-- Toggle -->
                   <div class="relative inline-block w-12 ml-4 align-middle select-none transition duration-200 ease-in flex-shrink-0">
                      <input type="checkbox" name="toggle-checkout" id="toggle-checkout" v-model="disableCheckoutComputed" class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                      <label for="toggle-checkout" class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                   </div>
                </div>

                <!-- Disable Store -->
                <div class="flex items-start justify-between">
                   <div>
                      <h4 class="text-sm font-medium text-gray-900">Désactiver le magasin</h4>
                      <p class="text-sm text-gray-500">Les magasins seront désactivés et tous les visiteurs seront redirigés vers WhatsApp.</p>
                   </div>
                   <!-- Toggle -->
                   <div class="relative inline-block w-12 ml-4 align-middle select-none transition duration-200 ease-in flex-shrink-0">
                      <input type="checkbox" name="toggle-store" id="toggle-store" v-model="disableStoreComputed" class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                      <label for="toggle-store" class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                   </div>
                </div>

                <!-- Business Banner -->
                <div class="bg-blue-50 border-l-4 border-blue-400 p-4 flex items-center justify-between">
                   <div class="flex items-center">
                      <div class="flex-shrink-0">
                         <!-- Lightning Icon -->
                         <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd" />
                         </svg>
                      </div>
                      <div class="ml-3">
                         <p class="text-sm text-blue-700">
                            Mise à niveau nécessaire pour utiliser Business
                         </p>
                      </div>
                   </div>
                   <button class="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium border border-blue-200 hover:bg-blue-50">
                      Mise à niveau
                   </button>
                </div>

                <!-- Delete Store -->
                <div class="pt-6 border-t border-gray-200">
                   <h4 class="text-sm font-medium text-gray-900 mb-2">Supprimer le magasin</h4>
                   <p class="text-sm text-gray-500 mb-2">Entrez <span class="font-mono bg-gray-100 px-1 rounded">{{ form.slug }}</span> pour confirmer la suppression</p>
                   
                   <input v-model="deleteConfirmation" type="text" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm border p-2 mb-4" />
                   
                   <button :disabled="deleteConfirmation !== form.slug" class="w-full bg-gray-200 text-gray-500 px-4 py-2 rounded-lg font-medium hover:bg-red-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-4">
                      Supprimer le magasin
                   </button>

                   <div class="rounded-md bg-red-50 p-4">
                      <div class="flex">
                         <div class="flex-shrink-0">
                            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                               <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                            </svg>
                         </div>
                         <div class="ml-3">
                            <h3 class="text-sm font-medium text-red-800">Danger</h3>
                            <div class="mt-2 text-sm text-red-700">
                               <p>Les commandes, les produits, les clients et tous les autres paramètres liés au magasin seront définitivement supprimés.</p>
                               <a href="#" class="font-medium underline hover:text-red-600 mt-1 inline-block">Voir plus</a>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </section>
        </div>
 
        <div class="mt-8 pt-6 border-t flex justify-end sticky bottom-0 bg-white py-4">
           <button @click="save" :disabled="saving" class="bg-gray-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2">
             <Loader2 v-if="saving" class="h-4 w-4 animate-spin" />
             <span>{{ saving ? 'Enregistrement...' : 'Enregistrer' }}</span>
           </button>
        </div>
      </div>
      
      <!-- Placeholder for other tabs -->
      <div v-else class="flex flex-col items-center justify-center h-96 text-center">
         <div class="p-4 bg-gray-100 rounded-full mb-4">
           <Lock class="h-8 w-8 text-gray-400" />
         </div>
         <h3 class="text-lg font-medium text-gray-900">Fonctionnalité Premium</h3>
         <p class="mt-2 text-sm text-gray-500 max-w-sm">Cette section nécessite un abonnement supérieur. Mettez à niveau votre plan pour accéder à ces réglages avancés.</p>
         <button class="mt-6 text-sm font-semibold text-green-600 hover:text-green-700">Voir les plans disponibles</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SupabaseClient } from '@supabase/supabase-js'
import { useAdminStore } from '~/stores/admin'
import { ArrowLeft, Lock, Loader2 } from 'lucide-vue-next'

useHead({ title: 'Admin | Réglages' })
definePageMeta({ layout: 'admin' })

const nuxt = useNuxtApp()
const supabase = nuxt.$supabase as SupabaseClient
const admin = useAdminStore()
const saving = ref(false)
const activeTab = ref('general')

const menu = [
  {
    title: 'Magasins',
    items: [
      { id: 'general', label: 'Général' },
      { id: 'payments', label: 'Paiements' },
      { id: 'checkout', label: 'Caisse' },
      { id: 'delivery', label: 'Livraison' },
    ]
  },
  {
    title: 'Entreprise',
    items: [
      { id: 'details', label: 'Détails' },
      { id: 'billing', label: 'Facturation' },
    ]
  }
]

const form = reactive({
  name: '',
  description: '',
  currency: 'XAF',
  slug: '',
  email: '',
  address: '',
  phoneCode: '+237',
  phoneNumber: '',
  country: 'Cameroon',
  language: 'fr',
  distanceUnit: 'km',
  mapProvider: 'osm',
  taxRate: 0,
  taxInclusive: true,
  taxId: '',
  openingHoursEnabled: false,
  socialWhatsapp: '',
  socialTelegram: '',
  socialInstagram: '',
  socialFacebook: '',
  checkoutEnabled: true,
  isActive: true
})

const originalSlug = ref('')
const deleteConfirmation = ref('')

const disableCheckoutComputed = computed({
  get: () => !form.checkoutEnabled,
  set: (val) => { form.checkoutEnabled = !val }
})

const disableStoreComputed = computed({
  get: () => !form.isActive,
  set: (val) => { form.isActive = !val }
})

onMounted(async () => {
  if (!admin.selectedShopId) return
  const { data, error } = await supabase.from('stores').select('*').eq('id', admin.selectedShopId).maybeSingle()
  if (data) {
    form.name = data.name || ''
    form.description = data.description || ''
    form.currency = data.currency || 'XAF'
    form.slug = data.slug || ''
    originalSlug.value = data.slug || ''
    form.email = data.email || '' 
    form.address = data.address || ''
    form.country = data.country || 'Cameroon'
    form.language = data.language || 'fr'
    form.distanceUnit = data.distance_unit || 'km'
    form.mapProvider = data.map_provider || 'osm'
    form.taxRate = Number(data.tax_rate || 0)
    form.taxInclusive = data.tax_inclusive !== false // default true
    form.taxId = data.tax_id || ''
    form.openingHoursEnabled = data.opening_hours_enabled || false
    form.socialWhatsapp = data.social_whatsapp || ''
    form.socialTelegram = data.social_telegram || ''
    form.socialInstagram = data.social_instagram || ''
    form.socialFacebook = data.social_facebook || ''
    form.checkoutEnabled = data.checkout_enabled !== false
    form.isActive = data.is_active !== false
    
    // Parse phone
    if (data.phone) {
      // Simple parse, assume starts with +
      const match = data.phone.match(/^(\+\d+)(.+)$/)
      if (match) {
        form.phoneCode = match[1]
        form.phoneNumber = match[2].trim()
      } else {
        form.phoneNumber = data.phone
      }
    }
  }
})

async function save() {
  const storeId = admin.selectedShopId
  if (!storeId) return
  
  saving.value = true
  const toast = useToast()
  
  try {
    const updates: any = {
      name: form.name,
      slug: form.slug,
      phone: form.phoneCode + form.phoneNumber.replace(/\s/g, '')
    }
    
    updates.description = form.description
    updates.currency = form.currency
    updates.email = form.email
    updates.address = form.address
    updates.country = form.country
    updates.language = form.language
    updates.distance_unit = form.distanceUnit
    updates.map_provider = form.mapProvider
    updates.tax_rate = form.taxRate
    updates.tax_inclusive = form.taxInclusive
    updates.tax_id = form.taxId
    updates.opening_hours_enabled = form.openingHoursEnabled
    updates.social_whatsapp = form.socialWhatsapp
    updates.social_telegram = form.socialTelegram
    updates.social_instagram = form.socialInstagram
    updates.social_facebook = form.socialFacebook
    updates.checkout_enabled = form.checkoutEnabled
    updates.is_active = form.isActive
    
    const { error } = await supabase.from('stores').update(updates).eq('id', storeId)
    
    if (error) {
       // Check for column error
       const msg = error.message
       if (msg.includes('column "email"') || msg.includes('column "address"') || msg.includes('column "description"') || msg.includes('column "currency"') || msg.includes('column "country"') || msg.includes('column "opening_hours_enabled"') || msg.includes('column "checkout_enabled"') || msg.includes('column "is_active"')) {
         // Naive retry: strip all optional fields
         delete updates.email
         delete updates.address
         delete updates.description
         delete updates.currency
         delete updates.country
         delete updates.language
         delete updates.distance_unit
         delete updates.map_provider
         delete updates.tax_rate
         delete updates.tax_inclusive
         delete updates.tax_id
         delete updates.opening_hours_enabled
         delete updates.social_whatsapp
         delete updates.social_telegram
         delete updates.social_instagram
         delete updates.social_facebook
         delete updates.checkout_enabled
         delete updates.is_active
         
         const { error: retryError } = await supabase.from('stores').update(updates).eq('id', storeId)
         if (retryError) throw retryError
         toast.success('Réglages de base mis à jour (Certains champs ignorés - Colonnes manquantes)')
       } else {
         throw error
       }
    } else {
       toast.success('Réglages mis à jour')
    }

    if (originalSlug.value !== form.slug) {
      // Slug changed, might need to redirect or warn
      originalSlug.value = form.slug
      toast.info('L\'URL de votre boutique a changé')
    }
    
  } catch (e: any) {
    console.error(e)
    toast.error('Erreur: ' + e.message)
  } finally {
    saving.value = false
  }
}
</script>
