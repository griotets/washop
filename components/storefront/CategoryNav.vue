<template>
  <div class="sticky top-16 z-40 -mx-4 px-4 sm:mx-0 sm:px-0 mb-8 overflow-x-auto bg-gray-50/95 backdrop-blur py-2">
    <div class="flex space-x-2 sm:space-x-4 min-w-max">
      <button 
        @click="$emit('select', 'all')"
        class="rounded-full px-4 py-2 text-sm font-medium transition-colors"
        :class="activeCategory === 'all' ? 'text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100 border'"
        :style="activeCategory === 'all' ? { backgroundColor: primaryColor } : {}"
      >
        {{ t('storefront.all') }}
      </button>
      <button 
        v-for="cat in categories" 
        :key="cat.id"
        @click="$emit('select', cat.id)"
        class="rounded-full px-4 py-2 text-sm font-medium transition-colors"
        :class="activeCategory === cat.id ? 'text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100 border'"
        :style="activeCategory === cat.id ? { backgroundColor: primaryColor } : {}"
      >
        {{ cat.name }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '~/composables/i18n'

defineProps<{
  categories: any[]
  activeCategory: string
  primaryColor: string
}>()

defineEmits<{
  (e: 'select', id: string): void
}>()

const { t } = useI18n()
</script>
