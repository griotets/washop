<template>
  <main class="mx-auto max-w-md px-6 py-12">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-3xl font-bold">{{ t('login.title') }}</h1>
      <div class="flex items-center gap-2">
        <button :class="['px-3 py-1 rounded', locale==='fr' ? 'bg-primary text-white' : 'bg-gray-100']" @click="setLocale('fr')">FR</button>
        <button :class="['px-3 py-1 rounded', locale==='en' ? 'bg-primary text-white' : 'bg-gray-100']" @click="setLocale('en')">EN</button>
      </div>
    </div>
    <p class="mt-3 text-gray-600">{{ t('login.subtitle') }}</p>
  </main>
</template>
<script setup>
import { useI18n } from '~/composables/i18n'
const { t, locale, setLocale } = useI18n()
useHead({ title: `${t('login.title')} | ${t('home.title')}` })
</script>
