<template>
  <main class="min-h-screen w-full bg-background-light flex items-center">
    <div class="mx-auto w-full max-w-4xl px-6 py-8 md:py-0 grid gap-8 md:grid-cols-2 md:h-screen md:items-center">
      <div class="rounded-2xl bg-white p-6 shadow-sm">
        <div class="mb-6">
          <NuxtLink to="/" class="inline-block mb-4">
            <img src="/logo.svg" alt="Wa-Shop" class="h-10 w-10" />
          </NuxtLink>
          <h1 class="text-2xl font-bold mb-1">{{ t('billingOnboard.title') }}</h1>
          <p class="text-gray-600 text-sm">{{ t('billingOnboard.subtitle') }}</p>
        </div>

        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">{{ t('billingOnboard.name') }}</label>
              <input v-model.trim="form.name" type="text" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">{{ t('billingOnboard.surname') }}</label>
              <input v-model.trim="form.surname" type="text" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">{{ t('register.emailLabel') }}</label>
            <input v-model.trim="form.email" type="email" class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">{{ t('billingOnboard.phone') }}</label>
            <PhoneInput
              v-model:phone="form.phone"
              v-model:country="form.country"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">{{ t('billingOnboard.address') }}</label>
            <input v-model.trim="form.address" type="text" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary" />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">{{ t('billingOnboard.city') }}</label>
              <input v-model.trim="form.city" type="text" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">{{ t('billingOnboard.state') }}</label>
              <input v-model.trim="form.state" type="text" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">{{ t('billingOnboard.country') }}</label>
              <select v-model="form.country" class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-white">
                <option value="CM">Cameroun</option>
                <option value="SN">Sénégal</option>
                <option value="CI">Côte d’Ivoire</option>
                <option value="GA">Gabon</option>
                <option value="FR">France</option>
                <option value="US">United States</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">{{ t('billingOnboard.zip') }}</label>
              <input v-model.trim="form.zip" type="text" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-primary" />
            </div>
          </div>

          <div class="space-y-2 pt-2">
            <button
              class="w-full rounded-lg bg-green-600 text-white px-5 py-3 font-semibold text-sm disabled:opacity-50"
              :disabled="submitting || !isValid"
              @click="submit"
            >
              <span v-if="submitting">{{ t('common.saving') }}</span>
              <span v-else>{{ t('billingOnboard.subscribeNow') }}</span>
            </button>
            <button
              type="button"
              class="w-full rounded-lg border border-gray-300 px-5 py-3 font-semibold text-sm"
              @click="skip"
            >
              {{ t('register.skip') }}
            </button>
          </div>
        </div>
      </div>

      <div class="hidden md:flex flex-col justify-center rounded-2xl bg-green-50 p-6">
        <div class="max-w-sm mx-auto space-y-4">
          <div class="rounded-xl border border-green-200 bg-white p-4">
            <div class="text-xs font-semibold text-green-700 mb-2 uppercase tracking-wide">
              {{ t('billingOnboard.planBadge') }}
            </div>
            <div class="flex items-baseline justify-between">
              <div>
                <div class="text-lg font-semibold text-gray-900">Premium</div>
                <div class="text-sm text-gray-600 mt-1">
                  {{ t('billingOnboard.planSubtitle') }}
                </div>
              </div>
            </div>
            <div class="mt-4 text-sm text-gray-700">
              {{ t('billingOnboard.planSummary', { price: displayPrice }) }}
            </div>
          </div>

          <div class="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600">
            <p class="font-medium mb-1">{{ t('billingOnboard.secureTitle') }}</p>
            <p>{{ t('billingOnboard.secureDesc') }}</p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { SupabaseClient } from '@supabase/supabase-js'
import { navigateTo, useNuxtApp } from '#app'
import { useI18n } from '~/composables/i18n'
import { useAdminStore } from '~/stores/admin'
import { useToast } from '~/composables/useToast'
import PhoneInput from '~/components/PhoneInput.vue'

const { t } = useI18n()
const nuxt = useNuxtApp()
const supabase = nuxt.$supabase as SupabaseClient
const store = useAdminStore()
store.load()

const submitting = ref(false)

const form = reactive({
  name: '',
  surname: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  country: 'CM',
  state: '',
  zip: ''
})

const displayPrice = computed(() => {
  const cemac = new Set(['CM', 'CF', 'TD', 'CG', 'GA', 'GQ'])
  const uemoa = new Set(['SN', 'ML', 'BF', 'NE', 'TG', 'BJ', 'CI', 'GW'])
  const c = String(form.country || 'CM').toUpperCase()
  if (cemac.has(c) || uemoa.has(c)) return '500 F'
  return '1 $'
})

const isValid = computed(() => {
  if (!form.email || !/.+@.+\..+/.test(String(form.email))) return false
  if (!form.name || !form.surname) return false
  if (!form.country) return false
  return true
})

onMounted(async () => {
  if (!supabase?.auth) return
  const { data } = await supabase.auth.getUser()
  const uid = data?.user?.id
  if (!uid) {
    await navigateTo('/auth/login')
    return
  }
  const email = data?.user?.email
  if (email) form.email = email
})

async function ensureEnterprise() {
  if (!supabase?.auth) return
  const { data } = await supabase.auth.getUser()
  const uid = data?.user?.id
  if (!uid) return
  let { data: ent, error: entErr } = await supabase.from('enterprises').select('id,name').eq('owner_id', uid).maybeSingle()
  if (entErr) {
    useToast().error('Erreur création entreprise')
  }
  if (!ent) {
    const name = String(data?.user?.email || 'My Business').split('@')[0]
    const { data: insData, error: insErr } = await supabase.from('enterprises').insert({ owner_id: uid, name }).select('id').maybeSingle()
    if (insErr) {
      useToast().error('Erreur création entreprise')
    } else {
      ent = insData as any
      // Assign free plan by default for new enterprises
      if (ent?.id) {
        try {
          const { data: sess } = await supabase.auth.getSession()
          const token = sess?.session?.access_token ? `Bearer ${sess.session.access_token}` : ''
          await $fetch('/api/enterprises/subscribe', {
            method: 'POST',
            body: { enterpriseId: ent.id, planId: 'free' },
            headers: token ? { Authorization: token } : undefined
          })
        } catch (e) {
          console.error('Failed to assign default free plan', e)
        }
      }
    }
  }
  return ent?.id as string | undefined
}

async function submit() {
  if (!isValid.value) return
  const toast = useToast()
  submitting.value = true
  try {
    const enterpriseId = await ensureEnterprise()
    if (!enterpriseId) {
      toast.error('Impossible de récupérer votre organisation')
      return
    }
    const { data: sess } = await supabase.auth.getSession()
    const token = sess?.session?.access_token ? `Bearer ${sess.session.access_token}` : ''
    const res = await $fetch<{ url: string }>('/api/stripe/checkout', {
      method: 'POST',
      body: {
        enterpriseId,
        customer: {
          name: form.name,
          surname: form.surname,
          phone: form.phone,
          email: form.email,
          address: form.address,
          city: form.city,
          country: form.country,
          state: form.state,
          zip: form.zip
        }
      },
      headers: token ? { Authorization: token } : undefined
    })
    if (!res?.url) {
      toast.error('Erreur lors de la préparation du paiement')
      return
    }
    window.location.href = res.url
  } catch (e: any) {
    if (e?.statusCode === 404 && e?.statusMessage === 'Enterprise not found') {
      toast.error('Organisation introuvable, veuillez vous reconnecter.')
      await navigateTo('/auth/login')
    } else {
      toast.error('Erreur CinetPay')
    }
  } finally {
    submitting.value = false
  }
}

async function skip() {
  await ensureEnterprise()
  await navigateTo('/admin/stores/create')
}
</script>
