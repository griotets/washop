<template>
  <div class="grid grid-cols-3 gap-3">
    <div>
      <label v-if="label" class="block text-sm">{{ label }}</label>
      <select v-model="code" class="mt-1 w-full rounded border px-3 py-2">
        <option v-for="c in countryList" :key="c.code" :value="c.code">{{ c.name }} ({{ c.code }})</option>
      </select>
    </div>
    <div class="col-span-2">
      <label v-if="labelNumber" class="block text-sm">{{ labelNumber }}</label>
      <input v-model="number" inputmode="numeric" pattern="[0-9]*" type="tel" :placeholder="placeholder" class="mt-1 w-full rounded border px-3 py-2" />
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{ modelValue?: string, codes?: string[], label?: string, labelNumber?: string, placeholder?: string }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()
import { countries } from '~/data/countries'
const countryList = computed(() => countries)
const codes = computed(() => props.codes || countryList.value.map(c => c.code))
const code = ref('+237')
const number = ref('')
watch(() => props.modelValue, (v) => {
  if (!v) return
  const m = String(v)
  const found = codes.value.find(c => m.startsWith(c))
  if (found) { code.value = found; number.value = m.slice(found.length) }
})
watch([code, number], () => {
  const full = `${code.value}${String(number.value || '').replace(/\\s+/g, '')}`
  emit('update:modelValue', full)
})
</script>
