<template>
  <a
    v-if="visible && phone"
    :href="whatsappLink"
    target="_blank"
    class="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2"
    :style="{ backgroundColor: '#25D366', color: 'white' }"
    aria-label="Contact on WhatsApp"
  >
    <svg 
      viewBox="0 0 24 24" 
      width="32" 
      height="32" 
      stroke="currentColor" 
      stroke-width="2" 
      fill="none" 
      stroke-linecap="round" 
      stroke-linejoin="round" 
      class="h-8 w-8"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
  </a>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  phone?: string
  visible?: boolean
}>()

const whatsappLink = computed(() => {
  if (!props.phone) return '#'
  const p = props.phone.replace(/\D/g, '')
  return `https://wa.me/${p}`
})
</script>
