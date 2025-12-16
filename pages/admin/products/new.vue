<template>
  <div>
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Ajouter un produit</h1>
      <div class="flex items-center gap-2">
        <NuxtLink to="/admin/products" class="rounded-lg border bg-white px-3 py-2 text-sm">Retour à la liste</NuxtLink>
        <button class="rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white" :disabled="saving || !isValid" @click="save">Sauvegarder</button>
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
import { Upload } from 'lucide-vue-next'
definePageMeta({ layout: 'admin' })
const nuxt = useNuxtApp()
const supabase = nuxt.$supabase as SupabaseClient
const admin = useAdminStore()
const saving = ref(false)
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
async function uploadImage(file: File) {
  const storeId = admin.selectedShopId
  if (!storeId) return
  const cfg = useRuntimeConfig()
  const bucket = String((cfg.public as any)?.supabaseStorageBucket || 'product-images')
  const path = `stores/${storeId}/products/new/${Date.now()}-${file.name}`
  const r = await supabase.storage.from(bucket).upload(path, file, { upsert: true })
  if (!r.error) {
    const publicUrl = supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl
    form.images.push(publicUrl)
  }
}
async function save() {
  if (!isValid.value) return
  const storeId = admin.selectedShopId
  if (!storeId) return navigateTo('/admin/stores/create')
  saving.value = true
  try {
    const payload = {
      store_id: storeId,
      name: form.name,
      price: form.price,
      sku: form.sku,
      description: form.description,
      images: form.images,
      track_inventory: form.track_inventory,
      stock_quantity: form.stock_quantity,
      is_visible: form.is_visible
    }
    const { data } = await supabase.from('products').insert(payload).select('id').maybeSingle()
    const id = data?.id
    if (id) navigateTo(`/admin/products/${id}`)
    else navigateTo('/admin/products')
  } finally { saving.value = false }
}
useHead({ title: 'Admin | Ajouter un produit' })
</script>
