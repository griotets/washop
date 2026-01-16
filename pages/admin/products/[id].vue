<template>
  <div>
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">{{ t('admin.productEdit.title') }}</h1>
      <div class="flex items-center gap-2">
        <NuxtLink to="/admin/products" class="rounded-lg border bg-white px-3 py-2 text-sm">{{ t('admin.productForm.backToList') }}</NuxtLink>
        <button class="rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white" :disabled="saving || !isValid" @click="save">{{ saving ? t('common.saving') : t('admin.productForm.save') }}</button>
        <button class="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white" :disabled="deleting" @click="remove">{{ deleting ? t('admin.productForm.deleting') : t('admin.productForm.delete') }}</button>
      </div>
    </div>

    <div class="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div class="space-y-6">
        <div class="rounded-xl border bg-white p-6">
          <label class="block text-sm font-medium">{{ t('admin.productForm.nameLabel') }}</label>
          <input v-model.trim="form.name" type="text" class="mt-1 w-full rounded-lg border px-3 py-2 focus:border-primary focus:ring-primary" />
          <div class="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium">{{ t('admin.productForm.priceLabel') }}</label>
              <input v-model.number="form.price" type="number" min="0" step="0.01" class="mt-1 w-full rounded-lg border px-3 py-2 focus:border-primary focus:ring-primary" />
              <p v-if="priceError" class="mt-1 text-xs text-red-600">{{ priceError }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium">{{ t('admin.productForm.skuLabel') }}</label>
              <input v-model.trim="form.sku" type="text" class="mt-1 w-full rounded-lg border px-3 py-2 focus:border-primary focus:ring-primary" />
            </div>
          </div>
          <div class="mt-4">
            <label class="block text-sm font-medium">{{ t('admin.productForm.descriptionLabel') }}</label>
            <textarea v-model.trim="form.description" rows="4" class="mt-1 w-full rounded-lg border px-3 py-2 focus:border-primary focus:ring-primary"></textarea>
          </div>
        </div>

        <div class="rounded-xl border bg-white p-6">
          <div class="flex items-center justify-between">
            <div class="font-semibold">{{ t('admin.productForm.imagesTitle') }}</div>
            <input ref="imageFileInput" type="file" accept="image/*" class="hidden" multiple @change="onImageFile" />
          </div>
          <div class="mt-3 relative">
            <div v-if="imageUploadLoading" class="absolute inset-0 flex items-center justify-center bg-white/80 z-10 rounded-lg">
               <div class="h-8 w-8 animate-spin rounded-full border-4 border-gray-900 border-t-transparent"></div>
            </div>
            <div class="flex items-center justify-center rounded-lg border-2 border-dashed px-4 py-10 text-center cursor-pointer" :class="dropActive?'border-green-400 bg-green-50':'border-gray-300 bg-gray-50'" @click="triggerImageInput" @dragenter.prevent="onImageDragEnter" @dragover.prevent="onImageDragOver" @dragleave.prevent="onImageDragLeave" @drop.prevent="onImageDrop">
              <div>
                <Upload class="mx-auto h-8 w-8 text-gray-400" />
                <div class="mt-2 text-sm font-medium text-gray-800">{{ t('admin.productForm.dropzoneTitle') }}</div>
                <div class="mt-1 text-xs text-gray-500">{{ t('admin.productForm.dropzoneHint') }}</div>
              </div>
            </div>
          </div>
          <div class="mt-4 flex items-center gap-3">
            <input v-model.trim="imageUrl" :placeholder="t('common.urlPlaceholder')" class="flex-1 rounded-lg border px-3 py-2 text-sm focus:border-primary focus:ring-primary" />
            <button class="rounded-lg border bg-white px-3 py-2 text-sm" @click="addImageUrl">{{ t('admin.productForm.addImageUrl') }}</button>
          </div>
          <div class="mt-4 grid gap-3 sm:grid-cols-3">
            <div v-for="(img,i) in form.images" :key="i" class="relative" draggable="true" @dragstart="onImageTileDragStart(i)" @dragover.prevent @drop="onImageTileDrop(i)">
              <img :src="img" alt="" class="h-24 w-full rounded object-cover bg-gray-100" />
              <button class="absolute right-2 top-2 rounded bg-white/80 px-2 py-1 text-xs" @click="removeImage(i)">{{ t('admin.productForm.removeImage') }}</button>
            </div>
          </div>
        </div>

        <div class="rounded-xl border bg-white p-6">
          <div class="grid gap-4 sm:grid-cols-3">
            <label class="inline-flex items-center gap-2">
              <input type="checkbox" v-model="form.track_inventory" />
              <span class="text-sm">{{ t('admin.productForm.trackInventory') }}</span>
            </label>
            <div>
              <label class="block text-sm font-medium">{{ t('admin.productForm.inventoryLabel') }}</label>
              <input v-model.number="form.stock_quantity" type="number" min="0" class="mt-1 w-full rounded-lg border px-3 py-2 focus:border-primary focus:ring-primary" />
              <p v-if="stockError" class="mt-1 text-xs text-red-600">{{ stockError }}</p>
            </div>
            <label class="inline-flex items-center gap-2">
              <input type="checkbox" v-model="form.is_visible" />
              <span class="text-sm">{{ t('admin.productForm.visibleLabel') }}</span>
            </label>
          </div>
        </div>

        <div class="rounded-xl border bg-white p-6">
          <div class="font-semibold mb-3">{{ t('admin.productForm.categoryTitle') }}</div>
          <select class="rounded border px-2 py-2 text-sm focus:border-primary focus:ring-primary" :value="form.category_id || ''" @change="setCategory(($event.target as HTMLSelectElement).value ? Number(($event.target as HTMLSelectElement).value) : null)">
            <option value="">{{ t('admin.productForm.noneOption') }}</option>
            <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>

        <div class="rounded-xl border bg-white p-6">
          <div class="font-semibold mb-3">{{ t('admin.productForm.tagsTitle') }}</div>
          <div class="flex flex-wrap gap-2">
            <button v-for="t in tags" :key="t.id" class="rounded-full border px-3 py-1 text-xs" :class="[tagActive(t.id)?'bg-green-100 border-green-300':'bg-white', tagLoading.has(t.id) ? 'opacity-50 cursor-not-allowed' : '']" @click="toggleTag(t.id)" :disabled="tagLoading.has(t.id)">{{ t.name }}</button>
          </div>
        </div>

        <div class="rounded-xl border bg-white p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="font-semibold">{{ t('admin.productForm.variantsTitle') }}</div>
            <button class="inline-flex items-center gap-1 rounded border px-2 py-1 text-sm hover:bg-gray-50" @click="addVariant"><Plus class="h-4 w-4" /><span>{{ t('admin.productForm.add') }}</span></button>
          </div>
          <div class="space-y-4">
            <div v-for="(v,i) in variants" :key="v.id||i" class="rounded-lg border p-4 bg-gray-50/50">
               <div class="flex flex-col sm:flex-row gap-4">
                  <!-- Image -->
                  <div class="relative h-20 w-20 shrink-0 group">
                    <img :src="v.image_url||''" class="h-full w-full rounded-lg object-cover bg-white border" />
                    <div v-if="v._imgLoading" class="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg"><div class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div></div>
                    <label class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-lg">
                      <Upload class="h-5 w-5 text-white" />
                      <input type="file" accept="image/*" class="hidden" @change="(e:any)=>uploadVariantImage(e,v)" />
                    </label>
                  </div>

                  <!-- Fields -->
                  <div class="flex-1 grid gap-4 sm:grid-cols-3">
                     <div>
                        <label class="mb-1 block text-xs font-medium text-gray-500">{{ t('admin.productForm.variantNamePlaceholder') }}</label>
                        <input v-model.trim="v.name" type="text" class="w-full rounded border px-2 py-1.5 text-sm" />
                     </div>
                     <div>
                        <label class="mb-1 block text-xs font-medium text-gray-500">{{ t('admin.productForm.variantPricePlaceholder') }}</label>
                        <input v-model.number="v.price" type="number" min="0" step="0.01" class="w-full rounded border px-2 py-1.5 text-sm" />
                     </div>
                     <div>
                        <label class="mb-1 block text-xs font-medium text-gray-500">{{ t('admin.productForm.variantOriginalPricePlaceholder') }}</label>
                        <input v-model.number="v.original_price" type="number" min="0" step="0.01" class="w-full rounded border px-2 py-1.5 text-sm" />
                     </div>
                  </div>

                  <!-- Actions -->
                  <div class="flex items-start gap-1 sm:pt-6">
                    <button class="text-gray-500 hover:text-blue-600 p-1" @click="cloneVariant(v)" :title="t('admin.productForm.clone')">
                      <Copy class="h-4 w-4" />
                    </button>
                    <button class="text-gray-500 hover:text-red-600 p-1" @click="deleteVariant(v,i)" :title="t('admin.productForm.delete')">
                      <Trash class="h-4 w-4" />
                    </button>
                  </div>
               </div>
            </div>
            <div v-if="variants.length === 0" class="text-center text-sm text-gray-500 py-4">{{ t('admin.productForm.noVariants') }}</div>
          </div>
        </div>

        <div class="rounded-xl border bg-white p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="font-semibold">{{ t('admin.productForm.optionsTitle') }}</div>
            <button class="inline-flex items-center gap-1 rounded border px-2 py-1 text-sm hover:bg-gray-50" @click="addOption"><Plus class="h-4 w-4" /><span>{{ t('admin.productForm.add') }}</span></button>
          </div>
          <div class="space-y-4">
            <div v-for="(o,i) in options" :key="o.id||i" class="rounded-lg border p-4 bg-gray-50/50">
              <div class="grid gap-4 sm:grid-cols-3 mb-3">
                 <div>
                    <label class="mb-1 block text-xs font-medium text-gray-500">{{ t('admin.productForm.optionNamePlaceholder') }}</label>
                    <input v-model.trim="o.name" type="text" class="w-full rounded border px-2 py-1.5 text-sm" />
                 </div>
                 <div>
                    <label class="mb-1 block text-xs font-medium text-gray-500">{{ t('admin.productForm.optionTypeLabel') }}</label>
                    <select v-model="o.type" class="w-full rounded border px-2 py-1.5 text-sm">
                      <option value="text">{{ t('admin.productForm.optionType.text') }}</option>
                      <option value="number">{{ t('admin.productForm.optionType.number') }}</option>
                      <option value="date">{{ t('admin.productForm.optionType.date') }}</option>
                      <option value="checkbox">{{ t('admin.productForm.optionType.checkbox') }}</option>
                      <option value="select">{{ t('admin.productForm.optionType.select') }}</option>
                      <option value="multiselect">{{ t('admin.productForm.optionType.multiselect') }}</option>
                      <option value="color">{{ t('admin.productForm.optionType.color') }}</option>
                    </select>
                 </div>
                 <div class="flex items-center gap-2 sm:pt-6">
                    <input v-model="o.is_required" type="checkbox" class="h-4 w-4 rounded border-gray-300" :id="'req-'+i" />
                    <label :for="'req-'+i" class="text-sm cursor-pointer select-none">{{ t('admin.productForm.required') }}</label>
                    
                    <div class="ml-auto flex items-center gap-1">
                      <button class="text-gray-500 hover:text-blue-600 p-1" @click="cloneOption(o)" :title="t('admin.productForm.clone')">
                        <Copy class="h-4 w-4" />
                      </button>
                      <button class="text-gray-500 hover:text-red-600 p-1" @click="deleteOption(o,i)" :title="t('admin.productForm.delete')">
                        <Trash class="h-4 w-4" />
                      </button>
                    </div>
                 </div>
              </div>

              <!-- Values for Select/Color/Radio/Checkbox/Multi-select -->
              <div v-if="['select','color','radio','checkbox','multiselect'].includes(o.type)" class="mt-2 border-t pt-2">
                 <label class="mb-2 block text-xs font-medium text-gray-500">{{ t('admin.productForm.optionValuesPlaceholder') }}</label>
                 <div class="flex flex-wrap gap-2 mb-2">
                    <div v-for="(val, vIdx) in (Array.isArray(o.values) ? o.values : [])" :key="vIdx" class="inline-flex items-center gap-1 rounded bg-white border px-2 py-1 text-sm">
                       <div v-if="o.type==='color'" class="w-3 h-3 rounded-full border" :style="{backgroundColor: val}"></div>
                       <span>{{ val }}</span>
                       <button @click="removeOptionValue(o, Number(vIdx))" class="text-gray-400 hover:text-red-500"><X class="h-3 w-3" /></button>
                    </div>
                 </div>
                 <div class="flex gap-2">
                    <input 
                      type="text" 
                      :placeholder="t('admin.productForm.addValuePlaceholder')" 
                      class="flex-1 rounded border px-2 py-1.5 text-sm focus:border-primary focus:ring-primary"
                      @keydown.enter.prevent="addOptionValue(o, $event)"
                    />
                    <div class="text-xs text-gray-400 self-center hidden sm:block">{{ t('admin.productForm.addValueHint') }}</div>
                 </div>
              </div>
            </div>
            <div v-if="options.length === 0" class="text-center text-sm text-gray-500 py-4">{{ t('admin.productForm.noOptions') }}</div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="rounded-xl border bg-white p-6">
          <div class="font-semibold">{{ t('admin.productForm.previewTitle') }}</div>
          <div class="mt-4 flex items-center gap-3">
            <img :src="form.images[0] || ''" class="h-16 w-16 rounded object-cover bg-gray-100" />
            <div>
              <div class="font-medium">{{ form.name || t('admin.productForm.previewNameFallback') }}</div>
              <div class="text-sm text-gray-600">XAF {{ Number(form.price || 0).toLocaleString(getNumberLocale()) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="saving || deleting" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm">
    <div class="rounded-xl bg-gray-900/90 px-6 py-5 text-center text-white shadow-xl">
      <div class="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-white/30 border-t-white"></div>
      <div class="mt-3 text-sm font-semibold">{{ deleting ? t('admin.productForm.deleting') : t('admin.productForm.saving') }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SupabaseClient } from '@supabase/supabase-js'
import { useAdminStore } from '~/stores/admin'
import { useI18n } from '~/composables/i18n'
import { Plus, Trash, Upload, X, Copy } from 'lucide-vue-next'
definePageMeta({ layout: 'admin', alias: ['/admin/product/:id'] })
const route = useRoute()
const id = computed(() => String(route.params.id || ''))
const nuxt = useNuxtApp()
const supabase = nuxt.$supabase as SupabaseClient
const admin = useAdminStore()
const { t, locale } = useI18n()
const saving = ref(false)
const deleting = ref(false)
const form = reactive<any>({
  name: '',
  price: 0,
  sku: '',
  description: '',
  images: [] as string[],
  track_inventory: false,
  stock_quantity: 0,
  is_visible: true
})
const variants = ref<any[]>([])
const options = ref<any[]>([])
const variantsToDelete = ref<number[]>([])
const optionsToDelete = ref<number[]>([])
const categories = ref<any[]>([])
const tags = ref<any[]>([])
const productTagIds = ref<Set<number>>(new Set())
const tagLoading = ref<Set<number>>(new Set())
const imageUrl = ref('')
const imageUploadLoading = ref(false)
const imageFileInput = ref<HTMLInputElement | null>(null)
const dropActive = ref(false)
const pendingUploads = ref(new Map<string, File>())

async function uploadFileToStorage(file: File, path: string) {
  const cfg = useRuntimeConfig()
  const bucket = String((cfg.public as any)?.supabaseStorageBucket || 'product-images')
  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true })
  if (error) throw error
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl
}

function getNumberLocale() {
  if (locale.value === 'fr') return 'fr-FR'
  if (locale.value === 'it') return 'it-IT'
  return 'en-US'
}

function addImageUrl() {
  const url = String(imageUrl.value || '').trim()
  if (!url) return
  form.images.push(url)
  imageUrl.value = ''
}
function removeImage(i: string | number) {
  const idx = typeof i === 'string' ? Number(i) : i
  if (!Number.isFinite(idx)) return
  const url = form.images[idx]
  if (pendingUploads.value.has(url)) {
    URL.revokeObjectURL(url)
    pendingUploads.value.delete(url)
  }
  form.images.splice(idx, 1)
}

async function onImageFile(e: any) {
  const files = e.target.files
  if (!files || files.length === 0) return
  const MAX = 10 * 1024 * 1024
  for (const f of Array.from(files) as File[]) {
    if (f.size > MAX) {
      const toast = useToast()
      toast.error(t('admin.productForm.fileTooLargeWithName', { name: f.name }))
      continue
    }
    await uploadImage(f)
  }
}
function triggerImageInput() { imageFileInput.value?.click() }
function onImageDragEnter() { dropActive.value = true }
function onImageDragOver() { dropActive.value = true }
function onImageDragLeave() { dropActive.value = false }
async function onImageDrop(e: DragEvent) {
  dropActive.value = false
  const files: File[] = []
  const dt = e.dataTransfer
  if (dt?.items && dt.items.length) {
    for (const item of Array.from(dt.items)) {
      if (item.kind === 'file') {
        const f = item.getAsFile()
        if (f) files.push(f)
      }
    }
  } else if (dt?.files && dt.files.length) {
    files.push(...Array.from(dt.files))
  }
  const MAX = 10 * 1024 * 1024
  for (const f of files) {
    if (f.size > MAX) { alert(t('admin.productForm.fileTooLarge')); continue }
    await uploadImage(f)
  }
}
const priceError = computed(() => {
  const price = Number(form.price)
  if (!Number.isFinite(price) || price <= 0) return t('admin.productForm.error.priceRequired')
  return ''
})
const stockError = computed(() => {
  if (!form.track_inventory) return ''
  const stock = Number(form.stock_quantity)
  if (!Number.isFinite(stock) || stock < 0) return t('admin.productForm.error.stockNegative')
  return ''
})
const isValid = computed(() => {
  const nameOk = !!(form.name && String(form.name).trim())
  return nameOk && !priceError.value && !stockError.value
})
onMounted(async () => {
  const storeId = admin.selectedShopId
  if (!storeId) return navigateTo('/admin/stores/create')
  const { data } = await supabase.from('products').select('*').eq('id', id.value).eq('store_id', storeId).maybeSingle()
  if (!data) return navigateTo('/admin/products')
  Object.assign(form, {
    name: data.name,
    price: data.price,
    sku: data.sku,
    description: data.description,
    images: Array.isArray(data.images) ? data.images : (typeof data.images === 'string' ? JSON.parse(data.images || '[]') : []),
    track_inventory: !!data.track_inventory,
    stock_quantity: Number(data.stock_quantity || 0),
    is_visible: !!data.is_visible
  })
  const { data: v } = await supabase.from('variants').select('id,name,price,original_price,image_url').eq('product_id', id.value)
  variants.value = Array.isArray(v) ? v : []
  const { data: o } = await supabase.from('options').select('id,name,type,values,is_required').eq('product_id', id.value)
  options.value = Array.isArray(o) ? o : []
  const { data: c } = await supabase.from('categories').select('id,name').eq('store_id', storeId)
  categories.value = Array.isArray(c) ? c : []
  const { data: tg } = await supabase.from('tags').select('id,name').eq('store_id', storeId)
  tags.value = Array.isArray(tg) ? tg : []
  const { data: pt } = await supabase.from('product_tags').select('tag_id').eq('product_id', id.value)
  productTagIds.value = new Set(Array.isArray(pt) ? pt.map((x: any) => Number(x.tag_id)) : [])
})

onUnmounted(() => {
  form.images.forEach((url: string) => {
    if (url && url.startsWith('blob:')) URL.revokeObjectURL(url)
  })
  variants.value.forEach((v: any) => {
    if (v.image_url && v.image_url.startsWith('blob:')) URL.revokeObjectURL(v.image_url)
  })
})
async function save() {
  if (!isValid.value) return
  const storeId = admin.selectedShopId
  if (!storeId) return
  saving.value = true
  try {
    // Process pending uploads for main product images
    const uploadedImages = []
    for (const img of form.images) {
      if (pendingUploads.value.has(img)) {
        const file = pendingUploads.value.get(img)!
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
        const path = `stores/${storeId}/products/${id.value}/${Date.now()}-${sanitizedName}`
        const publicUrl = await uploadFileToStorage(file, path)
        uploadedImages.push(publicUrl)
        URL.revokeObjectURL(img)
        pendingUploads.value.delete(img)
      } else {
        uploadedImages.push(img)
      }
    }
    form.images = uploadedImages

    // 1. Update Product
    const price = Number(form.price || 0)
    const stock = Number(form.stock_quantity || 0)
    const payload = {
      name: form.name,
      price: Number.isFinite(price) && price > 0 ? price : 0,
      sku: form.sku,
      description: form.description,
      images: form.images,
      track_inventory: form.track_inventory,
      stock_quantity: form.track_inventory && Number.isFinite(stock) && stock >= 0 ? stock : 0,
      is_visible: form.is_visible
    }
    const { error } = await supabase.from('products').update(payload).eq('id', id.value).eq('store_id', storeId)
    if (error) throw error

    // 2. Handle Deletions
    if (variantsToDelete.value.length) await supabase.from('variants').delete().in('id', variantsToDelete.value)
    if (optionsToDelete.value.length) await supabase.from('options').delete().in('id', optionsToDelete.value)
    variantsToDelete.value = []
    optionsToDelete.value = []

    // 3. Upsert Variants
    for (const v of variants.value) {
       const name = String(v.name || '').trim()
       if (!name) continue
       if (v._pendingFile) {
          const file = v._pendingFile
          const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
          const path = `stores/${storeId}/products/${id.value}/variants/${Date.now()}-${sanitizedName}`
          const publicUrl = await uploadFileToStorage(file, path)
          if (v.image_url && v.image_url.startsWith('blob:')) {
             URL.revokeObjectURL(v.image_url)
          }
          v.image_url = publicUrl
          delete v._pendingFile
       }
       const vPrice = Number(v.price || 0)
       const vOriginal = Number(v.original_price || 0)
       const vPayload = {
         product_id: id.value,
         name,
         price: Number.isFinite(vPrice) && vPrice >= 0 ? vPrice : 0,
         original_price: Number.isFinite(vOriginal) && vOriginal >= 0 ? vOriginal : 0,
         image_url: v.image_url
       }
       if (v.id) {
         await supabase.from('variants').update(vPayload).eq('id', v.id)
       } else {
         const { data } = await supabase.from('variants').insert(vPayload).select('id').maybeSingle()
         if (data) v.id = data.id
       }
    }

    // 4. Upsert Options
    for (const o of options.value) {
       const name = String(o.name || '').trim()
       const vals = Array.isArray(o.values) ? o.values : String(o.values || '').split(',').map((s: string) => s.trim()).filter(Boolean)
       if (!name && vals.length === 0) continue
       const oPayload = {
         product_id: id.value,
         name,
         type: o.type,
         values: vals,
         is_required: o.is_required
       }
       if (o.id) {
         await supabase.from('options').update(oPayload).eq('id', o.id)
       } else {
         const { data } = await supabase.from('options').insert(oPayload).select('id').maybeSingle()
         if (data) o.id = data.id
       }
    }

    const toast = useToast()
    toast.success(t('admin.productEdit.updated'))
  } catch (e: any) {
    const toast = useToast()
    toast.error(t('admin.productForm.errorWithMsg', { msg: e.message }))
  } finally { saving.value = false }
}
async function remove() {
  if (!confirm(t('admin.productEdit.deleteConfirm'))) return
  const storeId = admin.selectedShopId
  if (!storeId) return
  deleting.value = true
  try {
    const { error } = await supabase.from('products').delete().eq('id', id.value).eq('store_id', storeId)
    if (error) throw error
    const toast = useToast()
    toast.success(t('admin.productEdit.deleted'))
    navigateTo('/admin/products')
  } catch (e: any) {
    const toast = useToast()
    toast.error(t('admin.productForm.errorWithMsg', { msg: e.message }))
  } finally { deleting.value = false }
}
useHead({ title: t('admin.productEdit.headTitle') })


async function uploadImage(file: File) {
  const previewUrl = URL.createObjectURL(file)
  form.images.push(previewUrl)
  pendingUploads.value.set(previewUrl, file)
}
let dragImageIndex: number | null = null
function onImageTileDragStart(i: string | number) {
  const idx = typeof i === 'string' ? Number(i) : i
  if (!Number.isFinite(idx)) return
  dragImageIndex = idx
}
function onImageTileDrop(i: string | number) {
  const idx = typeof i === 'string' ? Number(i) : i
  if (!Number.isFinite(idx)) return
  if (dragImageIndex === null || dragImageIndex === idx) return
  const v = form.images.splice(dragImageIndex,1)[0]
  form.images.splice(idx,0,v)
  dragImageIndex = null
}

async function addVariant() {
  variants.value.push({ id: null, name: '', price: 0, original_price: 0, image_url: '' })
}
function cloneVariant(v: any) {
  variants.value.push({
    id: null,
    name: v.name + ' (Copy)',
    price: v.price,
    original_price: v.original_price,
    image_url: v.image_url,
    _imgLoading: false
  })
}

function deleteVariant(v: any, index: number) {
  if (v.id) variantsToDelete.value.push(v.id)
  if (v.image_url && v.image_url.startsWith('blob:')) {
    URL.revokeObjectURL(v.image_url)
  }
  variants.value.splice(index, 1)
}
async function uploadVariantImage(e: any, v: any) {
  const f = e.target.files?.[0]
  if (!f) return
  const MAX = 10 * 1024 * 1024
  if (f.size > MAX) {
      const toast = useToast()
      toast.error(t('admin.productForm.fileTooLarge'))
      return
  }

  // Optimistic preview
  const previewUrl = URL.createObjectURL(f)
  if (v.image_url && v.image_url.startsWith('blob:')) {
     URL.revokeObjectURL(v.image_url)
  }
  v.image_url = previewUrl
  v._pendingFile = f
}
function addOptionValue(o: any, e: any) {
  const val = e.target.value.trim()
  if (!val) return
  if (Array.isArray(o.values) && o.values.length >= 10) {
    const toast = useToast()
    toast.error(t('admin.productForm.optionValuesMax10'))
    return
  }
  if (!Array.isArray(o.values)) o.values = []
  if (!o.values.includes(val)) o.values.push(val)
  e.target.value = ''
}
function removeOptionValue(o: any, index: number | string) {
  const idx = typeof index === 'string' ? Number(index) : index
  if (!Number.isFinite(idx)) return
  if (Array.isArray(o.values)) o.values.splice(idx, 1)
}
async function addOption() { options.value.push({ id: null, name: '', type: 'text', values: [], is_required: false }) }
function cloneOption(o: any) {
  options.value.push({
    id: null,
    name: o.name + ' (Copy)',
    type: o.type,
    values: Array.isArray(o.values) ? [...o.values] : [],
    is_required: o.is_required
  })
}
function deleteOption(o: any, index: number) {
  if (o.id) optionsToDelete.value.push(o.id)
  options.value.splice(index, 1)
}
async function setCategory(categoryId: number | null) {
  await supabase.from('products').update({ category_id: categoryId }).eq('id', id.value).eq('store_id', admin.selectedShopId)
}
function tagActive(tagId: number) { return productTagIds.value.has(Number(tagId)) }
async function toggleTag(tagId: number) {
  const tid = Number(tagId)
  if (tagLoading.value.has(tid)) return
  tagLoading.value.add(tid)
  try {
    if (productTagIds.value.has(tid)) {
      await supabase.from('product_tags').delete().eq('product_id', id.value).eq('tag_id', tid)
      productTagIds.value.delete(tid)
    } else {
      await supabase.from('product_tags').insert({ product_id: id.value, tag_id: tid })
      productTagIds.value.add(tid)
    }
  } finally { tagLoading.value.delete(tid) }
}
</script>
