<template>
  <div>
    <div class="flex items-center gap-2">
      <NuxtLink to="/admin/clients" class="rounded-lg border bg-white px-3 py-2 text-sm">{{ t('admin.clientForm.back') }}</NuxtLink>
      <h1 class="text-2xl font-bold">{{ t('admin.clientForm.title') }}</h1>
    </div>

    <div class="mt-6 rounded-2xl border bg-white p-6">
      <div class="grid gap-4">
        <div>
          <label class="block text-sm font-medium">{{ t('admin.clientForm.nameLabel') }}</label>
          <input v-model.trim="form.name" :placeholder="t('admin.clientForm.namePlaceholder')" class="mt-1 w-full rounded-lg border px-3 py-2 focus:border-primary focus:ring-primary" />
        </div>
        <div class="grid gap-3 sm:grid-cols-[120px_1fr]">
          <div>
            <label class="block text-sm font-medium">{{ t('admin.clientForm.phoneCodeLabel') }}</label>
            <select v-model="phonePrefix" class="mt-1 w-full rounded-lg border px-3 py-2 focus:border-primary focus:ring-primary">
              <option value="+237">+237</option>
              <option value="+33">+33</option>
              <option value="+1">+1</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium">{{ t('admin.clientForm.phoneLabel') }}</label>
            <input v-model.trim="form.phone" :placeholder="t('admin.clientForm.phonePlaceholder')" class="mt-1 w-full rounded-lg border px-3 py-2 focus:border-primary focus:ring-primary" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium">{{ t('admin.clientForm.emailLabel') }}</label>
          <input v-model.trim="form.email" :placeholder="t('admin.clientForm.emailPlaceholder')" class="mt-1 w-full rounded-lg border px-3 py-2 focus:border-primary focus:ring-primary" />
        </div>
        <div>
          <label class="block text-sm font-medium">{{ t('admin.clientForm.birthdayLabel') }}</label>
          <input v-model="birthdayStr" type="date" class="mt-1 w-full rounded-lg border px-3 py-2 focus:border-primary focus:ring-primary" />
        </div>
        <div>
          <label class="block text-sm font-medium">{{ t('admin.clientForm.addressLabel') }}</label>
          <textarea v-model.trim="form.address" :placeholder="t('admin.clientForm.addressPlaceholder')" rows="2" class="mt-1 w-full rounded-lg border px-3 py-2 focus:border-primary focus:ring-primary"></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium">{{ t('admin.clientForm.tagsLabel') }}</label>
          <div class="mt-1 flex flex-wrap gap-2">
            <button v-for="t in tags" :key="t.id" class="rounded-full border px-3 py-1 text-xs" :class="selectedTags.has(Number(t.id))?'bg-green-100 border-green-300':'bg-white'" @click="toggleTag(Number(t.id))">{{ t.name }}</button>
          </div>
          <input v-model.trim="newTagName" :placeholder="t('admin.clientForm.addTagPlaceholder')" class="mt-2 w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:ring-primary" @keydown.enter.prevent="addNewTagName" />
        </div>
        <div>
          <label class="block text-sm font-medium">{{ t('admin.clientForm.notesLabel') }}</label>
          <textarea v-model.trim="form.notes" rows="3" class="mt-1 w-full rounded-lg border px-3 py-2 focus:border-primary focus:ring-primary"></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium">{{ t('admin.clientForm.referralCodeLabel') }}</label>
          <input v-model.trim="form.referral_code" class="mt-1 w-full rounded-lg border px-3 py-2 focus:border-primary focus:ring-primary" />
        </div>
      </div>
      <div class="mt-6">
        <button class="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white" :disabled="saving || !isValid" @click="save">{{ saving ? t('common.saving') : t('admin.clientForm.save') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SupabaseClient } from '@supabase/supabase-js'
import { useAdminStore } from '~/stores/admin'
import { useI18n } from '~/composables/i18n'
definePageMeta({ layout: 'admin' })
const nuxt = useNuxtApp()
const supabase = nuxt.$supabase as SupabaseClient
const admin = useAdminStore()
const { t } = useI18n()
const saving = ref(false)
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
function toggleTag(id: number) { if (selectedTags.has(id)) selectedTags.delete(id); else selectedTags.add(id) }
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
async function ensureTags(): Promise<number[]> {
  const storeId = admin.selectedShopId
  const ids: number[] = []
  for (const t of tags.value) {
    if (t._new) {
      const { data } = await supabase.from('tags').insert({ store_id: storeId, name: t.name }).select('id').maybeSingle()
      if (data?.id) ids.push(Number(data.id))
    } else if (t.id) {
      ids.push(Number(t.id))
    }
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
      store_id: storeId,
      name: form.name,
      phone: `${phonePrefix.value}${form.phone}`,
      email: form.email || null,
      birthday: form.birthday ? new Date(form.birthday as Date).toISOString().slice(0,10) : null,
      address: form.address || null,
      notes: form.notes || null,
      referral_code: form.referral_code || null
    }
    const { data } = await supabase.from('clients').insert(payload).select('id').maybeSingle()
    const cid = String(data?.id || '')
    const tagIds = await ensureTags()
    for (const tid of Array.from(selectedTags)) {
      if (!tagIds.includes(tid)) continue
      await supabase.from('client_tags').insert({ client_id: cid, tag_id: tid })
    }
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
})
useHead({ title: t('admin.clientForm.addHeadTitle') })
</script>
