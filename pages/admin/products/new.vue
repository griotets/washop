<template>
  <div>
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">{{ t('admin.productsPage.addProduct') }}</h1>
      <div class="flex items-center gap-2">
        <NuxtLink to="/admin/products" class="rounded-lg border bg-white px-3 py-2 text-sm">{{ t('admin.productForm.backToList') }}</NuxtLink>
        <button class="rounded-lg bg-green-600 px-3 py-2 text-sm font-semibold text-white" :disabled="saving || !isValid" @click="save">{{ t('admin.productForm.save') }}</button>
      </div>
    </div>

    <div class="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div class="space-y-6">
        <div class="rounded-xl border bg-white p-6">
          <label class="block text-sm font-medium">{{ t('admin.productForm.nameLabel') }}</label>
          <input v-model.trim="form.name" type="text" class="mt-1 w-full rounded-lg border px-3 py-2" />
          <div class="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <label class="block text-sm font-medium">{{ t('admin.productForm.typeLabel') }}</label>
              <select v-model="form.type" class="mt-1 w-full rounded-lg border px-3 py-2">
                <option value="physical">{{ t('admin.productForm.type.physical') }}</option>
                <option value="digital">{{ t('admin.productForm.type.digital') }}</option>
                <option value="reservation">{{ t('admin.productForm.type.reservation') }}</option>
                <option value="subscription">{{ t('admin.productForm.type.subscription') }}</option>
                <option value="other">{{ t('admin.productForm.type.other') }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium">{{ t('admin.productForm.priceLabel') }}</label>
              <input v-model.number="form.price" type="number" min="0" step="0.01" class="mt-1 w-full rounded-lg border px-3 py-2" />
            </div>
            <div>
              <label class="block text-sm font-medium">{{ t('admin.productForm.originalPriceLabel') }}</label>
              <input v-model.number="form.original_price" type="number" min="0" step="0.01" class="mt-1 w-full rounded-lg border px-3 py-2" />
            </div>
            <div class="sm:col-span-3 grid gap-4 sm:grid-cols-3 mt-2">
              <label class="inline-flex items-center gap-2">
                <input type="checkbox" v-model="form.show_estimated_price" />
                <span class="text-sm">{{ t('admin.productForm.showEstimatedPrice') }}</span>
              </label>
              <label class="inline-flex items-center gap-2">
                <input type="checkbox" v-model="form.track_cost" />
                <span class="text-sm">{{ t('admin.productForm.trackCost') }}</span>
              </label>
              <label class="inline-flex items-center gap-2">
                <input type="checkbox" v-model="form.show_net_price" />
                <span class="text-sm">{{ t('admin.productForm.showNetPrice') }}</span>
              </label>
            </div>
            <div>
              <label class="block text-sm font-medium">{{ t('admin.productForm.skuLabel') }}</label>
              <input v-model.trim="form.sku" type="text" class="mt-1 w-full rounded-lg border px-3 py-2" />
            </div>
            <div>
              <label class="block text-sm font-medium">{{ t('admin.productForm.weightLabel') }}</label>
              <div class="flex items-center gap-2">
                <input v-model.number="form.weight" type="number" min="0" step="0.01" class="mt-1 w-full rounded-lg border px-3 py-2" />
                <span class="text-sm text-gray-600">{{ t('admin.productForm.weightUnit') }}</span>
              </div>
            </div>
          </div>
          <div class="mt-4">
            <div class="flex items-center justify-between mb-1">
              <label class="block text-sm font-medium">{{ t('admin.productForm.descriptionLabel') }}</label>
              <button @click="generateDescription" :disabled="generatingDesc" class="text-xs flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium disabled:opacity-50">
                <Sparkles class="h-3 w-3" /> {{ generatingDesc ? t('admin.productNew.writing') : t('admin.productNew.generateWithAi') }}
              </button>
            </div>
            <textarea v-model.trim="form.description" rows="4" class="mt-1 w-full rounded-lg border px-3 py-2" placeholder='Decorate with **bold**, ~strike~, _italic_'></textarea>
          </div>
          <div class="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium">{{ t('admin.productForm.categoryTitle') }}</label>
              <div class="relative">
                <input v-model.trim="categorySearch" @focus="categoryOpen=true" @input="categoryOpen=true" @blur="closeCategoryDropdownLater" :placeholder="t('admin.productNew.categorySearchPlaceholder')" class="mt-1 w-full rounded-lg border px-3 py-2" />
                <div v-if="categoryOpen" class="absolute z-20 mt-1 w-full rounded-lg border bg-white shadow">
                  <button class="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100" @click="selectCategory(null)">{{ t('admin.productForm.noneOption') }}</button>
                  <button v-for="c in filteredCategories" :key="c.id" class="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100" @click="selectCategory(c)">{{ c.name }}</button>
                  <div class="border-t px-3 py-2">
                    <div class="text-xs text-gray-600 mb-1">{{ t('admin.productNew.createCategoryFromSearch', { name: categorySearch || '...' }) }}</div>
                    <button class="rounded-lg border bg-white px-3 py-2 text-xs" @click="createCategoryFromSearch">{{ t('admin.productNew.createCategory') }}</button>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium">{{ t('admin.productForm.tagsTitle') }}</label>
              <div class="mt-1 flex flex-wrap gap-2">
                <button v-for="t in tags" :key="t.id" class="rounded-full border px-3 py-1 text-xs" :class="selectedTags.has(Number(t.id))?'bg-green-100 border-green-300':'bg-white'" @click="toggleTag(Number(t.id))">{{ t.name }}</button>
              </div>
              <div class="mt-2 flex items-center gap-2">
                <input v-model.trim="newTagName" :placeholder="t('admin.productNew.addTagPlaceholder')" class="flex-1 rounded-lg border px-3 py-2 text-sm" />
                <button class="rounded-lg border bg-white px-3 py-2 text-sm" @click="createTag" :disabled="tagCreating">{{ tagCreating ? '...' : t('admin.productNew.createTag') }}</button>
              </div>
            </div>
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
            <input v-model.trim="imageUrl" placeholder="https://..." class="flex-1 rounded-lg border px-3 py-2 text-sm" />
            <button class="rounded-lg border bg-white px-3 py-2 text-sm" @click="addImageUrl">{{ t('admin.productForm.addImageUrl') }}</button>
            <button class="rounded-lg border bg-white px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50" @click="generateImage" :disabled="generatingImage">
              <Wand2 class="h-4 w-4 text-purple-600" /> 
              <span>{{ generatingImage ? '...' : t('admin.productNew.generateAi') }}</span>
            </button>
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
          <div class="mt-4 grid gap-4 sm:grid-cols-3">
            <label class="inline-flex items-center gap-2">
              <input type="checkbox" v-model="form.is_out_of_stock" />
              <span class="text-sm">{{ t('admin.productForm.outOfStockLabel') }}</span>
            </label>
            <div>
              <label class="block text-sm font-medium">{{ t('admin.productNew.dailyCapacity') }}</label>
              <input v-model.number="form.daily_capacity" type="number" min="0" class="mt-1 w-full rounded-lg border px-3 py-2" />
            </div>
            <div class="grid gap-2 sm:grid-cols-2">
              <div>
                <label class="block text-sm font-medium">{{ t('admin.productNew.maxQtyPerOrder') }}</label>
                <input v-model.number="form.max_order_qty" type="number" min="0" class="mt-1 w-full rounded-lg border px-3 py-2" />
              </div>
              <div>
                <label class="block text-sm font-medium">{{ t('admin.productNew.minQtyPerOrder') }}</label>
                <input v-model.number="form.min_order_qty" type="number" min="0" class="mt-1 w-full rounded-lg border px-3 py-2" />
              </div>
            </div>
          </div>
          <div class="mt-4 grid gap-4 sm:grid-cols-2">
            <label class="inline-flex items-center gap-2">
              <input type="checkbox" v-model="form.tax_exempt" />
              <span class="text-sm">{{ t('admin.productNew.taxExempt') }}</span>
            </label>
            <div>
              <label class="block text-sm font-medium">{{ t('admin.productNew.taxExemptReason') }}</label>
              <input v-model.trim="form.tax_exempt_reason" type="text" class="mt-1 w-full rounded-lg border px-3 py-2" />
            </div>
          </div>
        </div>

        <div class="rounded-xl border bg-white p-6">
          <div class="grid gap-4 sm:grid-cols-3">
            <div>
              <label class="block text-sm font-medium">{{ t('admin.productNew.unit') }}</label>
              <select v-model="unit" class="mt-1 w-full rounded-lg border px-3 py-2">
                <option value="G">{{ t('admin.productNew.unitOption.g') }}</option>
                <option value="KG">{{ t('admin.productNew.unitOption.kg') }}</option>
                <option value="L">{{ t('admin.productNew.unitOption.l') }}</option>
                <option value="ML">{{ t('admin.productNew.unitOption.ml') }}</option>
                <option value="PCS">{{ t('admin.productNew.unitOption.pcs') }}</option>
                <option value="PAX">{{ t('admin.productNew.unitOption.pax') }}</option>
                <option value="PERSON">{{ t('admin.productNew.unitOption.person') }}</option>
                <option value="ROOM">{{ t('admin.productNew.unitOption.room') }}</option>
                <option value="PACK">{{ t('admin.productNew.unitOption.pack') }}</option>
                <option value="QTY">{{ t('admin.productNew.unitOption.qty') }}</option>
                <option value="LBS">{{ t('admin.productNew.unitOption.lbs') }}</option>
                <option value="HOUR">{{ t('admin.productNew.unitOption.hour') }}</option>
                <option value="BOX">{{ t('admin.productNew.unitOption.box') }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium">{{ t('admin.productNew.unitValue') }}</label>
              <input v-model.number="unitValue" type="number" min="0" step="0.01" class="mt-1 w-full rounded-lg border px-3 py-2" />
            </div>
            <label class="inline-flex items-center gap-2 mt-6 sm:mt-0">
              <input type="checkbox" v-model="requiresShipping" />
              <span class="text-sm">{{ t('admin.productNew.requiresShipping') }}</span>
            </label>
          </div>
          <div class="mt-4">
            <div class="text-sm font-medium">{{ t('admin.productNew.deliveryMethods') }}</div>
            <div class="mt-2 flex flex-wrap gap-2">
              <button class="rounded px-3 py-1 text-xs border" :class="deliveryMethods.has('pickup')?'bg-green-100 border-green-300':'bg-white'" @click="toggleDelivery('pickup')">{{ t('admin.productNew.delivery.pickup') }}</button>
              <button class="rounded px-3 py-1 text-xs border" :class="deliveryMethods.has('delivery')?'bg-green-100 border-green-300':'bg-white'" @click="toggleDelivery('delivery')">{{ t('admin.productNew.delivery.delivery') }}</button>
              <button class="rounded px-3 py-1 text-xs border" :class="deliveryMethods.has('dine_in')?'bg-green-100 border-green-300':'bg-white'" @click="toggleDelivery('dine_in')">{{ t('admin.productNew.delivery.dineIn') }}</button>
            </div>
          </div>
        </div>

        <div class="rounded-xl border bg-white p-6">
          <div class="flex items-center justify-between">
            <div class="font-semibold">{{ t('admin.productForm.variantsTitle') }}</div>
            <div class="flex items-center gap-2">
              <button class="inline-flex items-center gap-1 rounded border px-2 py-1 text-sm" @click="addVariant">{{ t('admin.productForm.add') }}</button>
              <button class="inline-flex items-center gap-1 rounded border px-2 py-1 text-sm" @click="reorderModeVariants=!reorderModeVariants">{{ t('admin.productNew.reorderVariants') }}</button>
            </div>
          </div>
          <div class="mt-4 space-y-3">
            <div v-for="(v,i) in variants" :key="i" class="grid gap-3 sm:grid-cols-5 items-center" draggable="true" @dragstart="onVariantDragStart(i)" @dragover.prevent @drop="onVariantDrop(i)">
              <div class="hidden sm:flex items-center">
                <GripVertical class="h-4 w-4 text-gray-400" />
              </div>
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
                <button v-if="reorderModeVariants" class="rounded border px-2 py-1 text-xs" @click="moveVariantUp(i)" :disabled="i===0">↑</button>
                <button v-if="reorderModeVariants" class="rounded border px-2 py-1 text-xs" @click="moveVariantDown(i)" :disabled="i===variants.length-1">↓</button>
                <button class="rounded border px-2 py-1 text-xs" @click="removeVariant(i)">{{ t('admin.productForm.delete') }}</button>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-xl border bg-white p-6">
          <div class="flex items-center justify-between">
            <div class="font-semibold">{{ t('admin.productForm.optionsTitle') }}</div>
            <div class="flex items-center gap-2">
              <button class="inline-flex items-center gap-1 rounded border px-2 py-1 text-sm" @click="addOption">{{ t('admin.productForm.add') }}</button>
              <button class="inline-flex items-center gap-1 rounded border px-2 py-1 text-sm" @click="reorderModeOptions=!reorderModeOptions">{{ t('admin.productNew.reorderOptions') }}</button>
            </div>
          </div>
          <div class="mt-4 space-y-3">
            <div v-for="(o,i) in options" :key="i" class="grid gap-3 sm:grid-cols-5 items-center" draggable="true" @dragstart="onOptionDragStart(i)" @dragover.prevent @drop="onOptionDrop(i)">
              <div class="hidden sm:flex items-center">
                <GripVertical class="h-4 w-4 text-gray-400" />
              </div>
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
                <button v-if="reorderModeOptions" class="rounded border px-2 py-1 text-xs" @click="moveOptionUp(i)" :disabled="i===0">↑</button>
                <button v-if="reorderModeOptions" class="rounded border px-2 py-1 text-xs" @click="moveOptionDown(i)" :disabled="i===options.length-1">↓</button>
                <button class="rounded border px-2 py-1 text-xs" @click="removeOption(i)">{{ t('admin.productForm.delete') }}</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="rounded-xl border bg-white p-6">
          <div class="font-semibold">{{ t('admin.productNew.previewPhone') }}</div>
          <div class="mt-4 flex justify-center">
            <div class="w-[360px] rounded-3xl border bg-gray-50 p-4">
              <div class="rounded-xl bg-white shadow overflow-hidden">
                <div class="flex items-center gap-3 border-b p-3">
                  <div class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                    <span class="text-xs font-semibold text-gray-700">{{ storeInitials || 'SB' }}</span>
                  </div>
                  <div class="flex-1">
                    <div class="text-sm font-semibold">{{ storeName || t('storefront.storeFallback') }}</div>
                    <div class="text-xs text-gray-500">{{ t('storefront.online') }}</div>
                  </div>
                  <a v-if="waLink" :href="waLink" target="_blank" class="rounded bg-green-500 px-2 py-1 text-xs font-semibold text-white">{{ t('storefront.whatsapp') }}</a>
                </div>
                <img :src="form.images[0] || ''" class="h-40 w-full object-cover bg-gray-100" />
                <div class="p-3">
                  <div class="font-semibold">{{ form.name || t('admin.productNew.previewProductName') }}</div>
                  <div class="mt-1 text-sm text-gray-600" style="white-space: pre-line">{{ form.description || t('admin.productNew.previewProductDesc') }}</div>
                  <div class="mt-2 text-sm font-semibold">FCFA {{ Number(form.price || 0).toLocaleString(getNumberLocale()) }}</div>
                  <div class="mt-3">
                    <a v-if="waLink" :href="waLink" target="_blank" class="block rounded bg-green-500 px-3 py-2 text-sm font-semibold text-white text-center">{{ t('admin.productNew.contactWhatsApp') }}</a>
                    <span v-else class="block rounded border bg-white px-3 py-2 text-sm text-center text-gray-600">{{ t('admin.productNew.phoneUnavailable') }}</span>
                  </div>
                </div>
                <div class="border-t p-3 text-sm text-gray-700">
                  {{ t('admin.productNew.whatsappLabel') }}: {{ storePhone || '—' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="saving" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm">
    <div class="rounded-xl bg-gray-900/90 px-6 py-5 text-center text-white shadow-xl">
      <div class="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-white/30 border-t-white"></div>
      <div class="mt-3 text-sm font-semibold">{{ t('admin.productNew.creating') }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SupabaseClient } from '@supabase/supabase-js'
import { useAdminStore } from '~/stores/admin'
import { Upload, GripVertical, Sparkles, Wand2 } from 'lucide-vue-next'
import { useI18n } from '~/composables/i18n'
definePageMeta({ layout: 'admin', alias: ['/admin/product/new'] })
const nuxt = useNuxtApp()
const supabase = nuxt.$supabase as SupabaseClient
const admin = useAdminStore()
const { t, locale } = useI18n()
const saving = ref(false)
const generatingDesc = ref(false)
const generatingImage = ref(false)
const toast = useToast()

const form = reactive<any>({
  name: '',
  price: 0,
  original_price: 0,
  sku: '',
  description: '',
  images: [] as string[],
  track_inventory: false,
  stock_quantity: 0,
  is_visible: true,
  is_out_of_stock: false,
  daily_capacity: 0,
  max_order_qty: 0,
  min_order_qty: 0,
  tax_exempt: false,
  tax_exempt_reason: '',
  show_estimated_price: false,
  track_cost: false,
  cost_per_item: 0,
  show_net_price: false,
  weight: 0,
  type: 'physical',
  category_id: null as number | null
})
const categories = ref<any[]>([])
const tags = ref<any[]>([])
const selectedTags = reactive(new Set<number>())
const newTagName = ref('')
const newCategoryName = ref('')
const categorySearch = ref('')
const categoryOpen = ref(false)
const storePhone = ref<string>('')
const storeName = ref<string>('')
const storeInitials = computed(() => (storeName.value || 'SB').split(/\s+/).map(s => s[0]).join('.'))
function getNumberLocale() {
  if (locale.value === 'fr') return 'fr-FR'
  if (locale.value === 'it') return 'it-IT'
  return 'en-US'
}
const waLink = computed(() => {
  const phone = String(storePhone.value || '').trim()
  const digits = phone.replace(/[^\d+]/g, '')
  return digits ? `https://wa.me/${digits.replace(/^0+/, '')}` : ''
})
const filteredCategories = computed(() => {
  const term = String(categorySearch.value || '').toLowerCase()
  return Array.isArray(categories.value) ? categories.value.filter((c: any) => String(c.name || '').toLowerCase().includes(term)) : []
})
function selectCategory(c: any) {
  form.category_id = c ? Number(c.id) : null
  categorySearch.value = c ? String(c.name || '') : ''
  categoryOpen.value = false
}
function createCategoryFromSearch() {
  const v = String(categorySearch.value || '').trim()
  if (!v) return
  const exists = filteredCategories.value.find((c: any) => String(c.name || '').toLowerCase() === v.toLowerCase())
  if (exists) { toast.error(t('admin.productNew.categoryExists')); return }
  newCategoryName.value = v
  createCategory()
  categoryOpen.value = false
}
function closeCategoryDropdownLater() { setTimeout(() => categoryOpen.value = false, 150) }
const variants = ref<any[]>([])
const options = ref<any[]>([])
const reorderModeVariants = ref(false)
const reorderModeOptions = ref(false)
let dragVariantIndex: number | null = null
let dragOptionIndex: number | null = null
const unit = ref('PCS')
const unitValue = ref<number | null>(null)
const requiresShipping = ref(true)
const deliveryMethods = reactive(new Set<string>())
function toggleTag(id: number) { if (selectedTags.has(id)) selectedTags.delete(id); else selectedTags.add(id) }
function addNewTagName() {
  const v = String(newTagName.value || '').trim()
  if (!v) return
  tags.value.push({ id: null, name: v, _new: true })
  newTagName.value = ''
}
async function createTag() {
  const name = String(newTagName.value || '').trim()
  if (!name) return
  const storeId = admin.selectedShopId
  if (!storeId) return
  tagCreating.value = true
  try {
    const { data } = await supabase.from('tags').insert({ store_id: storeId, name }).select('id,name').maybeSingle()
    if (data?.id) {
      tags.value.push({ id: data.id, name: data.name })
      selectedTags.add(Number(data.id))
      newTagName.value = ''
    }
  } finally { tagCreating.value = false }
}
function createCategory() {
  const name = String(newCategoryName.value || '').trim()
  if (!name) { toast.error(t('admin.productNew.invalidCategoryName')); return }
  const storeId = admin.selectedShopId
  if (!storeId) { toast.error(t('admin.productNew.selectStore')); return }
  ;(async () => {
    const { data, error } = await supabase.from('categories').insert({ store_id: storeId, name }).select('id').maybeSingle()
    if (error) { toast.error(t('admin.productNew.createCategoryError')); newCategoryName.value = ''; return }
    if (data?.id) {
      form.category_id = Number(data.id)
      toast.success(t('admin.productNew.categoryCreated'))
      await loadFilters()
    }
    newCategoryName.value = ''
  })()
}
const imageUploadLoading = ref(false)
const tagCreating = ref(false)
const imageUrl = ref('')
const imageFileInput = ref<HTMLInputElement | null>(null)
const dropActive = ref(false)
function addImageUrl() {
  const url = String(imageUrl.value || '').trim()
  if (!url) return
  form.images.push(url)
  imageUrl.value = ''
}
function removeImage(i: number) {
  const url = form.images[i]
  if (pendingUploads.value.has(url)) {
    URL.revokeObjectURL(url)
    pendingUploads.value.delete(url)
  }
  form.images.splice(i, 1)
}

async function onImageFile(e: any) {
  const files = e.target.files
  if (!files || files.length === 0) return
  const MAX = 10 * 1024 * 1024
  for (const f of Array.from(files) as File[]) {
    if (f.size > MAX) { toast.error(t('admin.productForm.fileTooLargeWithName', { name: f.name })); continue }
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
    if (f.size > MAX) { toast.error(t('admin.productForm.fileTooLarge')); continue }
    await uploadImage(f)
  }
}
const isValid = computed(() => !!form.name && Number(form.price) >= 0)
const pendingUploads = ref(new Map<string, File>())

async function uploadFileToStorage(file: File, path: string) {
  const cfg = useRuntimeConfig()
  const bucket = String((cfg.public as any)?.supabaseStorageBucket || 'product-images')
  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true })
  if (error) throw error
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl
}

async function uploadImage(file: File) {
  const previewUrl = URL.createObjectURL(file)
  form.images.push(previewUrl)
  pendingUploads.value.set(previewUrl, file)
}
let dragImageIndex: number | null = null
function onImageTileDragStart(i: number) { dragImageIndex = i }
function onImageTileDrop(i: number) {
  if (dragImageIndex === null || dragImageIndex === i) return
  const v = form.images.splice(dragImageIndex,1)[0]
  form.images.splice(i,0,v)
  dragImageIndex = null
}
function toggleDelivery(m: string) { if (deliveryMethods.has(m)) deliveryMethods.delete(m); else deliveryMethods.add(m) }
async function uploadVariantImage(e: any, v: any) {
  const file = e.target.files?.[0]
  if (!file) return
  const MAX = 10 * 1024 * 1024
  if (file.size > MAX) { toast.error(t('admin.productForm.fileTooLarge')); return }
  
  // Optimistic preview
  const previewUrl = URL.createObjectURL(file)
  if (v.image_url && v.image_url.startsWith('blob:')) {
     URL.revokeObjectURL(v.image_url)
  }
  v.image_url = previewUrl
  v._pendingFile = file
}
function addVariant() { variants.value.push({ name: '', price: 0, original_price: 0, image_url: '' }) }
function removeVariant(i: number) {
  const v = variants.value[i]
  if (v.image_url && v.image_url.startsWith('blob:')) {
    URL.revokeObjectURL(v.image_url)
  }
  variants.value.splice(i, 1)
}

function moveVariantUp(i: number) { if (i<=0) return; const v = variants.value.splice(i,1)[0]; variants.value.splice(i-1,0,v) }
function moveVariantDown(i: number) { if (i>=variants.value.length-1) return; const v = variants.value.splice(i,1)[0]; variants.value.splice(i+1,0,v) }
function onVariantDragStart(i: number) { dragVariantIndex = i }
function onVariantDrop(i: number) {
  if (dragVariantIndex === null || dragVariantIndex === i) return
  const v = variants.value.splice(dragVariantIndex,1)[0]
  variants.value.splice(i,0,v)
  dragVariantIndex = null
}
function addOption() { options.value.push({ name: '', type: 'text', values: '', is_required: false }) }
function removeOption(i: number) { options.value.splice(i, 1) }
function moveOptionUp(i: number) { if (i<=0) return; const v = options.value.splice(i,1)[0]; options.value.splice(i-1,0,v) }
function moveOptionDown(i: number) { if (i>=options.value.length-1) return; const v = options.value.splice(i,1)[0]; options.value.splice(i+1,0,v) }
function onOptionDragStart(i: number) { dragOptionIndex = i }
function onOptionDrop(i: number) {
  if (dragOptionIndex === null || dragOptionIndex === i) return
  const v = options.value.splice(dragOptionIndex,1)[0]
  options.value.splice(i,0,v)
  dragOptionIndex = null
}

async function generateDescription() {
  if (!form.name) {
    toast.error(t('admin.productNew.enterNameFirst'))
    return
  }
  generatingDesc.value = true
  try {
    const { description } = await $fetch('/api/ai/generate-description', {
      method: 'POST',
      body: { 
        name: form.name,
        keywords: [form.sku].filter(Boolean).join(', ')
      }
    })
    if (description) {
      form.description = description
      toast.success(t('admin.productNew.descriptionGenerated'))
    }
  } catch (e: any) {
    toast.error(e.statusMessage || t('admin.productNew.generationError'))
  } finally {
    generatingDesc.value = false
  }
}

async function generateImage() {
  if (!form.name) {
    toast.error(t('admin.productNew.enterNameForAi'))
    return
  }
  generatingImage.value = true
  try {
    const { imageUrl } = await $fetch('/api/ai/generate-image', {
      method: 'POST',
      body: { 
        prompt: form.name + (form.description ? ' ' + form.description.substring(0, 50) : '')
      }
    })
    if (imageUrl) {
      const res = await fetch(imageUrl)
      const blob = await res.blob()
      const file = new File([blob], "ai-generated.jpg", { type: "image/jpeg" })
      uploadImage(file)
      toast.success(t('admin.productNew.imageGenerated'))
    }
  } catch (e: any) {
    toast.error(e.statusMessage || t('admin.productNew.generationError'))
  } finally {
    generatingImage.value = false
  }
}

async function save() {
  if (!isValid.value) return
  const storeId = admin.selectedShopId
  if (!storeId) return navigateTo('/admin/stores/create')
  saving.value = true
  try {
    const hashTags = Array.from(new Set((String(form.description||'').match(/#([A-Za-z0-9_-]+)/g)||[]).map((h:string)=>h.slice(1).toLowerCase())))
    const existingNames = new Set((Array.isArray(tags.value)?tags.value:[]).map((t:any)=>String(t.name||'').toLowerCase()))
    const toCreate = hashTags.filter(n => !existingNames.has(n))
    const createdTagIds: number[] = []
    for (const name of toCreate) {
      const { data: r } = await supabase.from('tags').insert({ store_id: storeId, name }).select('id').maybeSingle()
      if (r?.id) { createdTagIds.push(Number(r.id)); tags.value.push({ id: r.id, name }) }
    }
    for (const id of createdTagIds) selectedTags.add(Number(id))

    // Process main images: prepare initial payload
    // Filter out blob URLs from form.images for the initial insert
    const initialImages = form.images.filter((img: string) => !pendingUploads.value.has(img))
    
    const payload = {
      store_id: storeId,
      name: form.name,
      price: form.price,
      original_price: form.original_price,
      type: form.type,
      sku: form.sku,
      description: form.description,
      images: initialImages,
      track_inventory: form.track_inventory,
      stock_quantity: form.stock_quantity,
      is_visible: form.is_visible,
      is_out_of_stock: form.is_out_of_stock,
      daily_capacity: form.daily_capacity,
      max_order_quantity: form.max_order_qty,
      min_order_quantity: form.min_order_qty,
      tax_exempt: form.tax_exempt,
      tax_exempt_reason: form.tax_exempt_reason || null,
      show_estimated_price: form.show_estimated_price,
      track_cost: form.track_cost,
      cost_price: form.cost_per_item || null,
      show_net_price: form.show_net_price,
      // weight: form.weight || null,
      category_id: form.category_id,
      unit: unit.value,
      unit_value: unitValue.value,
      requires_shipping: requiresShipping.value,
      delivery_methods: Array.from(deliveryMethods)
    }
    const { data, error: insertError } = await supabase.from('products').insert(payload).select('id').maybeSingle()
    if (insertError) {
      console.error('Insert Error:', insertError)
      throw new Error(insertError.message)
    }
    if (!data?.id) {
      console.error('No ID returned from insert')
      throw new Error('No ID returned from insert')
    }
    const pid = String(data.id)

    // Now upload pending images using the pid
    const newImagesList = []
    let hasNewUploads = false
    for (const img of form.images) {
      if (pendingUploads.value.has(img)) {
        const file = pendingUploads.value.get(img)!
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
        // Use pid in path
        const path = `stores/${storeId}/products/${pid}/${Date.now()}-${sanitizedName}`
        const publicUrl = await uploadFileToStorage(file, path)
        newImagesList.push(publicUrl)
        URL.revokeObjectURL(img)
        hasNewUploads = true
      } else {
        newImagesList.push(img)
      }
    }

    if (hasNewUploads) {
      await supabase.from('products').update({ images: newImagesList }).eq('id', pid)
      form.images = newImagesList
    }

    // Process variant images using pid
    for (const v of variants.value) {
      if (v._pendingFile) {
        const file = v._pendingFile
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
        const path = `stores/${storeId}/products/${pid}/variants/${Date.now()}-${sanitizedName}`
        const publicUrl = await uploadFileToStorage(file, path)
        if (v.image_url && v.image_url.startsWith('blob:')) {
            URL.revokeObjectURL(v.image_url)
        }
        v.image_url = publicUrl
        delete v._pendingFile
      }
    }

    // Ensure created tags exist and associate them
    const tagIds: number[] = []
    for (const t of tags.value) {
      if (t._new) {
        const { data: r } = await supabase.from('tags').insert({ store_id: storeId, name: t.name }).select('id').maybeSingle()
        if (r?.id) tagIds.push(Number(r.id))
      } else if (t.id) tagIds.push(Number(t.id))
    }
    for (const tid of Array.from(selectedTags)) {
      if (tagIds.includes(tid) && pid) await supabase.from('product_tags').insert({ product_id: Number(pid), tag_id: tid })
    }
    for (const v of variants.value) {
      await supabase.from('variants').insert({
        product_id: Number(pid),
        name: v.name,
        price: Number(v.price || 0),
        original_price: Number(v.original_price || 0),
        image_url: v.image_url || null
      })
    }
    for (const o of options.value) {
      const arr = String(o.values || '').split(',').map((s: string) => s.trim()).filter(Boolean)
      await supabase.from('options').insert({
        product_id: Number(pid),
        name: o.name,
        type: o.type || 'text',
        values: arr.length ? arr : null,
        is_required: !!o.is_required
      })
    }
    const toast = useToast()
    toast.success(t('admin.productNew.created'))
    setTimeout(() => navigateTo(`/admin/products/${pid}`), 600)
  } catch (e: any) {
    console.error('Error saving product:', e)
    const toast = useToast()
    toast.error(e.message || t('admin.productNew.createError'))
  } finally { saving.value = false }
}
async function loadFilters() {
  const storeId = admin.selectedShopId
  if (!storeId) return
  const { data: c } = await supabase.from('categories').select('id,name').eq('store_id', storeId)
  categories.value = Array.isArray(c) ? c : []
  const { data: tg } = await supabase.from('tags').select('id,name').eq('store_id', storeId)
  tags.value = Array.isArray(tg) ? tg : []
}
onMounted(async () => {
  if (!admin.selectedShopId) {
    const { data } = await supabase.auth.getUser()
    const uid = data?.user?.id
    if (!uid) return navigateTo('/auth/login')
    const { data: ent } = await supabase.from('enterprises').select('id').eq('owner_id', uid).maybeSingle()
    const enterprise_id = ent?.id
    if (!enterprise_id) return navigateTo('/admin/stores/create')
    const { data: s } = await supabase.from('stores').select('id').eq('enterprise_id', enterprise_id).limit(1)
    const sid = Array.isArray(s) && s[0]?.id ? String(s[0].id) : ''
    if (sid) admin.selectShop(sid)
  }
  await loadFilters()
  if (admin.selectedShopId) {
    const { data: sone } = await supabase.from('stores').select('name,phone').eq('id', admin.selectedShopId).maybeSingle()
    storePhone.value = String(sone?.phone || '')
    storeName.value = String(sone?.name || '')
  }
})

onUnmounted(() => {
  form.images.forEach((url: string) => {
    if (url && url.startsWith('blob:')) URL.revokeObjectURL(url)
  })
  variants.value.forEach((v: any) => {
    if (v.image_url && v.image_url.startsWith('blob:')) URL.revokeObjectURL(v.image_url)
  })
})
useHead({ title: t('admin.productNew.headTitle') })
</script>
