<template>
  <div>
    <div class="flex items-center gap-2">
      <NuxtLink to="/admin/clients" class="rounded-lg border bg-white px-3 py-2 text-sm">{{ t('admin.clientForm.back') }}</NuxtLink>
      <h1 class="text-2xl font-bold">{{ t('admin.clientForm.title') }}</h1>
      <div class="ml-auto flex items-center gap-2">
        <button class="rounded-lg border bg-white px-3 py-2 text-sm" :disabled="saving" @click="deleteClient">{{ t('admin.clientForm.delete') }}</button>
        <button class="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white" :disabled="saving || !isValid" @click="save">{{ saving ? t('common.saving') : t('admin.clientForm.update') }}</button>
      </div>
    </div>

    <div class="mt-6 rounded-2xl border bg-white p-6" v-if="loaded">
      <div class="grid gap-4">
        <div>
          <label class="block text-sm font-medium">{{ t('admin.clientForm.nameLabel') }}</label>
          <input v-model.trim="form.name" class="mt-1 w-full rounded-lg border px-3 py-2" />
        </div>
        <div class="grid gap-3 sm:grid-cols-[120px_1fr]">
          <div>
            <label class="block text-sm font-medium">{{ t('admin.clientForm.phoneCodeLabel') }}</label>
            <select v-model="phonePrefix" class="mt-1 w-full rounded-lg border px-3 py-2">
              <option value="+237">+237</option>
              <option value="+33">+33</option>
              <option value="+1">+1</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium">{{ t('admin.clientForm.phoneLabel') }}</label>
            <input v-model.trim="form.phone" class="mt-1 w-full rounded-lg border px-3 py-2" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium">{{ t('admin.clientForm.emailLabel') }}</label>
          <input v-model.trim="form.email" class="mt-1 w-full rounded-lg border px-3 py-2" />
        </div>
        <div>
          <label class="block text-sm font-medium">{{ t('admin.clientForm.birthdayLabel') }}</label>
          <input v-model="birthdayStr" type="date" class="mt-1 w-full rounded-lg border px-3 py-2" />
        </div>
        <div>
          <label class="block text-sm font-medium">{{ t('admin.clientForm.addressLabel') }}</label>
          <textarea v-model.trim="form.address" rows="2" class="mt-1 w-full rounded-lg border px-3 py-2"></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium">{{ t('admin.clientForm.tagsLabel') }}</label>
          <div class="mt-1 flex flex-wrap gap-2">
            <button v-for="t in tags" :key="t.id" class="rounded-full border px-3 py-1 text-xs" :class="selectedTags.has(Number(t.id))?'bg-green-100 border-green-300':'bg-white'" @click="toggleTag(Number(t.id))">{{ t.name }}</button>
          </div>
          <input v-model.trim="newTagName" :placeholder="t('admin.clientForm.addTagPlaceholder')" class="mt-2 w-full rounded-lg border px-3 py-2 text-sm" @keydown.enter.prevent="addNewTagName" />
        </div>
        <div>
          <label class="block text-sm font-medium">{{ t('admin.clientForm.notesLabel') }}</label>
          <textarea v-model.trim="form.notes" rows="3" class="mt-1 w-full rounded-lg border px-3 py-2"></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium">{{ t('admin.clientForm.referralCodeLabel') }}</label>
          <input v-model.trim="form.referral_code" class="mt-1 w-full rounded-lg border px-3 py-2" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SupabaseClient } from '@supabase/supabase-js'
import { useAdminStore } from '~/stores/admin'
import { useI18n } from '~/composables/i18n'
definePageMeta({ layout: 'admin' })
const route = useRoute()
const id = computed(() => String(route.params.id || ''))
const nuxt = useNuxtApp()
const supabase = nuxt.$supabase as SupabaseClient
const admin = useAdminStore()
const { t } = useI18n()
const saving = ref(false)
const loaded = ref(false)
const phonePrefix = ref('+237')
const form = reactive<any>({ name: '', phone: '', email: '', birthday: null as Date | null, address: '', notes: '', referral_code: '' })
const birthdayStr = computed({
  get() { return form.birthday ? new Date(form.birthday).toISOString().slice(0,10) : '' },
  set(v: string) { form.birthday = v ? new Date(v) : null }
})
const tags = ref<any[]>([])
const selectedTags = reactive(new Set<number>())
const newTagName = ref('')
const isValid = computed(() => !!form.name && !!form.phone)
function toggleTag(tid: number) { if (selectedTags.has(tid)) selectedTags.delete(tid); else selectedTags.add(tid) }
function addNewTagName() {
  const v = String(newTagName.value || '').trim()
  if (!v) return
  tags.value.push({ id: null, name: v, _new: true })
  newTagName.value = ''
}
async function loadTags() {
  const storeId = admin.selectedShopId
  if (!storeId) return
  const { data } = await supabase.from('tags').select('id,name').eq('store_id', storeId)
  tags.value = Array.isArray(data) ? data : []
}
async function loadClient() {
  const { data } = await supabase.from('clients').select('*').eq('id', id.value).maybeSingle()
  if (!data) return
  form.name = data.name || ''
  const phone = String(data.phone || '')
  const prefMatch = phone.match(/^\+\d{1,3}/)?.[0] || '+237'
  phonePrefix.value = prefMatch
  form.phone = phone.replace(prefMatch, '')
  form.email = data.email || ''
  form.address = data.address || ''
  form.notes = data.notes || ''
  form.referral_code = data.referral_code || ''
  form.birthday = data.birthday ? new Date(data.birthday) : null
  const { data: ct } = await supabase.from('client_tags').select('tag_id').eq('client_id', id.value)
  selectedTags.clear()
  for (const row of Array.isArray(ct) ? ct : []) selectedTags.add(Number(row.tag_id))
  loaded.value = true
}
async function ensureTags(): Promise<number[]> {
  const storeId = admin.selectedShopId
  const ids: number[] = []
  for (const t of tags.value) {
    if (t._new) {
      const { data } = await supabase.from('tags').insert({ store_id: storeId, name: t.name }).select('id').maybeSingle()
      if (data?.id) ids.push(Number(data.id))
    } else if (t.id) { ids.push(Number(t.id)) }
  }
  return ids
}
async function save() {
  if (!isValid.value) return
  const storeId = admin.selectedShopId
  if (!storeId) return navigateTo('/admin/stores/create')
  saving.value = true
  try {
    const payload = {
      name: form.name,
      phone: `${phonePrefix.value}${form.phone}`,
      email: form.email || null,
      birthday: form.birthday ? new Date(form.birthday as Date).toISOString().slice(0,10) : null,
      address: form.address || null,
      notes: form.notes || null,
      referral_code: form.referral_code || null
    }
    await supabase.from('clients').update(payload).eq('id', id.value).eq('store_id', admin.selectedShopId)
    const tagIds = await ensureTags()
    const { data: existing } = await supabase.from('client_tags').select('tag_id').eq('client_id', id.value)
    const current = new Set<number>((Array.isArray(existing) ? existing : []).map(r => Number(r.tag_id)))
    for (const tid of Array.from(selectedTags)) {
      if (!tagIds.includes(tid)) continue
      if (!current.has(tid)) await supabase.from('client_tags').insert({ client_id: id.value, tag_id: tid })
    }
    for (const tid of Array.from(current)) {
      if (!selectedTags.has(tid)) await supabase.from('client_tags').delete().eq('client_id', id.value).eq('tag_id', tid)
    }
    navigateTo('/admin/clients')
  } finally { saving.value = false }
}
async function deleteClient() {
  const storeId = admin.selectedShopId
  if (!storeId) return
  if (!confirm(t('admin.clientForm.deleteConfirm'))) return
  saving.value = true
  try {
    await supabase.from('clients').delete().eq('id', id.value).eq('store_id', storeId)
    navigateTo('/admin/clients')
  } finally { saving.value = false }
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
  await loadTags()
  await loadClient()
})
useHead({ title: t('admin.clientForm.editHeadTitle') })
</script>
