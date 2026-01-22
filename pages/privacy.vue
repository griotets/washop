<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <MarketingHeader />
    <div class="flex-grow pt-24 pb-12">
      <div class="mx-auto max-w-4xl px-6 lg:px-8">
        <div class="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <h1 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-2">{{ t('privacy.title') }}</h1>
          <p class="text-gray-500 mb-8">{{ t('privacy.lastUpdated', { date: currentDate }) }}</p>

          <div class="prose prose-green max-w-none text-gray-600">
            <section v-for="(art, i) in articles" :key="i" class="mb-8">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">{{ t(art.title) }}</h2>
              <p class="mb-4">{{ t(art.text) }}</p>
            </section>

            <section>
               <h2 class="text-xl font-semibold text-gray-900 mb-4">{{ t('privacy.contact') }}</h2>
               <p>{{ t('privacy.contactText') }}</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
  <MarketingFooter />
</template>

<script setup>
import { useI18n } from '~/composables/i18n'
const { t, locale } = useI18n()

const currentDate = computed(() => {
  return new Date().toLocaleDateString(locale.value === 'fr' ? 'fr-FR' : (locale.value === 'it' ? 'it-IT' : 'en-US'), {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const articles = [
  { title: 'privacy.art1.title', text: 'privacy.art1.text' },
  { title: 'privacy.art2.title', text: 'privacy.art2.text' },
  { title: 'privacy.art3.title', text: 'privacy.art3.text' },
  { title: 'privacy.art4.title', text: 'privacy.art4.text' },
  { title: 'privacy.art5.title', text: 'privacy.art5.text' },
  { title: 'privacy.art6.title', text: 'privacy.art6.text' },
]

useHead({
  title: computed(() => t('privacy.title') + ' | Wa-Shop'),
  meta: [
    { name: 'description', content: computed(() => t('privacy.metaDescription')) }
  ]
})
</script>
