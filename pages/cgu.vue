<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <MarketingHeader />
    <div class="flex-grow pt-24 pb-12">
      <div class="mx-auto max-w-4xl px-6 lg:px-8">
        <div class="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <h1 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-2">{{ t('cgu.title') }}</h1>
          <p class="text-gray-500 mb-8">{{ t('cgu.lastUpdated', { date: currentDate }) }}</p>

          <div class="prose prose-green max-w-none text-gray-600">
            <section v-for="(art, i) in articles" :key="i" class="mb-8">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">{{ t(art.title) }}</h2>
              <p class="mb-4">{{ t(art.text) }}</p>
            </section>

            <section>
               <h2 class="text-xl font-semibold text-gray-900 mb-4">{{ t('cgu.contact') }}</h2>
               <p>{{ t('cgu.contactText') }}</p>
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
const { t } = useI18n()

const currentDate = new Date().toLocaleDateString('fr-FR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})

const articles = [
  { title: 'cgu.art1.title', text: 'cgu.art1.text' },
  { title: 'cgu.art2.title', text: 'cgu.art2.text' },
  { title: 'cgu.art3.title', text: 'cgu.art3.text' },
  { title: 'cgu.art4.title', text: 'cgu.art4.text' },
  { title: 'cgu.art5.title', text: 'cgu.art5.text' },
  { title: 'cgu.art6.title', text: 'cgu.art6.text' },
  { title: 'cgu.art7.title', text: 'cgu.art7.text' },
  { title: 'cgu.art8.title', text: 'cgu.art8.text' },
  { title: 'cgu.art9.title', text: 'cgu.art9.text' },
  { title: 'cgu.art10.title', text: 'cgu.art10.text' },
  { title: 'cgu.art11.title', text: 'cgu.art11.text' },
  { title: 'cgu.art12.title', text: 'cgu.art12.text' },
  { title: 'cgu.art13.title', text: 'cgu.art13.text' },
  { title: 'cgu.art14.title', text: 'cgu.art14.text' },
  { title: 'cgu.art15.title', text: 'cgu.art15.text' },
]

useHead({
  title: computed(() => t('cgu.title') + ' | Wa-Shop'),
  meta: [
    { name: 'description', content: computed(() => t('cgu.metaDescription')) }
  ]
})
</script>