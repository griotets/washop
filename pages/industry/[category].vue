<template>
  <div class="bg-white">
    <MarketingHeader />

    <div class="relative isolate px-6 pt-14 lg:px-8 bg-gradient-to-b from-green-50 to-white">
      <div class="mx-auto max-w-2xl py-24 sm:py-40 text-center">
        <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600">
          {{ content.title }}
        </h1>
        <p class="mt-6 text-lg leading-8 text-gray-700">
          {{ content.lead }}
        </p>
        <p class="mt-3 text-base leading-7 text-gray-600">
          {{ content.subtitle }}
        </p>
      </div>
      <div class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
        <div class="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#4ade80] to-[#2dd4bf] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
      </div>
    </div>

    <div class="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div class="order-2 lg:order-1">
          <div class="flex flex-wrap gap-3">
            <span
              v-for="b in content.benefits"
              :key="b"
              class="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-sm text-green-700 ring-1 ring-inset ring-green-100"
            >
              {{ b }}
            </span>
          </div>
          <div class="mt-8 grid gap-6 sm:grid-cols-2">
            <div
              v-for="f in content.features"
              :key="f.title"
              class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div class="text-lg font-semibold text-gray-900">{{ f.title }}</div>
              <div class="mt-2 text-gray-600">{{ f.description }}</div>
            </div>
          </div>
        </div>

        <div class="order-1 lg:order-2 flex justify-center lg:justify-end">
          <div class="relative border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-2xl">
            <div class="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
            <div class="h-[32px] w-[3px] bg-gray-800 absolute -left-[17px] top-[72px] rounded-l-lg"></div>
            <div class="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
            <div class="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
            <div class="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
            <div class="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-white">
              <div class="flex flex-col h-full">
                <div
                  :class="['text-white p-4 pt-8 shadow-sm', headerClass]"
                >
                  <div class="font-bold text-lg">{{ content.title }}</div>
                  <div class="text-xs opacity-90">{{ t('industryCategory.experience', { group: groupLabel }) }}</div>
                </div>
                <div class="flex-1 overflow-y-auto p-3 bg-gray-50">
                  <div v-if="isFood" class="space-y-3">
                    <div class="grid grid-cols-2 gap-3">
                      <div class="bg-white p-2 rounded-lg shadow-sm">
                        <div class="bg-gray-200 h-20 rounded-md mb-2"></div>
                        <div class="h-3 w-3/4 bg-gray-300 rounded mb-1"></div>
                        <div class="h-3 w-1/2 bg-green-600 rounded"></div>
                      </div>
                      <div class="bg-white p-2 rounded-lg shadow-sm">
                        <div class="bg-gray-200 h-20 rounded-md mb-2"></div>
                        <div class="h-3 w-3/4 bg-gray-300 rounded mb-1"></div>
                        <div class="h-3 w-1/2 bg-green-600 rounded"></div>
                      </div>
                      <div class="bg-white p-2 rounded-lg shadow-sm">
                        <div class="bg-gray-200 h-20 rounded-md mb-2"></div>
                        <div class="h-3 w-3/4 bg-gray-300 rounded mb-1"></div>
                        <div class="h-3 w-1/2 bg-green-600 rounded"></div>
                      </div>
                      <div class="bg-white p-2 rounded-lg shadow-sm">
                        <div class="bg-gray-200 h-20 rounded-md mb-2"></div>
                        <div class="h-3 w-3/4 bg-gray-300 rounded mb-1"></div>
                        <div class="h-3 w-1/2 bg-green-600 rounded"></div>
                      </div>
                    </div>
                    <div class="bg-white rounded-lg p-3 border">
                      <div class="flex items-center justify-between">
                        <div class="text-sm font-medium">{{ t('catalog.cart') }}</div>
                        <div class="text-xs text-gray-600">{{ t('catalog.items', { n: 2 }) }}</div>
                      </div>
                      <div class="mt-2">
                        <div class="h-2 w-full bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                  <div v-else-if="isEcom" class="space-y-3">
                    <div class="flex gap-2">
                      <span class="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">{{ t('industryCategory.tags.new') }}</span>
                      <span class="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">{{ t('industryCategory.tags.promos') }}</span>
                      <span class="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">{{ t('industryCategory.tags.bestSellers') }}</span>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                      <div class="bg-white p-2 rounded-lg shadow-sm">
                        <div class="bg-gray-200 h-24 rounded-md mb-2"></div>
                        <div class="h-3 w-3/4 bg-gray-300 rounded mb-1"></div>
                        <div class="h-3 w-1/2 bg-green-600 rounded"></div>
                      </div>
                      <div class="bg-white p-2 rounded-lg shadow-sm">
                        <div class="bg-gray-200 h-24 rounded-md mb-2"></div>
                        <div class="h-3 w-3/4 bg-gray-300 rounded mb-1"></div>
                        <div class="h-3 w-1/2 bg-green-600 rounded"></div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="space-y-3">
                    <div class="bg-white p-3 rounded-lg shadow-sm border">
                      <div class="text-sm font-medium">{{ t('industryCategory.chooseService') }}</div>
                      <div class="mt-2 grid grid-cols-2 gap-2">
                        <div class="h-8 bg-gray-100 rounded"></div>
                        <div class="h-8 bg-gray-100 rounded"></div>
                      </div>
                    </div>
                    <div class="bg-white p-3 rounded-lg shadow-sm border">
                      <div class="text-sm font-medium">{{ t('industryCategory.selectDate') }}</div>
                      <div class="mt-2 h-20 bg-gray-100 rounded"></div>
                    </div>
                  </div>
                </div>
                <div class="bg-white border-t p-3 flex justify-between items-center">
                  <div class="text-sm font-semibold">
                    <span v-if="isFood">{{ t('catalog.items', { n: 2 }) }}</span>
                    <span v-else-if="isEcom">{{ t('catalog.items', { n: 3 }) }}</span>
                    <span v-else>{{ t('industryCategory.countReservation') }}</span>
                  </div>
                  <div :class="['text-white px-4 py-1.5 rounded-full text-xs font-bold', ctaClass]">
                    <span v-if="isServices">{{ t('industryCategory.reserveWhatsApp') }}</span>
                    <span v-else>{{ t('industryCategory.orderWhatsApp') }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mx-auto mt-16 max-w-2xl lg:max-w-none">
        <h2 class="text-2xl font-bold tracking-tight text-gray-900 text-center">{{ t('industryCategory.useCasesTitle') }}</h2>
        <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="u in useCases" :key="u.title" class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div class="text-lg font-semibold text-gray-900">{{ u.title }}</div>
            <p class="mt-2 text-gray-600">{{ u.desc }}</p>
          </div>
        </div>
      </div>

      <div class="mx-auto mt-16 max-w-2xl lg:max-w-none">
        <h2 class="text-2xl font-bold tracking-tight text-gray-900 text-center">{{ t('industryCategory.experienceTitle') }}</h2>
        <p class="mt-3 text-center text-gray-600">{{ t('industryCategory.experienceDesc', { group: groupLabel }) }}</p>
        <div class="mt-8 lg:grid lg:grid-cols-3 lg:gap-8 flex gap-6 overflow-x-auto snap-x snap-mandatory px-1">
          <div v-for="s in screens" :key="s" class="flex justify-center snap-center min-w-[280px]">
            <div class="relative border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[560px] w-[280px] shadow-xl">
              <div class="w-[138px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
              <div class="h-[32px] w-[3px] bg-gray-800 absolute -left-[16px] top-[72px] rounded-l-lg"></div>
              <div class="h-[46px] w-[3px] bg-gray-800 absolute -left-[16px] top-[124px] rounded-l-lg"></div>
              <div class="h-[46px] w-[3px] bg-gray-800 absolute -left-[16px] top-[178px] rounded-l-lg"></div>
              <div class="h-[64px] w-[3px] bg-gray-800 absolute -right-[16px] top-[142px] rounded-r-lg"></div>
              <div class="rounded-[2rem] overflow-hidden w-[252px] h-[532px] bg-white">
                <div class="flex flex-col h-full">
                  <div :class="['text-white p-3 pt-6 shadow-sm', headerClass]">
                    <div class="font-bold">{{ screenTitle(s) }}</div>
                    <div class="text-[10px] opacity-90">{{ content.title }}</div>
                  </div>
                  <div class="flex-1 overflow-y-auto p-3 bg-gray-50">
                    <div v-if="s==='list'">
                      <div class="grid grid-cols-2 gap-2">
                        <div class="bg-white p-2 rounded-lg shadow-sm" v-for="i in 4" :key="i">
                          <div class="bg-gray-200 h-20 rounded mb-2"></div>
                          <div class="h-3 w-3/4 bg-gray-300 rounded mb-1"></div>
                          <div :class="['h-3 w-1/2 rounded', badgeClass]"></div>
                        </div>
                      </div>
                    </div>
                    <div v-else-if="s==='detail'">
                      <div class="bg-white rounded-lg shadow-sm p-3">
                        <div class="bg-gray-200 h-32 rounded mb-3"></div>
                        <div class="h-4 w-2/3 bg-gray-300 rounded mb-2"></div>
                        <div class="h-3 w-1/2 bg-gray-200 rounded mb-4"></div>
                        <div class="grid grid-cols-3 gap-2">
                          <div class="h-8 bg-gray-100 rounded"></div>
                          <div class="h-8 bg-gray-100 rounded"></div>
                          <div class="h-8 bg-gray-100 rounded"></div>
                        </div>
                      </div>
                    </div>
                    <div v-else-if="s==='checkout'">
                      <div class="space-y-3">
                        <div class="bg-white rounded-lg p-3 shadow-sm">
                          <div class="flex justify-between text-sm"><span>{{ t('industryCategory.checkout.subtotal') }}</span><span>15 000 F</span></div>
                          <div class="flex justify-between text-sm text-gray-600 mt-1"><span>{{ t('industryCategory.checkout.shipping') }}</span><span>1 000 F</span></div>
                          <div class="h-2 w-full bg-gray-200 rounded mt-2"></div>
                        </div>
                        <div class="bg-white rounded-lg p-3 shadow-sm">
                          <div class="text-sm font-medium">{{ t('industryCategory.checkout.address') }}</div>
                          <div class="h-10 bg-gray-100 rounded mt-2"></div>
                        </div>
                      </div>
                    </div>
                    <div v-else-if="s==='services'">
                      <div class="bg-white p-3 rounded-lg shadow-sm">
                        <div class="text-sm font-medium">{{ t('industryCategory.chooseService') }}</div>
                        <div class="mt-2 grid grid-cols-2 gap-2">
                          <div class="h-8 bg-gray-100 rounded"></div>
                          <div class="h-8 bg-gray-100 rounded"></div>
                        </div>
                      </div>
                    </div>
                    <div v-else-if="s==='calendar'">
                      <div class="bg-white p-3 rounded-lg shadow-sm">
                        <div class="text-sm font-medium">{{ t('industryCategory.selectDate') }}</div>
                        <div class="mt-2 h-24 bg-gray-100 rounded"></div>
                      </div>
                    </div>
                    <div v-else-if="s==='confirm'">
                      <div class="bg-white p-3 rounded-lg shadow-sm">
                        <div class="text-sm font-medium">{{ t('industryCategory.screen.confirmation') }}</div>
                        <div class="h-3 w-3/4 bg-gray-200 rounded mt-2"></div>
                        <div class="h-3 w-1/2 bg-gray-200 rounded mt-2"></div>
                      </div>
                    </div>
                  </div>
                  <div class="bg-white border-t p-3 flex justify-between items-center">
                    <div class="text-xs font-semibold">{{ screenCtaLeft(s) }}</div>
                    <div :class="['text-white px-3 py-1.5 rounded-full text-[11px] font-bold', ctaClass]">{{ screenCtaRight(s) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mx-auto mt-16 max-w-2xl lg:max-w-none">
        <div class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3">
          <div
            v-for="k in content.kpis"
            :key="k.label"
            class="flex flex-col bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center"
          >
            <div class="text-3xl font-extrabold text-gray-900">{{ k.value }}</div>
            <div class="mt-1 text-sm text-gray-600">{{ k.label }}</div>
          </div>
        </div>
      </div>

      <div class="mx-auto mt-16 max-w-3xl">
        <h2 class="text-2xl font-bold tracking-tight text-gray-900 text-center">Ils réussissent avec Wa‑Shop</h2>
        <div class="mt-8 grid gap-6 md:grid-cols-3">
          <figure v-for="t in testimonials" :key="t.name" class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <blockquote class="text-gray-700 text-sm">“{{ t.quote }}”</blockquote>
            <figcaption class="mt-3 text-xs text-gray-500">{{ t.name }} — {{ t.role }}</figcaption>
          </figure>
        </div>
      </div>

      <div class="mx-auto mt-16 max-w-3xl">
        <h2 class="text-2xl font-bold tracking-tight text-gray-900 text-center">{{ t('industryCategory.faqTitle') }}</h2>
        <div class="mt-8 divide-y divide-gray-100 rounded-2xl border border-gray-200 bg-white">
          <div v-for="q in faq" :key="q.q" class="p-6">
            <div class="font-semibold text-gray-900">{{ q.q }}</div>
            <div class="mt-2 text-gray-600 text-sm">{{ q.a }}</div>
          </div>
        </div>
      </div>

      <div class="mx-auto mt-16 max-w-2xl lg:max-w-none">
        <h2 class="text-2xl font-bold tracking-tight text-gray-900 text-center">{{ t('industryCategory.exploreOthers') }}</h2>
        <div class="mt-8 grid max-w-xl grid-cols-1 gap-6 lg:max-w-none lg:grid-cols-3">
          <NuxtLink
            v-for="r in related"
            :key="r.slug"
            :to="`/industry/${r.slug}`"
            class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div class="flex items-center gap-3">
              <div :class="['h-10 w-10 rounded-lg', relatedColor(r.slug)]"></div>
              <div class="text-lg font-semibold text-gray-900">{{ r.title }}</div>
            </div>
            <div class="mt-2 text-gray-600 text-sm line-clamp-2">{{ r.subtitle }}</div>
            <div class="mt-4 text-green-600 text-sm font-semibold">{{ t('industryCategory.viewPage') }}</div>
          </NuxtLink>
        </div>
      </div>

      <div class="mx-auto max-w-2xl text-center mt-16 mb-24 lg:mb-16">
        <NuxtLink
          to="/auth/register"
          class="rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
        >
          {{ t('industryCategory.startFree') }}
        </NuxtLink>
        <NuxtLink to="/pricing" class="ml-6 text-sm font-semibold leading-6 text-gray-900">
          {{ t('industryCategory.viewPricing') }}
        </NuxtLink>
      </div>

      <div class="fixed bottom-4 left-4 right-4 lg:hidden z-40">
        <div class="flex items-center justify-between rounded-full bg-white/90 backdrop-blur px-3 py-2 shadow-lg border border-gray-200">
          <div class="text-xs text-gray-700">
            {{ content.title }} — {{ groupLabel }}
          </div>
          <div class="flex gap-2">
            <NuxtLink to="/pricing" class="rounded-full px-3 py-1.5 text-[11px] font-semibold text-gray-900 ring-1 ring-gray-200">{{ t('industryCategory.bottomBar.pricing') }}</NuxtLink>
            <NuxtLink to="/auth/register" :class="['rounded-full px-3 py-1.5 text-[11px] font-bold text-white', ctaClass]">{{ t('industryCategory.bottomBar.createAccount') }}</NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <MarketingFooter />
  </div>
</template>

<script setup>
import { getIndustryContent, industryContent } from '~/data/industry.js'
import { useI18n } from '~/composables/i18n'
const { t } = useI18n()
const route = useRoute()
const slug = computed(() => String(route.params.category || ''))
const content = computed(() => getIndustryContent(slug.value) || { title: slug.value, lead: 'Industry', subtitle: '', benefits: [], features: [], kpis: [] })

const FOOD_SLUGS = new Set(['restaurants','cafes','home-based-food-business','bakery-pastry','catering-meal-subscription','hotel-bars-restaurants','grocer-butcher','b2b-wholesale'])
const ECOM_SLUGS = new Set(['ecommerce','fashion-apparel','pharmacies-health','mobile-electronics','digital-products-services','popup-event-store','personal-shopping','jewelry-accessories','religious-community'])
const isFood = computed(() => FOOD_SLUGS.has(slug.value))
const isEcom = computed(() => ECOM_SLUGS.has(slug.value))
const isServices = computed(() => !isFood.value && !isEcom.value)

const headerClass = computed(() => {
  if (isFood.value) return 'bg-green-600'
  if (isEcom.value) return 'bg-emerald-600'
  return 'bg-teal-600'
})
const ctaClass = computed(() => {
  if (isFood.value) return 'bg-green-600'
  if (isEcom.value) return 'bg-emerald-600'
  return 'bg-teal-600'
})
const groupLabel = computed(() => {
  if (isFood.value) return t('industryCategory.group.food')
  if (isEcom.value) return t('industryCategory.group.ecom')
  return t('industryCategory.group.services')
})

const faq = computed(() => [
  { q: t('industryCategory.faq.q1'), a: t('industryCategory.faq.a1') },
  { q: t('industryCategory.faq.q2'), a: t('industryCategory.faq.a2') },
  { q: t('industryCategory.faq.q3'), a: t('industryCategory.faq.a3') },
  { q: t('industryCategory.faq.q4'), a: t('industryCategory.faq.a4') }
])

const related = computed(() => {
  const all = []
  const add = (s) => {
    if (s !== slug.value) {
      const c = getIndustryContent(s)
      if (c) all.push({ slug: s, title: c.title, subtitle: c.subtitle })
    }
  }
  if (isFood.value) {
    FOOD_SLUGS.forEach(add)
  } else if (isEcom.value) {
    ECOM_SLUGS.forEach(add)
  } else {
    Object.keys(industryContent)
      .filter(s => !FOOD_SLUGS.has(s) && !ECOM_SLUGS.has(s))
      .forEach(add)
  }
  return all.slice(0, 6)
})
const relatedColor = (s) => {
  if (FOOD_SLUGS.has(s)) return 'bg-indigo-100'
  if (ECOM_SLUGS.has(s)) return 'bg-blue-100'
  return 'bg-purple-100'
}

useHead({
  title: `${content.value.title} | Wa-Shop`,
  meta: [
    { name: 'description', content: `${content.value.lead} ${content.value.subtitle}` },
    { property: 'og:title', content: `${content.value.title} | Wa-Shop` },
    { property: 'og:description', content: `${content.value.lead}` },
    { property: 'og:image', content: '/og-industry.jpg' },
    { name: 'twitter:card', content: 'summary_large_image' }
  ],
  link: [
    { rel: 'canonical', href: `/industry/${slug.value}` }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: content.value.title,
        description: `${content.value.lead} ${content.value.subtitle}`.trim(),
        provider: { '@type': 'Organization', name: 'Wa-Shop', url: 'https://wa-shop.cm' },
        areaServed: { '@type': 'Country', name: 'Cameroon' },
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'XAF', availability: 'https://schema.org/InStock' }
      })
    },
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faq.value.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a }
        }))
      })
    }
  ]
})

const badgeClass = computed(() => {
  if (isFood.value) return 'bg-indigo-600'
  if (isEcom.value) return 'bg-blue-600'
  return 'bg-purple-600'
})

const screens = computed(() => {
  if (isFood.value || isEcom.value) return ['list', 'detail', 'checkout']
  return ['services', 'calendar', 'confirm']
})

const screenTitle = (s) => {
  if (s === 'list') return t('industryCategory.screen.catalog')
  if (s === 'detail') return t('industryCategory.screen.detail')
  if (s === 'checkout') return t('industryCategory.screen.confirmation')
  if (s === 'services') return t('industryCategory.screen.services')
  if (s === 'calendar') return t('industryCategory.screen.calendar')
  return t('industryCategory.screen.confirmation')
}

const screenCtaLeft = (s) => {
  if (s === 'checkout') return t('industryCategory.screenCta.total')
  if (s === 'confirm') return t('industryCategory.screenCta.appointment')
  if (isFood.value) return t('catalog.items', { n: 2 })
  if (isEcom.value) return t('catalog.items', { n: 3 })
  return t('industryCategory.countReservation')
}

const screenCtaRight = (s) => {
  if (isServices.value) return t('industryCategory.reserveWhatsApp')
  return t('industryCategory.orderWhatsApp')
}

const useCases = computed(() => {
  if (isFood.value) return [
    { title: 'Précommandes', desc: 'Prises de commande à l’avance pour fluidifier les heures de pointe.' },
    { title: 'Livraison', desc: 'Coordination des adresses et créneaux de livraison.' },
    { title: 'Offres du jour', desc: 'Publication rapide des plats du jour et upsells.' }
  ]
  if (isEcom.value) return [
    { title: 'Lancements', desc: 'Drops et collections avec liens partageables.' },
    { title: 'Promotions', desc: 'Diffusion segmentée des promos sur WhatsApp.' },
    { title: 'Suivi', desc: 'Statuts de commande et relances automatiques.' }
  ]
  return [
    { title: 'Prise de rendez-vous', desc: 'Réservation simple avec rappel automatique.' },
    { title: 'Devis et paiements', desc: 'Devis envoyés dans WhatsApp avec lien de paiement.' },
    { title: 'Fidélisation', desc: 'Relances post-prestation et ventes additionnelles.' }
  ]
})

const testimonials = computed(() => {
  if (isFood.value) return [
    { name: 'Brice', role: 'Restaurant à Douala', quote: 'Moins d’appels, plus de commandes. Les clients adorent la simplicité.' },
    { name: 'Amina', role: 'Traiteur', quote: 'Les plans hebdos sont devenus gérables grâce aux rappels automatiques.' },
    { name: 'Kevin', role: 'Boulangerie', quote: 'Les précommandes ont réduit les files du matin.' }
  ]
  if (isEcom.value) return [
    { name: 'Diane', role: 'Boutique Mode', quote: 'Les drops se vendent plus vite via liens WhatsApp.' },
    { name: 'Marc', role: 'Électronique', quote: 'Meilleurs suivis de livraison, moins de retours.' },
    { name: 'Laura', role: 'Bijoux', quote: 'Rendez-vous showroom réservés en quelques messages.' }
  ]
  return [
    { name: 'Nadia', role: 'Salon', quote: 'Le no‑show a chuté grâce aux rappels.' },
    { name: 'Yann', role: 'Imprimerie', quote: 'Devis plus rapides et moins d’erreurs de fichier.' },
    { name: 'Patrick', role: 'Éducation', quote: 'Meilleure communication avec les parents.' }
  ]
})

 
</script>
