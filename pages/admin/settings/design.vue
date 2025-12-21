<template>
  <main class="mx-auto max-w-5xl px-6 py-12">
    <h1 class="text-3xl font-bold">{{ t('admin.design.title') }}</h1>
    <p class="mt-3 text-gray-600">{{ t('admin.design.subtitle') }}</p>
  </main>
</template>
<script setup>
import { useI18n } from '~/composables/i18n'

const { t } = useI18n()

useHead({ title: t('admin.design.headTitle') })
</script>
