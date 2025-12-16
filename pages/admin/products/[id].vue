<template>
  <div>
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Modifier le produit</h1>
      <div class="flex items-center gap-2">
        <NuxtLink to="/admin/products" class="rounded-lg border bg-white px-3 py-2 text-sm">Retour à la liste</NuxtLink>
        <button class="rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white" :disabled="saving || !isValid" @click="save">Sauvegarder</button>
        <button class="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white" :disabled="deleting" @click="remove">Supprimer</button>
      </div>
    </div>

    <div class="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div class="space-y-6">
        <div class="rounded-xl border bg-white p-6">
          <label class="block text-sm font-medium">Nom *</label>
          <input v-model.trim="form.name" type="text" class="mt-1 w-full rounded-lg border px-3 py-2" />
          <div class="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium">Prix *</label>
              <input v-model.number="form.price" type="number" min="0" step="0.01" class="mt-1 w-full rounded-lg border px-3 py-2" />
            </div>
            <div>
              <label class="block text-sm font-medium">UGS</label>
              <input v-model.trim="form.sku" type="text" class="mt-1 w-full rounded-lg border px-3 py-2" />
            </div>
          </div>
          <div class="mt-4">
            <label class="block text-sm font-medium">Description</label>
            <textarea v-model.trim="form.description" rows="4" class="mt-1 w-full rounded-lg border px-3 py-2"></textarea>
          </div>
        </div>

        <div class="rounded-xl border bg-white p-6">
          <div class="flex items-center justify-between">
            <div class="font-semibold">Images</div>
            <input type="file" accept="image/*" @change="onImageFile" />
          </div>
          <div class="mt-4 flex items-center gap-3">
            <input v-model.trim="imageUrl" placeholder="https://..." class="flex-1 rounded-lg border px-3 py-2 text-sm" />
            <button class="rounded-lg border bg-white px-3 py-2 text-sm" @click="addImageUrl">Ajouter l'URL</button>
          </div>
          <div class="mt-4 grid gap-3 sm:grid-cols-3">
            <div v-for="(img,i) in form.images" :key="i" class="relative">
              <img :src="img" alt="" class="h-24 w-full rounded object-cover bg-gray-100" />
              <button class="absolute right-2 top-2 rounded bg-white/80 px-2 py-1 text-xs" @click="removeImage(i)">Supprimer</button>
            </div>
          </div>
        </div>

        <div class="rounded-xl border bg-white p-6">
          <div class="grid gap-4 sm:grid-cols-3">
            <label class="inline-flex items-center gap-2">
              <input type="checkbox" v-model="form.track_inventory" />
              <span class="text-sm">Suivre l'inventaire</span>
            </label>
            <div>
              <label class="block text-sm font-medium">Inventaire</label>
              <input v-model.number="form.stock_quantity" type="number" min="0" class="mt-1 w-full rounded-lg border px-3 py-2" />
            </div>
            <label class="inline-flex items-center gap-2">
              <input type="checkbox" v-model="form.is_visible" />
              <span class="text-sm">Visible</span>
            </label>
          </div>
        </div>

        <div class="rounded-xl border bg-white p-6">
          <div class="font-semibold mb-3">Catégorie</div>
          <select class="rounded border px-2 py-2 text-sm" :value="form.category_id || ''" @change="setCategory(($event.target as HTMLSelectElement).value ? Number(($event.target as HTMLSelectElement).value) : null)">
            <option value="">Aucune</option>
            <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>

        <div class="rounded-xl border bg-white p-6">
          <div class="font-semibold mb-3">Tags</div>
          <div class="flex flex-wrap gap-2">
            <button v-for="t in tags" :key="t.id" class="rounded-full border px-3 py-1 text-xs" :class="tagActive(t.id)?'bg-green-100 border-green-300':'bg-white'" @click="toggleTag(t.id)">{{ t.name }}</button>
          </div>
        </div>

        <div class="rounded-xl border bg-white p-6">
          <div class="flex items-center justify-between">
            <div class="font-semibold">Variantes</div>
            <button class="inline-flex items-center gap-1 rounded border px-2 py-1 text-sm" @click="addVariant"><Plus class="h-4 w-4" /><span>Ajouter</span></button>
          </div>
          <div class="mt-4 space-y-3">
            <div v-for="(v,i) in variants" :key="v.id||i" class="grid gap-3 sm:grid-cols-5 items-center">
              <input v-model.trim="v.name" type="text" placeholder="Nom" class="rounded border px-2 py-1 text-sm" />
              <input v-model.number="v.price" type="number" min="0" step="0.01" placeholder="Prix" class="rounded border px-2 py-1 text-sm" />
              <input v-model.number="v.original_price" type="number" min="0" step="0.01" placeholder="Prix original" class="rounded border px-2 py-1 text-sm" />
              <div class="flex items-center gap-2">
                <img :src="v.image_url||''" class="h-10 w-10 rounded object-cover bg-gray-100" />
                <input type="file" accept="image/*" @change="(e:any)=>uploadVariantImage(e,v)" />
              </div>
              <div class="flex items-center gap-2">
                <button class="rounded border px-2 py-1 text-xs" @click="saveVariant(v,i)">Sauvegarder</button>
                <button class="rounded border px-2 py-1 text-xs" @click="deleteVariant(v,i)">Supprimer</button>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-xl border bg-white p-6">
          <div class="flex items-center justify-between">
            <div class="font-semibold">Options</div>
            <button class="inline-flex items-center gap-1 rounded border px-2 py-1 text-sm" @click="addOption"><Plus class="h-4 w-4" /><span>Ajouter</span></button>
          </div>
          <div class="mt-4 space-y-3">
            <div v-for="(o,i) in options" :key="o.id||i" class="grid gap-3 sm:grid-cols-5 items-center">
              <input v-model.trim="o.name" type="text" placeholder="Nom" class="rounded border px-2 py-1 text-sm" />
              <select v-model="o.type" class="rounded border px-2 py-1 text-sm">
                <option value="text">Texte</option>
                <option value="number">Nombre</option>
                <option value="date">Date</option>
                <option value="checkbox">Case</option>
                <option value="select">Choix</option>
              </select>
              <input v-model="o.values" type="text" placeholder="Valeurs (séparées par des virgules)" class="rounded border px-2 py-1 text-sm" />
              <label class="inline-flex items-center gap-2">
                <input type="checkbox" v-model="o.is_required" />
                <span class="text-sm">Obligatoire</span>
              </label>
              <div class="flex items-center gap-2">
                <button class="rounded border px-2 py-1 text-xs" @click="saveOption(o,i)">Sauvegarder</button>
                <button class="rounded border px-2 py-1 text-xs" @click="deleteOption(o,i)">Supprimer</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="rounded-xl border bg-white p-6">
          <div class="font-semibold">Aperçu</div>
          <div class="mt-4 flex items-center gap-3">
            <img :src="form.images[0] || ''" class="h-16 w-16 rounded object-cover bg-gray-100" />
            <div>
              <div class="font-medium">{{ form.name || 'Nom du produit' }}</div>
              <div class="text-sm text-gray-600">FCFA {{ Number(form.price || 0).toLocaleString('fr-FR') }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SupabaseClient } from '@supabase/supabase-js'
import { useAdminStore } from '~/stores/admin'
import { Plus, Trash } from 'lucide-vue-next'
definePageMeta({ layout: 'admin', alias: ['/admin/product/:id'] })
const route = useRoute()
const id = computed(() => String(route.params.id || ''))
const nuxt = useNuxtApp()
const supabase = nuxt.$supabase as SupabaseClient
const admin = useAdminStore()
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
const imageUrl = ref('')
function addImageUrl() {
  const url = String(imageUrl.value || '').trim()
  if (!url) return
  form.images.push(url)
  imageUrl.value = ''
}
function removeImage(i: number) { form.images.splice(i, 1) }
function onImageFile(e: any) {
  const f = e.target.files?.[0]
  if (!f) return
  uploadImage(f)
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
async function save() {
  if (!isValid.value) return
  const storeId = admin.selectedShopId
  if (!storeId) return
  saving.value = true
  try {
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
    await supabase.from('products').update(payload).eq('id', id.value).eq('store_id', storeId)
  } finally { saving.value = false }
}
async function remove() {
  if (!confirm('Supprimer ce produit ?')) return
  const storeId = admin.selectedShopId
  if (!storeId) return
  deleting.value = true
  try {
    await supabase.from('products').delete().eq('id', id.value).eq('store_id', storeId)
    navigateTo('/admin/products')
  } finally { deleting.value = false }
}
useHead({ title: 'Admin | Modifier le produit' })

const imageUploadLoading = ref(false)
async function uploadImage(file: File) {
  const cfg = useRuntimeConfig()
  const bucket = String((cfg.public as any)?.supabaseStorageBucket || 'product-images')
  const storeId = admin.selectedShopId
  const path = `stores/${storeId}/products/${id.value}/${Date.now()}-${file.name}`
  imageUploadLoading.value = true
  const r = await supabase.storage.from(bucket).upload(path, file, { upsert: true })
  imageUploadLoading.value = false
  if (!r.error) {
    const publicUrl = supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl
    form.images.push(publicUrl)
  }
}

async function addVariant() {
  variants.value.push({ id: null, name: '', price: 0, original_price: 0, image_url: '' })
}
async function saveVariant(v: any, index: number) {
  if (!v.name) return
  if (!v.id) {
    const { data } = await supabase.from('variants').insert({ product_id: id.value, name: v.name, price: v.price, original_price: v.original_price, image_url: v.image_url }).select('id').maybeSingle()
    v.id = data?.id
  } else {
    await supabase.from('variants').update({ name: v.name, price: v.price, original_price: v.original_price, image_url: v.image_url }).eq('id', v.id)
  }
  variants.value[index] = { ...v }
}
async function deleteVariant(v: any, index: number) {
  if (v.id) await supabase.from('variants').delete().eq('id', v.id)
  variants.value.splice(index, 1)
}
async function uploadVariantImage(e: any, v: any) {
  const f = e.target.files?.[0]
  if (!f) return
  const cfg = useRuntimeConfig()
  const bucket = String((cfg.public as any)?.supabaseStorageBucket || 'product-images')
  const storeId = admin.selectedShopId
  const path = `stores/${storeId}/products/${id.value}/variants/${Date.now()}-${f.name}`
  const r = await supabase.storage.from(bucket).upload(path, f, { upsert: true })
  if (!r.error) {
    const publicUrl = supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl
    v.image_url = publicUrl
  }
}
async function addOption() { options.value.push({ id: null, name: '', type: 'text', values: [], is_required: false }) }
async function saveOption(o: any, index: number) {
  if (!o.name) return
  const vals = Array.isArray(o.values) ? o.values : String(o.values || '').split(',').map((s: string) => s.trim()).filter(Boolean)
  if (!o.id) {
    const { data } = await supabase.from('options').insert({ product_id: id.value, name: o.name, type: o.type, values: vals, is_required: o.is_required }).select('id').maybeSingle()
    o.id = data?.id
  } else {
    await supabase.from('options').update({ name: o.name, type: o.type, values: vals, is_required: o.is_required }).eq('id', o.id)
  }
  options.value[index] = { ...o, values: vals }
}
async function deleteOption(o: any, index: number) {
  if (o.id) await supabase.from('options').delete().eq('id', o.id)
  options.value.splice(index, 1)
}
async function setCategory(categoryId: number | null) {
  await supabase.from('products').update({ category_id: categoryId }).eq('id', id.value).eq('store_id', admin.selectedShopId)
}
function tagActive(tagId: number) { return productTagIds.value.has(Number(tagId)) }
async function toggleTag(tagId: number) {
  const tid = Number(tagId)
  if (productTagIds.value.has(tid)) {
    await supabase.from('product_tags').delete().eq('product_id', id.value).eq('tag_id', tid)
    productTagIds.value.delete(tid)
  } else {
    await supabase.from('product_tags').insert({ product_id: id.value, tag_id: tid })
    productTagIds.value.add(tid)
  }
}
</script>
