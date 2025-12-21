<template>
  <main class="mx-auto max-w-5xl px-6 py-12">
    <h1 class="text-3xl font-bold">{{ t('storefront.confirmationTitle') }}</h1>
    <p class="mt-3 text-gray-600">{{ t('storefront.orderSent') }}</p>
  </main>
</template>
<script setup>
import { useI18n } from '~/composables/i18n'

const { t } = useI18n()
const route = useRoute()
useHead({ title: `${t('storefront.confirmationTitle')} | ${route.params['boutiqueSlug']}` })
</script>
