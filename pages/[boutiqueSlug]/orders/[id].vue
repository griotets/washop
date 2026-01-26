<template>
  <div class="min-h-screen bg-gray-50 pb-12 print:bg-white print:pb-0">
    <div v-if="loading" class="flex h-screen items-center justify-center print:hidden">
      <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>

    <div v-else-if="error" class="flex h-screen flex-col items-center justify-center p-4 text-center print:hidden">
      <h1 class="text-xl font-bold text-red-500">Erreur</h1>
      <p class="mt-2 text-gray-600">{{ error }}</p>
      <NuxtLink :to="`/${route.params.boutiqueSlug}`" class="mt-4 rounded-lg bg-primary px-6 py-2 text-white">
        Retour à la boutique
      </NuxtLink>
    </div>

    <div v-else class="mx-auto max-w-md sm:my-8 print:max-w-none print:my-0">
      
      <!-- Actions Bar -->
      <div class="mb-4 flex items-center justify-end gap-2 px-4 sm:px-0 print:hidden">
        <button @click="printBill" class="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm border hover:bg-gray-50">
          <Printer class="h-4 w-4" />
          <span class="hidden sm:inline">Imprimer</span>
        </button>
        <button @click="downloadImage" class="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm border hover:bg-gray-50">
          <ImageIcon class="h-4 w-4" />
          <span class="hidden sm:inline">Image</span>
        </button>
        <button @click="downloadPDF" class="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm border hover:bg-gray-50">
          <FileText class="h-4 w-4" />
          <span class="hidden sm:inline">PDF</span>
        </button>
      </div>

      <!-- Bill Content -->
      <div ref="billRef" class="bg-white shadow-sm sm:rounded-xl sm:border print:shadow-none print:border-none print:rounded-none">
        <!-- Header -->
        <div class="border-b bg-gray-50 p-6 text-center print:bg-white">
          <div v-if="store?.image_url" class="mx-auto mb-4 h-16 w-16 overflow-hidden rounded-full border bg-white shadow-sm">
            <img :src="store.image_url" class="h-full w-full object-cover" />
          </div>
          <div v-else class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Store class="h-8 w-8" />
          </div>
          <h1 class="text-xl font-bold text-gray-900">{{ store?.name }}</h1>
          <NuxtLink to="/" class="mt-1 block text-sm text-gray-500 hover:text-primary hover:underline print:no-underline print:text-gray-500">Propulsé par Wa-Shop</NuxtLink>
          <div class="mt-4 flex justify-center print:hidden">
            <a v-if="store?.phone" :href="`tel:${store.phone}`" class="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-gray-700 shadow-sm border hover:bg-gray-50">
              <Phone class="h-4 w-4" />
              {{ formatPhone(store.phone) }}
            </a>
          </div>
          <!-- Show phone in print only -->
          <div class="mt-2 hidden text-sm text-gray-600 print:block">
            Tél: {{ formatPhone(store?.phone) }}
          </div>
        </div>

        <!-- Order Info -->
        <div class="border-b p-6">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-xs font-medium text-gray-500 uppercase tracking-wider">Numéro de facture</div>
              <div class="mt-1 font-mono font-bold text-gray-900">#{{ order?.id?.slice(0, 8) }}</div>
            </div>
            <div class="text-right">
              <div class="text-xs font-medium text-gray-500 uppercase tracking-wider">Date de commande</div>
              <div class="mt-1 font-medium text-gray-900">{{ formatDate(order?.created_at) }}</div>
            </div>
          </div>
          
          <!-- Status Badge -->
          <div class="mt-4">
            <span :class="['inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium print:border print:bg-white print:text-black', statusColor]">
              {{ statusLabel }}
            </span>
          </div>
        </div>

        <!-- Items -->
        <div class="p-6">
          <h3 class="mb-4 text-sm font-medium text-gray-900 uppercase tracking-wider">Articles</h3>
          <div class="space-y-4">
            <div v-for="item in orderItems" :key="item.id" class="flex justify-between">
              <div class="flex gap-3">
                <div class="font-medium text-gray-900">{{ item.quantity }}x</div>
                <div class="text-gray-600">{{ item.product_name }}</div>
              </div>
              <div class="font-medium text-gray-900">{{ formatPrice(item.unit_price * item.quantity) }}</div>
            </div>
          </div>

          <div class="my-6 border-t border-dashed"></div>

          <div class="space-y-2">
            <div class="flex justify-between text-sm text-gray-600">
              <span>Total des articles ({{ totalQuantity }})</span>
              <span>{{ formatPrice(order?.total_amount) }}</span>
            </div>
            <div class="flex justify-between text-sm text-gray-600">
              <span>Sous-total</span>
              <span>{{ formatPrice(order?.total_amount) }}</span>
            </div>
            <div class="flex justify-between text-lg font-bold text-gray-900 pt-2">
              <span>Total</span>
              <span>{{ formatPrice(order?.total_amount) }}</span>
            </div>
          </div>
        </div>

        <!-- Customer Details -->
        <div class="border-t bg-gray-50 p-6 print:bg-white">
          <h3 class="mb-4 text-sm font-medium text-gray-900 uppercase tracking-wider">Détails de la commande</h3>
          <dl class="space-y-3 text-sm">
            <div class="flex justify-between">
              <dt class="text-gray-500">Client</dt>
              <dd class="font-medium text-gray-900 text-right">
                {{ order?.customer_name }}
                <br>
                <span class="text-gray-500">{{ order?.customer_phone }}</span>
              </dd>
            </div>
            
            <div v-if="order?.delivery_method" class="flex justify-between">
              <dt class="text-gray-500">Service</dt>
              <dd class="font-medium text-gray-900">
                {{ order.delivery_method === 'pickup' ? 'Commande à emporter' : 'Livraison' }}
              </dd>
            </div>

            <div v-if="order?.delivery_address" class="flex justify-between">
               <dt class="text-gray-500">Adresse</dt>
               <dd class="font-medium text-gray-900 text-right">{{ order.delivery_address }}<br>{{ order.city }}</dd>
            </div>

             <div v-if="order?.note" class="flex justify-between">
               <dt class="text-gray-500">Note</dt>
               <dd class="font-medium text-gray-900 text-right italic">{{ order.note }}</dd>
            </div>
          </dl>
        </div>

        <!-- History / Actions -->
        <div class="border-t p-6 print:hidden">
          <h3 class="mb-4 text-sm font-medium text-gray-900 uppercase tracking-wider">Historique</h3>
          <div class="relative pl-4 border-l-2 border-gray-200 space-y-6">
            <div class="relative">
              <div class="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-green-500 ring-4 ring-white"></div>
              <div class="text-sm font-medium text-gray-900">Ordre créé</div>
              <div class="text-xs text-gray-500">{{ formatDate(order?.created_at, true) }}</div>
            </div>
            <!-- Add more history items based on status if needed -->
          </div>

          <div class="mt-8 grid gap-3">
            <a v-if="store?.phone" :href="whatsappLink" target="_blank" class="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-3 font-semibold text-white hover:brightness-110">
              <MessageCircle class="h-5 w-5" />
              Contacter sur WhatsApp
            </a>
            <NuxtLink :to="`/${route.params.boutiqueSlug}`" class="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50">
              Retour à la boutique
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Store, Phone, MessageCircle, Printer, Image as ImageIcon, FileText } from 'lucide-vue-next'
import type { SupabaseClient } from '@supabase/supabase-js'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { parsePhoneNumber } from 'libphonenumber-js'

const route = useRoute()
const nuxt = useNuxtApp()
const supabase = nuxt.$supabase as SupabaseClient

const loading = ref(true)
const error = ref<string | null>(null)
const order = ref<any>(null)
const orderItems = ref<any[]>([])
const store = ref<any>(null)
const billRef = ref<HTMLElement | null>(null)

const totalQuantity = computed(() => orderItems.value.reduce((acc, item) => acc + (item.quantity || 0), 0))

const statusLabel = computed(() => {
  switch (order.value?.status) {
    case 'new': return 'Nouveau'
    case 'sent_to_whatsapp': return 'Envoyé WhatsApp'
    case 'processing': return 'En cours'
    case 'completed': return 'Terminé'
    case 'cancelled': return 'Annulé'
    default: return order.value?.status || 'Inconnu'
  }
})

const statusColor = computed(() => {
  switch (order.value?.status) {
    case 'new': return 'bg-blue-100 text-blue-800 border border-blue-200'
    case 'sent_to_whatsapp': return 'bg-green-100 text-green-800 border border-green-200'
    case 'processing': return 'bg-yellow-100 text-yellow-800 border border-yellow-200'
    case 'completed': return 'bg-gray-100 text-gray-800 border border-gray-200'
    case 'cancelled': return 'bg-red-100 text-red-800 border border-red-200'
    default: return 'bg-gray-100 text-gray-800 border border-gray-200'
  }
})

const whatsappLink = computed(() => {
  if (!store.value?.phone) return '#'
  const phone = String(store.value.phone).replace(/\D/g, '')
  
  let baseUrl = ''
  if (import.meta.client) {
    baseUrl = window.location.origin
  }
  
  const billUrl = `${baseUrl}${route.fullPath}`
  const storeUrl = `${baseUrl}/${route.params.boutiqueSlug}`
  
  let message = `Bonjour, je vous contacte concernant la commande #${order.value?.id?.slice(0, 8)}`
  
  if (baseUrl) {
    message += `\n\n📄 Facture: ${billUrl}`
    message += `\n🏪 Boutique: ${storeUrl}`
  }
  
  const text = encodeURIComponent(message)
  return `https://wa.me/${phone}?text=${text}`
})

function formatPrice(amount: any) {
  return Number(amount || 0).toLocaleString('fr-FR') + ' XAF'
}

function formatDate(date: string, withTime = false) {
  if (!date) return ''
  try {
    const d = new Date(date)
    return d.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {})
    })
  } catch {
    return date
  }
}

function formatPhone(phone: string) {
  if (!phone) return ''
  try {
    const parsed = parsePhoneNumber(phone)
    if (parsed) return parsed.formatInternational()
    return phone
  } catch {
    return phone
  }
}

// --- Tools ---
function printBill() {
  window.print()
}

async function downloadImage() {
  if (!billRef.value) return
  try {
    const canvas = await html2canvas(billRef.value, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    })
    const image = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = image
    link.download = `facture-${order.value?.id?.slice(0, 8)}.png`
    link.click()
  } catch (err) {
    console.error('Download image failed:', err)
  }
}

async function downloadPDF() {
  if (!billRef.value) return
  try {
    const canvas = await html2canvas(billRef.value, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    })
    const imgData = canvas.toDataURL('image/png')
    
    // Calculate PDF dimensions to fit content
    const imgWidth = 210 // A4 width in mm
    const pageHeight = 295 // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    
    const pdf = new jsPDF('p', 'mm', 'a4')
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
    pdf.save(`facture-${order.value?.id?.slice(0, 8)}.pdf`)
  } catch (err) {
    console.error('Download PDF failed:', err)
  }
}

onMounted(async () => {
  const orderId = route.params.id as string
  if (!orderId) {
    error.value = 'ID de commande manquant'
    loading.value = false
    return
  }

  try {
    // 1. Fetch Order
    const { data: orderData, error: orderErr } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (orderErr) throw orderErr
    order.value = orderData

    // 2. Fetch Store
    if (orderData.store_id) {
      const { data: storeData, error: storeErr } = await supabase
        .from('stores')
        .select('name, phone, image_url, slug')
        .eq('id', orderData.store_id)
        .single()
      
      if (storeErr) console.error('Error fetching store:', storeErr)
      else store.value = storeData
    }

    // 3. Fetch Items
    const { data: itemsData, error: itemsErr } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId)

    if (itemsErr) throw itemsErr
    orderItems.value = itemsData || []

  } catch (e: any) {
    console.error('Error loading order:', e)
    error.value = 'Commande introuvable ou erreur de chargement.'
  } finally {
    loading.value = false
  }
})

useHead({
  title: computed(() => order.value ? `Commande #${order.value.id.slice(0,8)}` : 'Commande')
})
</script>

<style scoped>
@media print {
  @page { margin: 0; }
  body { margin: 1.6cm; }
}
</style>
