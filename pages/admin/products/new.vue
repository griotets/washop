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
          <div class="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium">Catégorie</label>
              <select v-model="form.category_id" class="mt-1 w-full rounded-lg border px-3 py-2">
                <option :value="null">—</option>
                <option v-for="c in categories" :key="c.id" :value="Number(c.id)">{{ c.name }}</option>
              </select>
              <div class="mt-2 flex items-center gap-2">
                <input v-model.trim="newCategoryName" placeholder="Nouvelle catégorie" class="flex-1 rounded-lg border px-3 py-2 text-sm" />
                <button class="rounded-lg border bg-white px-3 py-2 text-sm" @click="createCategory">Créer</button>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium">Tags</label>
              <div class="mt-1 flex flex-wrap gap-2">
                <button v-for="t in tags" :key="t.id" class="rounded-full border px-3 py-1 text-xs" :class="selectedTags.has(Number(t.id))?'bg-green-100 border-green-300':'bg-white'" @click="toggleTag(Number(t.id))">{{ t.name }}</button>
              </div>
              <div class="mt-2 flex items-center gap-2">
                <input v-model.trim="newTagName" placeholder="Ajouter une étiquette" class="flex-1 rounded-lg border px-3 py-2 text-sm" />
                <button class="rounded-lg border bg-white px-3 py-2 text-sm" @click="createTag">Créer</button>
              </div>
            </div>
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
          <div class="grid gap-4 sm:grid-cols-3">
            <div>
              <label class="block text-sm font-medium">Unité</label>
              <select v-model="unit" class="mt-1 w-full rounded-lg border px-3 py-2">
                <option value="G">Grammes (G)</option>
                <option value="KG">Kilogrammes (KG)</option>
                <option value="L">Litres (L)</option>
                <option value="ML">Millilitres (ML)</option>
                <option value="PCS">Pièces (PCS)</option>
                <option value="PAX">Personnes (PAX)</option>
                <option value="PERSON">Personne</option>
                <option value="ROOM">Chambre</option>
                <option value="PACK">Pack</option>
                <option value="QTY">Quantité</option>
                <option value="LBS">Livres (LBS)</option>
                <option value="HOUR">Heure</option>
                <option value="BOX">Boîte</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium">Valeur par unité</label>
              <input v-model.number="unitValue" type="number" min="0" step="0.01" class="mt-1 w-full rounded-lg border px-3 py-2" />
            </div>
            <label class="inline-flex items-center gap-2 mt-6 sm:mt-0">
              <input type="checkbox" v-model="requiresShipping" />
              <span class="text-sm">Nécessite une livraison</span>
            </label>
          </div>
          <div class="mt-4">
            <div class="text-sm font-medium">Méthodes de livraison</div>
            <div class="mt-2 flex flex-wrap gap-2">
              <button class="rounded px-3 py-1 text-xs border" :class="deliveryMethods.has('pickup')?'bg-green-100 border-green-300':'bg-white'" @click="toggleDelivery('pickup')">À emporter</button>
              <button class="rounded px-3 py-1 text-xs border" :class="deliveryMethods.has('delivery')?'bg-green-100 border-green-300':'bg-white'" @click="toggleDelivery('delivery')">Livraison</button>
              <button class="rounded px-3 py-1 text-xs border" :class="deliveryMethods.has('dine_in')?'bg-green-100 border-green-300':'bg-white'" @click="toggleDelivery('dine_in')">Sur place</button>
            </div>
          </div>
        </div>

        <div class="rounded-xl border bg-white p-6">
          <div class="flex items-center justify-between">
            <div class="font-semibold">Variantes</div>
            <button class="inline-flex items-center gap-1 rounded border px-2 py-1 text-sm" @click="addVariant">Ajouter</button>
          </div>
          <div class="mt-4 space-y-3">
            <div v-for="(v,i) in variants" :key="i" class="grid gap-3 sm:grid-cols-5 items-center">
              <input v-model.trim="v.name" type="text" placeholder="Nom" class="rounded border px-2 py-1 text-sm" />
              <input v-model.number="v.price" type="number" min="0" step="0.01" placeholder="Prix" class="rounded border px-2 py-1 text-sm" />
              <input v-model.number="v.original_price" type="number" min="0" step="0.01" placeholder="Prix original" class="rounded border px-2 py-1 text-sm" />
              <div class="flex items-center gap-2">
                <img :src="v.image_url||''" class="h-10 w-10 rounded object-cover bg-gray-100" />
                <input type="file" accept="image/*" @change="(e:any)=>uploadVariantImage(e,v)" />
              </div>
              <div class="flex items-center gap-2">
                <button class="rounded border px-2 py-1 text-xs" @click="removeVariant(i)">Supprimer</button>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-xl border bg-white p-6">
          <div class="flex items-center justify-between">
            <div class="font-semibold">Options</div>
            <button class="inline-flex items-center gap-1 rounded border px-2 py-1 text-sm" @click="addOption">Ajouter</button>
          </div>
          <div class="mt-4 space-y-3">
            <div v-for="(o,i) in options" :key="i" class="grid gap-3 sm:grid-cols-5 items-center">
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
                <button class="rounded border px-2 py-1 text-xs" @click="removeOption(i)">Supprimer</button>
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
  <div v-if="toastShow" class="fixed bottom-4 right-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-lg">
    {{ toastMsg }}
  </div>
</template>

<script setup lang="ts">
import type { SupabaseClient } from '@supabase/supabase-js'
import { useAdminStore } from '~/stores/admin'
import { Upload } from 'lucide-vue-next'
definePageMeta({ layout: 'admin', alias: ['/admin/product/new'] })
const nuxt = useNuxtApp()
const supabase = nuxt.$supabase as SupabaseClient
const admin = useAdminStore()
const saving = ref(false)
const toastShow = ref(false)
const toastMsg = ref('')
function notify(msg: string) { toastMsg.value = msg; toastShow.value = true; setTimeout(() => toastShow.value = false, 1500) }
const form = reactive<any>({
  name: '',
  price: 0,
  sku: '',
  description: '',
  images: [] as string[],
  track_inventory: false,
  stock_quantity: 0,
  is_visible: true,
  category_id: null as number | null
})
const categories = ref<any[]>([])
const tags = ref<any[]>([])
const selectedTags = reactive(new Set<number>())
const newTagName = ref('')
const newCategoryName = ref('')
const variants = ref<any[]>([])
const options = ref<any[]>([])
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
  const { data } = await supabase.from('tags').insert({ store_id: storeId, name }).select('id,name').maybeSingle()
  if (data?.id) {
    tags.value.push({ id: data.id, name: data.name })
    selectedTags.add(Number(data.id))
    newTagName.value = ''
  }
}
function createCategory() {
  const name = String(newCategoryName.value || '').trim()
  if (!name) return
  const storeId = admin.selectedShopId
  if (!storeId) return
  supabase.from('categories').insert({ store_id: storeId, name }).select('id').maybeSingle().then(({ data }) => {
    if (data?.id) { form.category_id = Number(data.id); loadFilters() }
    newCategoryName.value = ''
  })
}
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
function toggleDelivery(m: string) { if (deliveryMethods.has(m)) deliveryMethods.delete(m); else deliveryMethods.add(m) }
async function uploadVariantImage(e: any, v: any) {
  const file = e.target.files?.[0]
  if (!file) return
  const storeId = admin.selectedShopId
  if (!storeId) return
  const cfg = useRuntimeConfig()
  const bucket = String((cfg.public as any)?.supabaseStorageBucket || 'product-images')
  const path = `stores/${storeId}/products/new/variant-${Date.now()}-${file.name}`
  const r = await supabase.storage.from(bucket).upload(path, file, { upsert: true })
  if (!r.error) {
    const publicUrl = supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl
    v.image_url = publicUrl
  }
}
function addVariant() { variants.value.push({ name: '', price: 0, original_price: 0, image_url: '' }) }
function removeVariant(i: number) { variants.value.splice(i, 1) }
function addOption() { options.value.push({ name: '', type: 'text', values: '', is_required: false }) }
function removeOption(i: number) { options.value.splice(i, 1) }
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
      is_visible: form.is_visible,
      category_id: form.category_id,
      unit: unit.value,
      unit_value: unitValue,
      requires_shipping: requiresShipping.value,
      delivery_methods: Array.from(deliveryMethods)
    }
    const { data } = await supabase.from('products').insert(payload).select('id').maybeSingle()
    const pid = String(data?.id || '')
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
    notify('Produit créé')
    setTimeout(() => navigateTo(`/admin/products/${pid}`), 600)
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
})
useHead({ title: 'Admin | Ajouter un produit' })
</script>
