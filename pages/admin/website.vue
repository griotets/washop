<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">Configuration du Site Web</h1>
      <div class="flex items-center gap-3">
        <a :href="previewUrl" target="_blank" class="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          <ExternalLink class="h-4 w-4" />
          Voir le site
        </a>
        <button @click="saveChanges" :disabled="saving" class="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50">
          <Save class="h-4 w-4" />
          {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
        </button>
      </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-3">
      <!-- Left Column: Preview & Branding -->
      <div class="space-y-6 lg:col-span-2">
        <!-- Branding Card -->
        <div class="rounded-xl border bg-white p-6 shadow-sm">
          <h2 class="mb-4 text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Palette class="h-5 w-5 text-gray-500" />
            Identité Visuelle
          </h2>
          
          <div class="space-y-4">
            <!-- Logo -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Logo de la boutique</label>
              <div class="mt-2 flex items-center gap-4">
                <div class="relative h-20 w-20 overflow-hidden rounded-lg border bg-gray-50">
                  <img v-if="form.image_url" :src="form.image_url" class="h-full w-full object-cover" />
                  <div v-else class="flex h-full w-full items-center justify-center text-gray-400">
                    <ImageIcon class="h-8 w-8" />
                  </div>
                </div>
                <div class="flex-1">
                  <input type="file" accept="image/*" @change="handleLogoUpload" class="block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-green-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-green-700 hover:file:bg-green-100" />
                  <p class="mt-1 text-xs text-gray-500">JPG, PNG ou GIF. Max 2MB.</p>
                </div>
              </div>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label class="block text-sm font-medium text-gray-700">Nom de la boutique</label>
                <input v-model="form.name" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Couleur Principale</label>
                <div class="mt-1 flex items-center gap-2">
                  <input v-model="form.color" type="color" class="h-9 w-14 cursor-pointer rounded border p-1" />
                  <input v-model="form.color" type="text" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" />
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Description courte</label>
              <textarea v-model="form.description" rows="2" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" placeholder="Votre slogan ou une brève description..."></textarea>
            </div>
          </div>
        </div>

        <!-- Home Page Settings -->
        <div class="rounded-xl border bg-white p-6 shadow-sm">
          <h2 class="mb-4 text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Layout class="h-5 w-5 text-gray-500" />
            Page d'accueil
          </h2>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-gray-700">Bannière promotionnelle</label>
              <button 
                @click="form.design_settings.banner_enabled = !form.design_settings.banner_enabled" 
                :class="form.design_settings.banner_enabled ? 'bg-green-600' : 'bg-gray-200'"
                class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <span :class="form.design_settings.banner_enabled ? 'translate-x-5' : 'translate-x-0'" class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
              </button>
            </div>

            <div v-if="form.design_settings.banner_enabled" class="grid gap-4 rounded-lg bg-gray-50 p-4 sm:grid-cols-2">
              <div class="sm:col-span-2">
                <label class="block text-xs font-medium text-gray-500">Texte de la bannière</label>
                <input v-model="form.design_settings.banner_text" type="text" placeholder="Ex: Livraison gratuite dès 10.000 FCFA !" class="mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-green-500 focus:ring-green-500" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-500">Texte du bouton (optionnel)</label>
                <input v-model="form.design_settings.banner_btn_text" type="text" placeholder="En savoir plus" class="mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-green-500 focus:ring-green-500" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-500">Lien du bouton (optionnel)</label>
                <input v-model="form.design_settings.banner_link" type="text" placeholder="https://..." class="mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-green-500 focus:ring-green-500" />
              </div>
            </div>
          </div>
        </div>

        <!-- Social Media -->
        <div class="rounded-xl border bg-white p-6 shadow-sm">
          <h2 class="mb-4 text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Share2 class="h-5 w-5 text-gray-500" />
            Réseaux Sociaux
          </h2>
          
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <MessageCircle class="h-4 w-4 text-green-500" /> WhatsApp
              </label>
              <input v-model="form.social_whatsapp" type="text" placeholder="Lien WhatsApp Channel/Groupe" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <Facebook class="h-4 w-4 text-blue-600" /> Facebook
              </label>
              <input v-model="form.social_facebook" type="text" placeholder="Lien page Facebook" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <Instagram class="h-4 w-4 text-pink-600" /> Instagram
              </label>
              <input v-model="form.social_instagram" type="text" placeholder="Lien profil Instagram" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <Send class="h-4 w-4 text-blue-400" /> Telegram
              </label>
              <input v-model="form.social_telegram" type="text" placeholder="Lien canal Telegram" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" />
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Marketing Tools -->
      <div class="space-y-6">
        <!-- Popup Settings -->
        <div class="rounded-xl border bg-white p-6 shadow-sm">
          <h2 class="mb-4 text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Megaphone class="h-5 w-5 text-gray-500" />
            Pop-up Promo
          </h2>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-gray-700">Activer le pop-up</label>
              <button 
                @click="form.design_settings.popup_enabled = !form.design_settings.popup_enabled" 
                :class="form.design_settings.popup_enabled ? 'bg-green-600' : 'bg-gray-200'"
                class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <span :class="form.design_settings.popup_enabled ? 'translate-x-5' : 'translate-x-0'" class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
              </button>
            </div>

            <div v-if="form.design_settings.popup_enabled" class="space-y-3 rounded-lg bg-gray-50 p-4">
              <div>
                <label class="block text-xs font-medium text-gray-500">Titre</label>
                <input v-model="form.design_settings.popup_title" type="text" placeholder="Offre Spéciale !" class="mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-green-500 focus:ring-green-500" />
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-500">Description</label>
                <textarea v-model="form.design_settings.popup_description" rows="3" placeholder="Obtenez -20%..." class="mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-green-500 focus:ring-green-500"></textarea>
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-500">Lien du bouton (optionnel)</label>
                <input v-model="form.design_settings.popup_link" type="text" placeholder="https://..." class="mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-green-500 focus:ring-green-500" />
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Tips -->
        <div class="rounded-xl bg-blue-50 p-4 border border-blue-100">
          <h3 class="flex items-center gap-2 font-medium text-blue-800">
            <Info class="h-4 w-4" />
            Conseils de pro
          </h3>
          <ul class="mt-2 list-disc pl-4 text-sm text-blue-700 space-y-1">
            <li>Utilisez des images de haute qualité pour votre logo.</li>
            <li>Choisissez une couleur principale qui contraste bien avec le blanc.</li>
            <li>Les pop-ups sont efficaces mais peuvent être intrusifs. Utilisez-les avec parcimonie.</li>
            <li>Testez toujours vos liens avant d'enregistrer.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useAdminStore } from '~/stores/admin'
import { useToast } from '~/composables/useToast'
import { ExternalLink, Save, Palette, ImageIcon, Layout, Share2, MessageCircle, Facebook, Instagram, Send, Megaphone, Info } from 'lucide-vue-next'
import type { SupabaseClient } from '@supabase/supabase-js'

definePageMeta({ layout: 'admin' })

const nuxt = useNuxtApp()
const supabase = nuxt.$supabase as SupabaseClient
const admin = useAdminStore()
const toast = useToast()

const saving = ref(false)
const previewUrl = computed(() => {
  if (import.meta.client) {
    return `${window.location.origin}/${admin.currentStore?.slug || ''}`
  }
  return ''
})

const form = reactive({
  name: '',
  description: '',
  image_url: '',
  color: '#25D366',
  social_whatsapp: '',
  social_facebook: '',
  social_instagram: '',
  social_telegram: '',
  design_settings: {
    banner_enabled: false,
    banner_text: '',
    banner_btn_text: '',
    banner_link: '',
    popup_enabled: false,
    popup_title: '',
    popup_description: '',
    popup_link: ''
  }
})

onMounted(async () => {
  await loadSettings()
})

async function loadSettings() {
  if (!admin.selectedShopId) return

  const { data, error } = await supabase
    .from('stores')
    .select('*')
    .eq('id', admin.selectedShopId)
    .single()

  if (data) {
    form.name = data.name || ''
    form.description = data.description || ''
    form.image_url = data.image_url || ''
    form.color = data.color || '#25D366'
    form.social_whatsapp = data.social_whatsapp || ''
    form.social_facebook = data.social_facebook || ''
    form.social_instagram = data.social_instagram || ''
    form.social_telegram = data.social_telegram || ''
    
    if (data.design_settings) {
      Object.assign(form.design_settings, data.design_settings)
    }
  }
}

async function handleLogoUpload(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return

  const file = input.files[0]
  if (file.size > 2 * 1024 * 1024) {
    toast.error('L\'image est trop volumineuse (max 2MB)')
    return
  }

  const ext = file.name.split('.').pop()
  const fileName = `${admin.selectedShopId}/logo-${Date.now()}.${ext}`

  try {
    saving.value = true
    const { data, error } = await supabase.storage
      .from('store-images')
      .upload(fileName, file, { upsert: true })

    if (error) throw error

    const { data: publicUrl } = supabase.storage
      .from('store-images')
      .getPublicUrl(fileName)

    form.image_url = publicUrl.publicUrl
    toast.success('Logo téléchargé avec succès')
  } catch (e: any) {
    toast.error('Erreur lors du téléchargement: ' + e.message)
  } finally {
    saving.value = false
  }
}

async function saveChanges() {
  if (!admin.selectedShopId) return
  saving.value = true

  try {
    const { error } = await supabase
      .from('stores')
      .update({
        name: form.name,
        description: form.description,
        image_url: form.image_url,
        color: form.color,
        social_whatsapp: form.social_whatsapp,
        social_facebook: form.social_facebook,
        social_instagram: form.social_instagram,
        social_telegram: form.social_telegram,
        design_settings: form.design_settings
      })
      .eq('id', admin.selectedShopId)

    if (error) throw error

    toast.success('Modifications enregistrées !')
    // Refresh store info in admin store if needed
    // admin.fetchSubscription(supabase) 
  } catch (e: any) {
    console.error(e)
    toast.error('Erreur lors de l\'enregistrement: ' + e.message)
  } finally {
    saving.value = false
  }
}
</script>
