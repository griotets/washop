<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <MarketingHeader />
    <div class="flex-grow pt-24 pb-12">
      <div class="mx-auto max-w-4xl px-6 lg:px-8">
        <div class="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <h1 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-8">{{ t('legal.title') }}</h1>
          
          <div class="prose prose-green max-w-none text-gray-600">
            <section class="mb-8">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">{{ t('legal.editor') }}</h2>
              <p class="font-bold">{{ t('legal.companyName') }}</p>
              <p>{{ t('legal.address') }}</p>
              <p>{{ t('legal.rccm') }}</p>
              <p>{{ t('legal.niu') }}</p>
            </section>

            <section class="mb-8">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">{{ t('legal.contact') }}</h2>
              <p>{{ t('legal.email') }}</p>
            </section>

            <section class="mb-8">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">{{ t('legal.hosting') }}</h2>
              <p>{{ t('legal.hostName') }}</p>
            </section>
          </div>
        </div>
      </div>
    </div>
    <MarketingFooter />
  </div>
</template>

<script setup>
import { useI18n } from '~/composables/i18n'
const { t } = useI18n()

useHead({
  title: computed(() => t('legal.title') + ' | Wa-Shop'),
  meta: [
    { name: 'description', content: computed(() => t('legal.title')) }
  ]
})
</script>
