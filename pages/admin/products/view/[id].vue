<script setup lang="ts">
import { Wand2, Download, Copy, Check, ArrowLeft, ExternalLink, Share2, Facebook, MessageCircle, Save, History, Trash2 } from 'lucide-vue-next'
import { useAdmin } from '~/composables/useAdmin'

definePageMeta({
  layout: 'admin'
})

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { getProduct, getCategories, getTags } = useAdmin()
const { $supabase } = useNuxtApp()
const supabase = $supabase as any

const product = ref<any>(null)
const categories = ref<any[]>([])
const tags = ref<any[]>([])
const loading = ref(true)

// Ad Generation State
const adGeneration = reactive({
  loading: false,
  error: '',
  result: null as { text: string; image: string } | null,
  copied: false,
  sharing: false,
  saving: false,
  saved: false,
  options: {
    tone: 'professional',
    platform: 'facebook'
  }
})

const savedAds = ref<any[]>([])
const savedAdsLoading = ref(false)

onMounted(async () => {
  try {
    const [p, c, t] = await Promise.all([
      getProduct(String(route.params.id)),
      getCategories(),
      getTags()
    ])
    product.value = p
    categories.value = c
    tags.value = t
    
    // Fetch saved ads
    fetchSavedAds()
  } catch (e) {
    console.error(e)
    router.push('/admin/products')
  } finally {
    loading.value = false
  }
})

async function fetchSavedAds() {
  if (!product.value?.id) return
  savedAdsLoading.value = true
  
  try {
    const { data, error } = await supabase
      .from('product_ads')
      .select('*')
      .eq('product_id', product.value.id)
      .order('created_at', { ascending: false })
      
    if (error) throw error
    savedAds.value = data || []
  } catch (e) {
    console.error('Error fetching saved ads:', e)
  } finally {
    savedAdsLoading.value = false
  }
}

async function saveCurrentAd() {
  if (!adGeneration.result || !product.value?.store_id) return
  adGeneration.saving = true
  
  try {
    const { error } = await supabase
      .from('product_ads')
      .insert({
        store_id: product.value.store_id,
        product_id: product.value.id,
        platform: adGeneration.options.platform,
        tone: adGeneration.options.tone,
        content_text: adGeneration.result.text,
        image_url: adGeneration.result.image,
        metadata: { 
          generated_at: new Date().toISOString()
        }
      })
      
    if (error) throw error
    
    adGeneration.saved = true
    setTimeout(() => adGeneration.saved = false, 3000)
    fetchSavedAds()
  } catch (e) {
    console.error('Error saving ad:', e)
    alert('Failed to save ad')
  } finally {
    adGeneration.saving = false
  }
}

async function deleteSavedAd(id: string) {
  if (!confirm('Are you sure?')) return
  
  try {
    const { error } = await supabase
      .from('product_ads')
      .delete()
      .eq('id', id)
      
    if (error) throw error
    fetchSavedAds()
  } catch (e) {
    console.error('Error deleting ad:', e)
  }
}

function loadSavedAd(ad: any) {
  adGeneration.result = {
    text: ad.content_text,
    image: ad.image_url
  }
  adGeneration.options.platform = ad.platform
  adGeneration.options.tone = ad.tone || 'professional'
  // Scroll to generator
  document.querySelector('.ad-generator-panel')?.scrollIntoView({ behavior: 'smooth' })
}


const firstImage = computed(() => {
  if (product.value?.images?.length) return product.value.images[0]
  return ''
})

const categoryName = computed(() => {
  if (!product.value?.category_id) return t('admin.productForm.noneOption')
  const c = categories.value.find(c => c.id === product.value.category_id)
  return c ? c.name : t('admin.productForm.noneOption')
})

const activeTags = computed(() => {
  if (!product.value?.tags) return []
  return tags.value.filter(t => product.value.tags.includes(t.id))
})

async function generateAd() {
  if (!product.value) return
  
  adGeneration.loading = true
  adGeneration.error = ''
  adGeneration.result = null
  
  try {
    const data = await $fetch('/api/generate-ad', {
      method: 'POST',
      body: {
        productName: product.value.name,
        price: `${product.value.price} XAF`,
        description: product.value.description || '',
        productId: product.value.id, // Pass ID for link generation
        imageUrl: firstImage.value || undefined,
        tone: adGeneration.options.tone,
        platform: adGeneration.options.platform
      }
    })
    adGeneration.result = data as any
  } catch (e: any) {
    console.error('Ad generation error:', e)
    adGeneration.error = e.message || 'Unknown error'
  } finally {
    adGeneration.loading = false
  }
}

function downloadAdImage() {
  const image = adGeneration.result?.image
  if (!image) return
  
  const link = document.createElement('a')
  link.href = image
  link.download = `ad-${product.value.name.replace(/\s+/g, '-').toLowerCase()}.jpg`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

async function shareAd() {
  if (!adGeneration.result) return
  adGeneration.sharing = true
  
  try {
    const response = await fetch(adGeneration.result.image)
    const blob = await response.blob()
    const file = new File([blob], 'ad.jpg', { type: 'image/jpeg' })
    
    if (navigator.share) {
      await navigator.share({
        title: product.value.name,
        text: adGeneration.result.text,
        files: [file]
      })
    } else {
      // Fallback if native share not supported
      copyAdText()
      downloadAdImage()
      alert(t('admin.productForm.shareFallback'))
    }
  } catch (e) {
    console.error('Share error:', e)
  } finally {
    adGeneration.sharing = false
  }
}

function shareToSocial(platform: 'whatsapp' | 'facebook' | 'telegram') {
  if (!adGeneration.result) return
  const text = encodeURIComponent(adGeneration.result.text)
  const url = encodeURIComponent(window.location.origin + `/product/${product.value.slug}`) // Assuming slug usage
  
  let shareUrl = ''
  if (platform === 'whatsapp') {
    shareUrl = `https://wa.me/?text=${text}`
  } else if (platform === 'facebook') {
    // FB only allows URL sharing, not pre-filled text usually
    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`
  } else if (platform === 'telegram') {
    shareUrl = `https://t.me/share/url?url=${url}&text=${text}`
  }
  
  window.open(shareUrl, '_blank')
}

function copyAdText() {
  const text = adGeneration.result?.text
  if (!text) return
  
  navigator.clipboard.writeText(text)
  adGeneration.copied = true
  setTimeout(() => adGeneration.copied = false, 2000)
}

function getNumberLocale() {
  return 'fr-FR' 
}
</script>

<template>
  <div v-if="loading" class="flex items-center justify-center min-h-[50vh]">
    <div class="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
  </div>
  
  <div v-else-if="product">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-4">
        <NuxtLink to="/admin/products" class="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
          <ArrowLeft class="h-5 w-5" />
        </NuxtLink>
        <div>
          <h1 class="text-2xl font-bold">{{ product.name }}</h1>
          <div class="text-sm text-gray-500">SKU: {{ product.sku || '-' }}</div>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <NuxtLink :to="`/admin/products/${product.id}`" class="rounded-lg border bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50">
          {{ t('admin.productPage.edit') }}
        </NuxtLink>
        <a :href="`/product/${product.slug}`" target="_blank" class="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 flex items-center gap-2">
          <ExternalLink class="h-4 w-4" />
          {{ t('admin.productPage.viewOnStore') }}
        </a>
      </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-3">
      <!-- Left Column: Product Info -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Main Info -->
        <div class="rounded-xl border bg-white p-6 shadow-sm">
          <div class="grid sm:grid-cols-2 gap-6">
            <div>
              <div class="text-sm font-medium text-gray-500 mb-1">{{ t('admin.productForm.priceLabel') }}</div>
              <div class="text-2xl font-bold text-gray-900">XAF {{ Number(product.price).toLocaleString(getNumberLocale()) }}</div>
            </div>
            <div>
              <div class="text-sm font-medium text-gray-500 mb-1">{{ t('admin.productForm.categoryTitle') }}</div>
              <div class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {{ categoryName }}
              </div>
            </div>
          </div>

          <div class="mt-6">
             <div class="text-sm font-medium text-gray-500 mb-2">{{ t('admin.productForm.descriptionLabel') }}</div>
             <div class="prose prose-sm max-w-none text-gray-700 whitespace-pre-line">{{ product.description || '-' }}</div>
          </div>

          <div class="mt-6 pt-6 border-t grid sm:grid-cols-3 gap-4">
            <div>
               <div class="text-xs text-gray-500 uppercase tracking-wider mb-1">{{ t('admin.productForm.inventoryLabel') }}</div>
               <div class="font-medium">{{ product.track_inventory ? product.stock_quantity : 'Unlimited' }}</div>
            </div>
            <div>
               <div class="text-xs text-gray-500 uppercase tracking-wider mb-1">{{ t('admin.productForm.visibleLabel') }}</div>
               <div class="flex items-center gap-2">
                 <div class="h-2 w-2 rounded-full" :class="product.is_visible ? 'bg-green-500' : 'bg-gray-300'"></div>
                 <span class="text-sm">{{ product.is_visible ? 'Visible' : 'Hidden' }}</span>
               </div>
            </div>
             <div>
               <div class="text-xs text-gray-500 uppercase tracking-wider mb-1">{{ t('admin.productForm.tagsTitle') }}</div>
               <div class="flex flex-wrap gap-1">
                 <span v-for="tag in activeTags" :key="tag.id" class="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600 border">
                   {{ tag.name }}
                 </span>
                 <span v-if="activeTags.length === 0" class="text-sm text-gray-400">-</span>
               </div>
            </div>
          </div>
        </div>

        <!-- Images -->
        <div class="rounded-xl border bg-white p-6 shadow-sm">
           <h3 class="font-semibold mb-4">{{ t('admin.productForm.imagesTitle') }}</h3>
           <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
             <div v-for="(img, i) in product.images" :key="i" class="aspect-square rounded-lg border bg-gray-50 overflow-hidden">
               <img :src="img" class="h-full w-full object-cover hover:scale-105 transition-transform" />
             </div>
             <div v-if="!product.images?.length" class="col-span-full text-center py-8 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed">
               No images available
             </div>
           </div>
        </div>
      </div>

      <!-- Right Column: Ad Generator -->
      <div class="space-y-6">
        <div class="rounded-xl border border-indigo-100 bg-indigo-50/30 p-5 shadow-sm sticky top-6 ad-generator-panel">
          <div class="flex items-center gap-3 mb-4">
            <div class="rounded-lg bg-indigo-600 p-2 text-white shadow-lg shadow-indigo-200">
              <Wand2 class="h-6 w-6" />
            </div>
            <div>
              <h3 class="font-bold text-indigo-900">{{ t('admin.productForm.adGeneratorTitle') }}</h3>
              <p class="text-xs text-indigo-600 font-medium">AI Marketing Assistant</p>
            </div>
          </div>
          
          <p class="text-sm text-gray-600 mb-6 leading-relaxed">
            {{ t('admin.productForm.adGeneratorDesc') }}
          </p>

          <!-- Options -->
          <div class="space-y-4 mb-6">
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{{ t('admin.productForm.adTone') }}</label>
              <select v-model="adGeneration.options.tone" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500">
                <option value="professional">{{ t('admin.productForm.adToneProfessional') }}</option>
                <option value="fun">{{ t('admin.productForm.adToneFun') }}</option>
                <option value="urgent">{{ t('admin.productForm.adToneUrgent') }}</option>
                <option value="luxury">{{ t('admin.productForm.adToneLuxury') }}</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{{ t('admin.productForm.adPlatform') }}</label>
              <select v-model="adGeneration.options.platform" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500">
                <option value="facebook">Facebook / Instagram</option>
                <option value="whatsapp">WhatsApp Status</option>
                <option value="twitter">Twitter / X</option>
                <option value="linkedin">LinkedIn</option>
              </select>
            </div>
          </div>

          <button 
            type="button"
            @click="generateAd" 
            :disabled="adGeneration.loading"
            class="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            <Wand2 v-if="!adGeneration.loading" class="h-5 w-5" />
            <div v-else class="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            {{ adGeneration.loading ? t('admin.productForm.generatingAd') : t('admin.productForm.generateAdBtn') }}
          </button>

          <div v-if="adGeneration.error" class="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
            {{ t('admin.productForm.adError', { msg: adGeneration.error }) }}
          </div>

          <div v-if="adGeneration.result" class="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <!-- Visual Result -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">{{ t('admin.productForm.adVisual') }}</label>
                <div class="flex gap-2">
                  <button @click="saveCurrentAd" :disabled="adGeneration.saving || adGeneration.saved" class="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1">
                    <Check v-if="adGeneration.saved" class="h-3 w-3" />
                    <Save v-else class="h-3 w-3" /> 
                    {{ adGeneration.saved ? t('admin.productForm.adSaved') : t('admin.productForm.saveAd') }}
                  </button>
                  <button @click="shareAd" class="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1">
                    <Share2 class="h-3 w-3" /> {{ t('common.share') }}
                  </button>
                  <button @click="downloadAdImage" class="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1">
                    <Download class="h-3 w-3" /> {{ t('admin.productForm.downloadImage') }}
                  </button>
                </div>
              </div>
              <div class="relative group rounded-xl overflow-hidden border-2 border-indigo-100 bg-white shadow-md aspect-square">
                <img :src="adGeneration.result?.image" class="h-full w-full object-cover" />
              </div>
            </div>

            <!-- Text Result -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">{{ t('admin.productForm.adCopy') }}</label>
                <span v-if="adGeneration.copied" class="text-xs text-green-600 font-bold animate-pulse">{{ t('admin.productForm.textCopied') }}</span>
              </div>
              <div class="relative">
                <textarea 
                  readonly 
                  :value="adGeneration.result?.text" 
                  rows="8" 
                  class="w-full resize-none rounded-xl border border-indigo-100 bg-white px-4 py-3 text-sm text-gray-700 focus:border-indigo-300 focus:ring-indigo-200 shadow-sm"
                ></textarea>
                <button 
                  @click="copyAdText" 
                  class="absolute right-2 top-2 rounded-lg bg-gray-100 p-2 text-gray-500 hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
                  :title="t('common.copy')"
                >
                  <Copy class="h-4 w-4" />
                </button>
              </div>

              <!-- Social Share Links -->
              <div class="flex gap-2 pt-2">
                <button @click="shareToSocial('whatsapp')" class="flex-1 flex items-center justify-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-100 border border-green-200">
                  <MessageCircle class="h-4 w-4" /> WhatsApp
                </button>
                <button @click="shareToSocial('facebook')" class="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 border border-blue-200">
                  <Facebook class="h-4 w-4" /> Facebook
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Saved Ads History -->
        <div v-if="savedAds.length > 0" class="rounded-xl border bg-white p-5 shadow-sm">
           <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
             <History class="h-5 w-5 text-gray-500" />
             {{ t('admin.productForm.savedAds') }}
           </h3>
           <div class="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
             <div v-for="ad in savedAds" :key="ad.id" class="group relative rounded-lg border p-3 hover:border-indigo-300 transition-colors">
               <div class="flex gap-3">
                 <img :src="ad.image_url" class="h-16 w-16 rounded-md object-cover bg-gray-100" />
                 <div class="flex-1 min-w-0">
                   <div class="flex items-center justify-between mb-1">
                     <span class="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 capitalize">
                       {{ ad.platform }}
                     </span>
                     <span class="text-xs text-gray-400">
                       {{ new Date(ad.created_at).toLocaleDateString() }}
                     </span>
                   </div>
                   <p class="text-xs text-gray-600 line-clamp-2">{{ ad.content_text }}</p>
                 </div>
               </div>
               
               <div class="mt-2 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button @click="deleteSavedAd(ad.id)" class="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Delete">
                   <Trash2 class="h-4 w-4" />
                 </button>
                 <button @click="loadSavedAd(ad)" class="px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg">
                   {{ t('admin.productForm.viewDetail') }}
                 </button>
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>