<template>
  <div class="flex gap-2">
    <div class="w-32">
      <select
        v-model="selectedCode"
        class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-white"
      >
        <option
          v-for="c in countries"
          :key="c.code"
          :value="c.code"
        >
          {{ c.dial }} {{ c.label }}
        </option>
      </select>
    </div>
    <div class="flex-1">
      <input
        v-model="localNumber"
        type="tel"
        class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        @blur="emit('blur')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  phone?: string
  country?: string
  modelValue?: string
}>()

const emit = defineEmits<{
  (e: 'update:phone', value: string): void
  (e: 'update:country', value: string): void
  (e: 'update:modelValue', value: string): void
  (e: 'blur'): void
}>()

import { COUNTRY_DIAL_CODES } from '~/data/countryDialCodes'
import { useI18n } from '~/composables/i18n'
const { t, locale } = useI18n()
const countries = computed(() => {
  const lang = String(locale.value || 'en')
  let dn: any
  try {
    dn = new (Intl as any).DisplayNames([lang], { type: 'region' })
  } catch {}
  return COUNTRY_DIAL_CODES.map((c) => {
    const key = `countries.${c.code}`
    const translated = t(key)
    const hasCustom = translated && translated !== key
    const intlName = dn ? dn.of(c.code) : null
    const label = hasCustom ? translated : (intlName || c.code)
    return { code: c.code, dial: c.dial, label }
  }).sort((a, b) => a.label.localeCompare(b.label))
})

const selectedCode = ref(props.country || 'CM')
const localNumber = ref('')

const findCountry = (code: string) => {
  const list = countries.value
  return list.find((c) => c.code === code) || list[0]
}

const normalizeDigits = (value: string) => {
  return String(value || '').replace(/\D/g, '')
}

const rebuildPhone = () => {
  const country = findCountry(selectedCode.value)
  const digits = normalizeDigits(localNumber.value)
  const e164 = digits ? country.dial + digits : ''
  emit('update:country', country.code)
  emit('update:phone', e164)
  emit('update:modelValue', e164)
}

watch(
  () => [props.phone, props.modelValue, props.country] as const,
  ([phone, modelValue, country]) => {
    const base = findCountry(country || selectedCode.value)
    selectedCode.value = base.code
    const raw = String(phone ?? modelValue ?? '')
    const digits = normalizeDigits(raw)
    const dialDigits = normalizeDigits(base.dial)
    if (digits && dialDigits && digits.startsWith(dialDigits)) {
      localNumber.value = digits.slice(dialDigits.length)
    } else {
      localNumber.value = digits
    }
  },
  { immediate: true }
)

watch([selectedCode, localNumber], () => {
  rebuildPhone()
})
</script>
