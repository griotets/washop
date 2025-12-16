<template>
  <main class="px-6 py-10">
    <div class="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
      <div class="rounded-xl bg-white p-6 shadow-sm">
        <h1 class="text-2xl font-bold">{{ t('create.title') }}</h1>
        <form class="mt-6 space-y-6" @submit.prevent="submit">
          <div class="flex items-center gap-4">
            <label class="relative inline-flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-gray-100">
              <input type="file" accept="image/*" class="hidden" @change="onLogoChange" />
              <span v-if="!form.logoUrl" class="material-icons text-gray-500">photo_camera</span>
              <img v-else :src="form.logoUrl" alt="logo" class="h-16 w-16 rounded-full object-cover" />
            </label>
            <div class="text-sm text-gray-500">{{ t('create.logo') }}</div>
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium">{{ t('create.name') }}</label>
            <input v-model.trim="form.name" type="text" class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none" :placeholder="t('create.placeholderName')" />
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium">{{ t('create.phone') }}</label>
            <PhoneInput v-model="form.phoneFull" :placeholder="t('create.placeholderPhone')" />
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium">{{ t('create.link') }}</label>
            <div class="flex items-center gap-2">
              <div class="rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-700">wa-shop.cm</div>
              <span class="text-gray-400">/</span>
              <input v-model.trim="form.slug" type="text" class="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none" />
            </div>
            <p class="mt-1 text-xs text-gray-500">{{ t('create.slugHint') }}</p>
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium">{{ t('create.color') }}</label>
            <div class="flex flex-wrap gap-3">
              <button v-for="c in colors" :key="c" type="button" :class="['h-8 w-8 rounded-full border-2', form.color===c ? 'border-black' : 'border-transparent']" :style="{ backgroundColor: c }" @click="form.color = c"></button>
            </div>
          </div>

          <button :disabled="!isValid" type="submit" class="rounded-lg bg-primary px-5 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">{{ t('create.create') }}</button>
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
              <div class="flex items-center gap-2 text-gray-600"><span class="material-icons text-base">home</span><span>{{ t('common.home') }}</span></div>
              <div class="flex items-center gap-2 text-gray-600"><span class="material-icons text-base">search</span><span>{{ t('common.search') }}</span></div>
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

<script setup lang="ts">
import { useI18n } from '~/composables/i18n'
import PhoneInput from '~/components/PhoneInput.vue'
import type { SupabaseClient } from '@supabase/supabase-js'
import { useAdminStore } from '~/stores/admin'
const { t } = useI18n()
const colors = ['#111827', '#ef4444', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6']
const form = reactive({ name: '', phoneFull: '', slug: '', color: colors[0], logoUrl: '' })
const displayName = computed(() => form.name || t('create.placeholderName'))
const initials = computed(() => (displayName.value.split(/\s+/).map(s => s[0]).join('.')).slice(0, 12))
watch(() => form.name, (n) => {
  if (!form.slug || form.slug === slugify(prevSlugBase.value)) form.slug = slugify(n)
  prevSlugBase.value = n
})
const prevSlugBase = ref('')
function slugify(s) {
  return (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}
const isValid = computed(() => !!form.name && !!form.phoneFull && !!form.slug)
function onLogoChange(e) {
  const f = e.target.files?.[0]
  if (!f) return
  const r = new FileReader()
  r.onload = () => { form.logoUrl = String(r.result || '') }
  r.readAsDataURL(f)
}
async function submit() {
  const nuxt = useNuxtApp()
  const supabase = nuxt.$supabase as SupabaseClient
  const admin = useAdminStore()
  const { data } = await supabase.auth.getUser()
  const uid = data?.user?.id
  if (!uid) return navigateTo('/auth/login')
  // ensure enterprise exists
  let { data: ent } = await supabase.from('enterprises').select('id').eq('owner_id', uid).maybeSingle()
  if (!ent) {
    const name = String(data?.user?.email || 'My Business').split('@')[0]
    const ins = await supabase.from('enterprises').insert({ owner_id: uid, name }).select('id').maybeSingle()
    ent = ins.data as any
  }
  const enterprise_id = ent?.id
  if (!enterprise_id) return navigateTo('/admin/dashboard')
  const payload = {
    enterprise_id,
    name: form.name,
    phone: `${String(form.phoneFull || '').replace(/\s+/g, '')}`,
    slug: form.slug,
    color: form.color,
    image_url: form.logoUrl
  }
  const { data: created, error } = await supabase.from('stores').insert(payload).select('id').maybeSingle()
  if (error) {
    console.error(error.message)
    return
  }
  if (created?.id) admin.selectShop(String(created.id))
  try { localStorage.setItem(`store:${form.slug}`, JSON.stringify({ name: form.name, logoUrl: form.logoUrl, color: form.color })) } catch {}
  navigateTo('/admin/dashboard')
}
useHead({ title: `Admin | ${t('create.title')}` })
</script>
