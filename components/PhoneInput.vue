<template>
  <div class="flex gap-2">
    <div class="w-32">
      <select
        v-model="selectedCode"
        class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-primary focus:ring-primary sm:text-sm bg-white"
        @change="onCountryChange"
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
        v-model="displayValue"
        type="tel"
        class="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        @input="onInput"
        @blur="emit('blur')"
        placeholder="6..."
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { parsePhoneNumber, AsYouType, type CountryCode } from 'libphonenumber-js'
import { COUNTRY_DIAL_CODES } from '~/data/countryDialCodes'
import { useI18n } from '~/composables/i18n'

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

const { t, locale } = useI18n()

// Countries list with translations
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

const selectedCode = ref<CountryCode>((props.country as CountryCode) || 'CM')
const displayValue = ref('')

// Initialize from props
const initPhone = (val: string) => {
  if (!val) {
    displayValue.value = ''
    return
  }
  try {
    const parsed = parsePhoneNumber(val, selectedCode.value)
    if (parsed) {
      if (parsed.country) selectedCode.value = parsed.country
      displayValue.value = parsed.format('NATIONAL')
    } else {
      displayValue.value = val
    }
  } catch (e) {
    // Fallback for incomplete/invalid numbers
    displayValue.value = val
  }
}

// Watch props changes
watch(() => props.modelValue || props.phone, (newVal) => {
  // Check if current display value matches the new prop to avoid re-formatting while typing (cursor jumps)
  try {
    const currentParsed = parsePhoneNumber(displayValue.value, selectedCode.value)
    if (currentParsed && currentParsed.number === newVal) {
      return // No change needed
    }
  } catch {}
  
  // If it's a real change, re-init
  if (newVal) initPhone(newVal)
}, { immediate: true })

function onInput(e: Event) {
  const val = (e.target as HTMLInputElement).value
  
  // Use AsYouType for live formatting
  const asYouType = new AsYouType(selectedCode.value)
  const formatted = asYouType.input(val)
  
  // Note: We don't force displayValue = formatted here because it can mess up cursor position
  // But we can use asYouType to get the underlying number
  
  const parsed = asYouType.getNumber()
  
  if (parsed) {
    // If we detected a country change (e.g. pasted +33...)
    if (parsed.country && parsed.country !== selectedCode.value) {
      selectedCode.value = parsed.country
      // Update display to national format of new country
      displayValue.value = parsed.format('NATIONAL')
    }
    
    if (parsed.isValid()) {
      const e164 = parsed.format('E.164')
      emit('update:phone', e164)
      emit('update:modelValue', e164)
      emit('update:country', parsed.country || selectedCode.value)
    } else {
      // Emit partial/invalid if possible, or nothing?
      // Better to emit what we have if it looks like a number
      if (parsed.number) {
        emit('update:phone', parsed.number)
        emit('update:modelValue', parsed.number)
      }
    }
  } else {
    // Fallback manual construction
    const digits = val.replace(/\D/g, '')
    const country = countries.value.find(c => c.code === selectedCode.value)
    if (country && digits) {
      const manual = country.dial + digits
      emit('update:phone', manual)
      emit('update:modelValue', manual)
    } else {
      emit('update:phone', '')
      emit('update:modelValue', '')
    }
  }
}

function onCountryChange() {
  // Re-parse current input with new country
  const raw = displayValue.value
  const asYouType = new AsYouType(selectedCode.value)
  asYouType.input(raw)
  const parsed = asYouType.getNumber()
  
  if (parsed && parsed.isValid()) {
    const e164 = parsed.format('E.164')
    emit('update:phone', e164)
    emit('update:modelValue', e164)
    emit('update:country', selectedCode.value)
  } else {
     // If invalid, just emit the new prefix + raw digits
     const digits = raw.replace(/\D/g, '')
     const country = countries.value.find(c => c.code === selectedCode.value)
     if (country) {
       const manual = country.dial + digits
       emit('update:phone', manual)
       emit('update:modelValue', manual)
       emit('update:country', selectedCode.value)
     }
  }
}
</script>
