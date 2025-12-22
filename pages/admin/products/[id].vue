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
          <input v-model.trim="form.name" type="text" class="mt-1 w-full rounded-lg border px-3 py-2" />
          <div class="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium">{{ t('admin.productForm.priceLabel') }}</label>
              <input v-model.number="form.price" type="number" min="0" step="0.01" class="mt-1 w-full rounded-lg border px-3 py-2" />
            </div>
            <div>
              <label class="block text-sm font-medium">{{ t('admin.productForm.skuLabel') }}</label>
              <input v-model.trim="form.sku" type="text" class="mt-1 w-full rounded-lg border px-3 py-2" />
            </div>
          </div>
          <div class="mt-4">
            <label class="block text-sm font-medium">{{ t('admin.productForm.descriptionLabel') }}</label>
            <textarea v-model.trim="form.description" rows="4" class="mt-1 w-full rounded-lg border px-3 py-2"></textarea>
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
            <input v-model.trim="imageUrl" :placeholder="t('common.urlPlaceholder')" class="flex-1 rounded-lg border px-3 py-2 text-sm" />
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
              <input v-model.number="form.stock_quantity" type="number" min="0" class="mt-1 w-full rounded-lg border px-3 py-2" />
            </div>
            <label class="inline-flex items-center gap-2">
              <input type="checkbox" v-model="form.is_visible" />
              <span class="text-sm">{{ t('admin.productForm.visibleLabel') }}</span>
            </label>
          </div>
        </div>

        <div class="rounded-xl border bg-white p-6">
          <div class="font-semibold mb-3">{{ t('admin.productForm.categoryTitle') }}</div>
          <select class="rounded border px-2 py-2 text-sm" :value="form.category_id || ''" @change="setCategory(($event.target as HTMLSelectElement).value ? Number(($event.target as HTMLSelectElement).value) : null)">
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
          <div class="flex items-center justify-between">
            <div class="font-semibold">{{ t('admin.productForm.variantsTitle') }}</div>
            <button class="inline-flex items-center gap-1 rounded border px-2 py-1 text-sm" @click="addVariant"><Plus class="h-4 w-4" /><span>{{ t('admin.productForm.add') }}</span></button>
          </div>
          <div class="mt-4 space-y-3">
            <div v-for="(v,i) in variants" :key="v.id||i" class="grid gap-3 sm:grid-cols-5 items-center">
              <input v-model.trim="v.name" type="text" :placeholder="t('admin.productForm.variantNamePlaceholder')" class="rounded border px-2 py-1 text-sm" />
              <input v-model.number="v.price" type="number" min="0" step="0.01" :placeholder="t('admin.productForm.variantPricePlaceholder')" class="rounded border px-2 py-1 text-sm" />
              <input v-model.number="v.original_price" type="number" min="0" step="0.01" :placeholder="t('admin.productForm.variantOriginalPricePlaceholder')" class="rounded border px-2 py-1 text-sm" />
              <div class="flex items-center gap-2">
                <div class="relative">
                  <img :src="v.image_url||''" class="h-10 w-10 rounded object-cover bg-gray-100" />
                  <div v-if="v._imgLoading" class="absolute inset-0 flex items-center justify-center bg-black/50 rounded"><div class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div></div>
                </div>
                <input type="file" accept="image/*" @change="(e:any)=>uploadVariantImage(e,v)" />
              </div>
              <div class="flex items-center gap-2">
                <button class="rounded border px-2 py-1 text-xs" @click="saveVariant(v,i)" :disabled="v._loading">{{ v._loading ? '...' : t('admin.productForm.save') }}</button>
                <button class="rounded border px-2 py-1 text-xs" @click="deleteVariant(v,i)" :disabled="v._loading">{{ t('admin.productForm.delete') }}</button>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-xl border bg-white p-6">
          <div class="flex items-center justify-between">
            <div class="font-semibold">{{ t('admin.productForm.optionsTitle') }}</div>
            <button class="inline-flex items-center gap-1 rounded border px-2 py-1 text-sm" @click="addOption"><Plus class="h-4 w-4" /><span>{{ t('admin.productForm.add') }}</span></button>
          </div>
          <div class="mt-4 space-y-3">
            <div v-for="(o,i) in options" :key="o.id||i" class="grid gap-3 sm:grid-cols-5 items-center">
              <input v-model.trim="o.name" type="text" :placeholder="t('admin.productForm.optionNamePlaceholder')" class="rounded border px-2 py-1 text-sm" />
              <select v-model="o.type" class="rounded border px-2 py-1 text-sm">
                <option value="text">{{ t('admin.productForm.optionType.text') }}</option>
                <option value="number">{{ t('admin.productForm.optionType.number') }}</option>
                <option value="date">{{ t('admin.productForm.optionType.date') }}</option>
                <option value="checkbox">{{ t('admin.productForm.optionType.checkbox') }}</option>
                <option value="select">{{ t('admin.productForm.optionType.select') }}</option>
              </select>
              <input v-model="o.values" type="text" :placeholder="t('admin.productForm.optionValuesPlaceholder')" class="rounded border px-2 py-1 text-sm" />
              <label class="inline-flex items-center gap-2">
                <input type="checkbox" v-model="o.is_required" />
                <span class="text-sm">{{ t('admin.productForm.required') }}</span>
              </label>
              <div class="flex items-center gap-2">
                <button class="rounded border px-2 py-1 text-xs" @click="saveOption(o,i)" :disabled="o._loading">{{ o._loading ? '...' : t('admin.productForm.save') }}</button>
                <button class="rounded border px-2 py-1 text-xs" @click="deleteOption(o,i)" :disabled="o._loading">{{ t('admin.productForm.delete') }}</button>
              </div>
            </div>
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
              <div class="text-sm text-gray-600">FCFA {{ Number(form.price || 0).toLocaleString(getNumberLocale()) }}</div>
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
import { Plus, Trash, Upload } from 'lucide-vue-next'
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
const categories = ref<any[]>([])
const tags = ref<any[]>([])
const productTagIds = ref<Set<number>>(new Set())
const tagLoading = ref<Set<number>>(new Set())
const imageUrl = ref('')
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
const isValid = computed(() => !!form.name && Number(form.price) >= 0)
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
    // Process pending uploads
    const uploadedImages = []
    for (const img of form.images) {
      if (pendingUploads.value.has(img)) {
        const file = pendingUploads.value.get(img)!
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
        const path = `stores/${storeId}/products/${id.value}/${Date.now()}-${sanitizedName}`
        const publicUrl = await uploadFileToStorage(file, path)
        uploadedImages.push(publicUrl)
        // Cleanup
        URL.revokeObjectURL(img)
        pendingUploads.value.delete(img)
      } else {
        uploadedImages.push(img)
      }
    }
    form.images = uploadedImages

    const payload = {
      name: form.name,
      price: form.price,
      sku: form.sku,
      description: form.description,
      images: form.images,
      track_inventory: form.track_inventory,
      stock_quantity: form.stock_quantity,
      is_visible: form.is_visible
    }
    const { error } = await supabase.from('products').update(payload).eq('id', id.value).eq('store_id', storeId)
    if (error) throw error
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
async function saveVariant(v: any, index: number) {
  if (!v.name) return
  v._loading = true
  try {
    if (v._pendingFile) {
        const file = v._pendingFile
        const storeId = admin.selectedShopId
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
        const path = `stores/${storeId}/products/${id.value}/variants/${Date.now()}-${sanitizedName}`
        const publicUrl = await uploadFileToStorage(file, path)
        if (v.image_url && v.image_url.startsWith('blob:')) {
           URL.revokeObjectURL(v.image_url)
        }
        v.image_url = publicUrl
        delete v._pendingFile
    }

    if (!v.id) {
      const { data } = await supabase.from('variants').insert({ product_id: id.value, name: v.name, price: v.price, original_price: v.original_price, image_url: v.image_url }).select('id').maybeSingle()
      v.id = data?.id
    } else {
      await supabase.from('variants').update({ name: v.name, price: v.price, original_price: v.original_price, image_url: v.image_url }).eq('id', v.id)
    }
    variants.value[index] = { ...v }
  } finally { v._loading = false }
}
async function deleteVariant(v: any, index: number) {
  if (v.id) {
    v._loading = true
    try {
      await supabase.from('variants').delete().eq('id', v.id)
    } catch {
      v._loading = false; return
    }
  }
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
async function addOption() { options.value.push({ id: null, name: '', type: 'text', values: [], is_required: false }) }
async function saveOption(o: any, index: number) {
  if (!o.name) return
  const vals = Array.isArray(o.values) ? o.values : String(o.values || '').split(',').map((s: string) => s.trim()).filter(Boolean)
  o._loading = true
  try {
    if (!o.id) {
      const { data } = await supabase.from('options').insert({ product_id: id.value, name: o.name, type: o.type, values: vals, is_required: o.is_required }).select('id').maybeSingle()
      o.id = data?.id
    } else {
      await supabase.from('options').update({ name: o.name, type: o.type, values: vals, is_required: o.is_required }).eq('id', o.id)
    }
    options.value[index] = { ...o, values: vals }
  } finally { o._loading = false }
}
async function deleteOption(o: any, index: number) {
  if (o.id) {
    o._loading = true
    try {
      await supabase.from('options').delete().eq('id', o.id)
    } catch {
      o._loading = false; return
    }
  }
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
