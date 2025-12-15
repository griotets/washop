<template>
  <main class="px-6 py-10">
    <div class="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
      <div class="rounded-xl bg-white p-6 shadow-sm">
        <h1 class="text-2xl font-bold">Créer un nouveau magasin</h1>
        <form class="mt-6 space-y-6" @submit.prevent="submit">
          <div class="flex items-center gap-4">
            <label class="relative inline-flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-gray-100">
              <input type="file" accept="image/*" class="hidden" @change="onLogoChange" />
              <span v-if="!form.logoUrl" class="material-icons text-gray-500">photo_camera</span>
              <img v-else :src="form.logoUrl" alt="logo" class="h-16 w-16 rounded-full object-cover" />
            </label>
            <div class="text-sm text-gray-500">Logo</div>
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium">Nom du magasin *</label>
            <input v-model.trim="form.name" type="text" class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none" placeholder="Ex. Boulangerie du Coin" />
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="mb-1 block text-sm font-medium">Indicatif *</label>
              <select v-model="form.code" class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none">
                <option value="+237">+237</option>
              </select>
            </div>
            <div class="col-span-2">
              <label class="mb-1 block text-sm font-medium">Téléphone *</label>
              <input v-model.trim="form.phone" inputmode="numeric" pattern="[0-9]*" type="tel" class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none" placeholder="Numéro de téléphone" />
            </div>
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium">Lien de magasin *</label>
            <div class="flex items-center gap-2">
              <div class="rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-700">wa-shop.cm</div>
              <span class="text-gray-400">/</span>
              <input v-model.trim="form.slug" type="text" class="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none" />
            </div>
            <p class="mt-1 text-xs text-gray-500">Généré automatiquement à partir du nom, modifiable.</p>
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium">Couleur</label>
            <div class="flex flex-wrap gap-3">
              <button v-for="c in colors" :key="c" type="button" :class="['h-8 w-8 rounded-full border-2', form.color===c ? 'border-black' : 'border-transparent']" :style="{ backgroundColor: c }" @click="form.color = c"></button>
            </div>
          </div>

          <button :disabled="!isValid" type="submit" class="rounded-lg bg-primary px-5 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">Créer</button>
        </form>
      </div>

      <div class="rounded-xl bg-indigo-50 p-6">
        <div class="mx-auto w-full max-w-sm rounded-2xl bg-white shadow">
          <div class="flex items-center justify-between px-4 py-3">
            <div class="h-4 w-6 rounded bg-gray-200"></div>
            <div class="h-4 w-4 rounded bg-gray-200"></div>
            <div class="h-4 w-4 rounded bg-gray-200"></div>
          </div>
          <div class="h-24 w-full bg-gray-100"></div>
          <div class="-mt-8 flex w-full flex-col items-center px-6">
            <div class="flex h-24 w-24 items-center justify-center rounded-full" :style="{ backgroundColor: form.color }">
              <span class="text-sm font-medium text-white">{{ initials }}</span>
            </div>
            <div class="mt-4 text-xl font-extrabold">{{ displayName }}</div>
            <div class="mt-2 flex w-full items-center gap-6 border-b px-6 pb-3">
              <div class="flex items-center gap-2 text-gray-600"><span class="material-icons text-base">home</span><span>Accueil</span></div>
              <div class="flex items-center gap-2 text-gray-600"><span class="material-icons text-base">search</span><span>Recherche</span></div>
            </div>
            <div class="px-6 py-6">
              <div class="grid gap-4 sm:grid-cols-2">
                <div class="rounded-xl border border-gray-200 p-4">
                  <div class="h-4 w-24 rounded bg-gray-100"></div>
                  <div class="mt-2 h-3 w-32 rounded bg-gray-100"></div>
                </div>
                <div class="rounded-xl border border-gray-200 p-4">
                  <div class="h-4 w-24 rounded bg-gray-100"></div>
                  <div class="mt-2 h-3 w-32 rounded bg-gray-100"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
const colors = ['#111827', '#ef4444', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6']
const form = reactive({ name: '', code: '+237', phone: '', slug: '', color: colors[0], logoUrl: '' })
const displayName = computed(() => form.name || 'Nom de boutique')
const initials = computed(() => (displayName.value.split(/\s+/).map(s => s[0]).join('.')).slice(0, 12))
watch(() => form.name, (n) => {
  if (!form.slug || form.slug === slugify(prevSlugBase.value)) form.slug = slugify(n)
  prevSlugBase.value = n
})
const prevSlugBase = ref('')
function slugify(s) {
  return (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}
const isValid = computed(() => !!form.name && !!form.phone && !!form.slug)
function onLogoChange(e) {
  const f = e.target.files?.[0]
  if (!f) return
  const r = new FileReader()
  r.onload = () => { form.logoUrl = String(r.result || '') }
  r.readAsDataURL(f)
}
async function submit() {
  const store = { name: form.name, phone: `${form.code}${form.phone}`, slug: form.slug, color: form.color, logoUrl: form.logoUrl }
  try { localStorage.setItem(`store:${store.slug}`, JSON.stringify(store)) } catch {}
  navigateTo(`/${store.slug}`)
}
useHead({ title: 'Admin | Créer un magasin' })
</script>
