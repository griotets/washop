<template>
  <div class="min-h-screen bg-gray-50">
    <header class="border-b bg-white">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <NuxtLink to="/" class="flex items-center gap-2">
          <img src="/logo.svg" alt="Wa-Shop" class="h-8 w-8" />
          <span class="text-lg font-bold text-gray-900">Wa-Shop</span>
        </NuxtLink>
      </div>
    </header>
    <main class="mx-auto max-w-3xl px-4 py-16 text-center">
      <div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <span class="text-2xl font-extrabold">404</span>
      </div>
      <h1 class="text-3xl font-bold text-gray-900">{{ t('error.notFoundTitle') }}</h1>
      <p class="mt-3 text-gray-600">{{ t('error.notFoundDesc') }}</p>
      <div class="mt-8">
        <NuxtLink to="/" class="inline-flex items-center rounded-lg bg-primary px-6 py-3 font-semibold text-white shadow-sm hover:brightness-110">
          {{ t('error.backHome') }}
        </NuxtLink>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '~/composables/i18n'
const { t } = useI18n()
</script>

