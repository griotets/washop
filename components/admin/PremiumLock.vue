<template>
  <div class="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
    <div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
      <Lock class="h-6 w-6 text-gray-400" />
    </div>
    <h3 class="mb-1 text-sm font-semibold text-gray-900">{{ title || t('admin.premiumLock.title') }}</h3>
    <p class="mb-4 text-xs text-gray-500">{{ description || t('admin.premiumLock.desc') }}</p>
    <NuxtLink 
      to="/admin/settings?tab=billing" 
      class="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-gray-800"
    >
      <Sparkles class="h-3 w-3" />
      <span>{{ t('admin.premiumLock.upgrade') }}</span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { Lock, Sparkles } from 'lucide-vue-next'
import { useI18n } from '~/composables/i18n'
const { t } = useI18n()

defineProps<{
  title?: string
  description?: string
}>()
</script>
