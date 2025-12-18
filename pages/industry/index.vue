<template>
  <div class="bg-white">
    <MarketingHeader />

    <div class="relative isolate px-6 pt-14 lg:px-8 bg-gradient-to-b from-indigo-50 to-white">
      <div class="mx-auto max-w-2xl py-24 sm:py-40 text-center">
        <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600">
          Secteurs d’activité
        </h1>
        <p class="mt-6 text-lg leading-8 text-gray-700">
          Découvrez comment Wa-Shop aide chaque type d’entreprise à transformer WhatsApp en canal de vente rentable.
        </p>
      </div>
      <div class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
        <div class="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#c4b5fd] to-[#6366f1] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
      </div>
    </div>

    <div class="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
      <div class="mx-auto max-w-2xl text-center">
        <div class="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-100">
          <span>Secteurs couverts</span>
        </div>
        <p class="mt-4 text-base leading-7 text-gray-600">
          Choisissez votre secteur pour voir une expérience détaillée, des cas d’usage concrets et des écrans WhatsApp adaptés.
        </p>
      </div>

      <div class="mt-10 flex justify-center">
        <div class="inline-flex rounded-full border border-gray-200 bg-gray-50 p-1 text-xs font-medium text-gray-600">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            type="button"
            :class="[
              'relative rounded-full px-3 py-1.5 transition text-sm',
              activeFilter === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            ]"
            @click="activeFilter = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <div class="mt-12 lg:grid lg:grid-cols-3 md:grid-cols-2 lg:gap-8 flex gap-6 overflow-x-auto snap-x snap-mandatory px-1">
        <NuxtLink
          v-for="i in filtered"
          :key="i.slug"
          :to="`/industry/${i.slug}`"
          class="group flex flex-col rounded-3xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg transition-shadow snap-center min-w-[320px]"
        >
          <div class="flex items-start gap-4">
            <div :class="['h-10 w-10 rounded-xl flex items-center justify-center text-xs font-semibold text-white', groupColor(i.group)]">
              {{ groupShort(i.group) }}
            </div>
            <div>
              <h2 class="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                {{ i.title }}
              </h2>
              <p class="mt-1 text-sm text-gray-600">
                {{ i.lead }}
              </p>
            </div>
          </div>
          <p class="mt-3 text-xs text-gray-500 line-clamp-2">
            {{ i.subtitle }}
          </p>

          <div class="mt-5 flex-1 flex flex-col gap-4">
            <div class="flex flex-wrap gap-2">
              <span
                v-for="b in i.benefits"
                :key="b"
                class="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-1 text-[11px] text-gray-700 ring-1 ring-gray-100"
              >
                {{ b }}
              </span>
            </div>
            <div class="flex items-end justify-between gap-4 mt-auto">
              <div class="flex flex-col text-xs text-gray-500">
                <span v-if="i.kpis[0]">{{ i.kpis[0].label }}: <span class="font-semibold text-gray-900">{{ i.kpis[0].value }}</span></span>
                <span v-if="i.kpis[1]">{{ i.kpis[1].label }}: <span class="font-semibold text-gray-900">{{ i.kpis[1].value }}</span></span>
              </div>
              <div class="relative border-gray-800 bg-gray-800 border-[10px] rounded-3xl h-[160px] w-[90px] shadow-lg shrink-0">
                <div class="w-[56px] h-[10px] bg-gray-800 top-0 rounded-b-lg left-1/2 -translate-x-1/2 absolute"></div>
                <div class="rounded-2xl overflow-hidden w-[70px] h-[138px] bg-white mt-2 mx-auto">
                  <div :class="['text-[9px] text-white px-2 py-1.5 flex justify-between items-center', groupHeaderColor(i.group)]">
                    <span class="font-semibold truncate">{{ i.phoneHeader }}</span>
                    <span class="opacity-80">{{ i.phoneStatus }}</span>
                  </div>
                  <div class="p-2 bg-gray-50 h-full">
                    <div v-if="i.group === 'food'" class="space-y-1.5">
                      <div v-for="n in 3" :key="n" class="flex gap-1">
                        <div class="h-8 w-8 rounded bg-gray-200"></div>
                        <div class="flex-1 space-y-1">
                          <div class="h-2 w-5/6 bg-gray-300 rounded"></div>
                          <div :class="['h-2 w-1/2 rounded', groupBadgeColor(i.group)]"></div>
                        </div>
                      </div>
                    </div>
                    <div v-else-if="i.group === 'ecom'" class="space-y-1.5">
                      <div class="flex gap-1 mb-1">
                        <div class="h-3 w-8 rounded-full bg-gray-200"></div>
                        <div class="h-3 w-8 rounded-full bg-gray-200"></div>
                      </div>
                      <div class="grid grid-cols-2 gap-1.5">
                        <div v-for="n in 4" :key="n" class="bg-white rounded p-1 shadow-sm">
                          <div class="h-6 bg-gray-200 rounded mb-1"></div>
                          <div :class="['h-2 w-3/4 rounded', groupBadgeColor(i.group)]"></div>
                        </div>
                      </div>
                    </div>
                    <div v-else class="space-y-1.5">
                      <div class="bg-white rounded p-1 shadow-sm">
                        <div class="h-2 w-3/4 bg-gray-300 rounded mb-1"></div>
                        <div class="h-2 w-1/2 bg-gray-200 rounded"></div>
                      </div>
                      <div class="bg-white rounded p-1 shadow-sm">
                        <div class="h-2 w-2/3 bg-gray-300 rounded mb-1"></div>
                        <div class="h-2 w-1/3 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-5 flex items-center justify-between text-sm font-semibold text-indigo-600">
            <span>Voir le détail</span>
            <span aria-hidden="true">→</span>
          </div>
        </NuxtLink>
      </div>

      <div class="mx-auto mt-16 max-w-2xl text-center mb-24 lg:mb-16">
        <h2 class="text-2xl font-bold tracking-tight text-gray-900">Vous ne trouvez pas votre secteur ?</h2>
        <p class="mt-3 text-base leading-7 text-gray-600">
          Wa-Shop s’adapte à de nombreux cas d’usage au Cameroun. Contactez-nous pour valider ensemble le meilleur scénario pour votre activité.
        </p>
        <div class="mt-8 flex justify-center gap-4">
          <NuxtLink
            to="/auth/register"
            class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Commencer gratuitement
          </NuxtLink>
          <a href="mailto:contact@wa-shop.cm" class="text-sm font-semibold leading-6 text-gray-900">
            Discuter avec l’équipe →
          </a>
        </div>
      </div>

      <div class="fixed bottom-4 left-4 right-4 lg:hidden z-40">
        <div class="flex items-center justify-between rounded-full bg-white/90 backdrop-blur px-3 py-2 shadow-lg border border-gray-200">
          <div class="text-xs text-gray-700">
            Secteurs d’activité
          </div>
          <div class="flex gap-2">
            <NuxtLink to="/pricing" class="rounded-full px-3 py-1.5 text-[11px] font-semibold text-gray-900 ring-1 ring-gray-200">Tarifs</NuxtLink>
            <NuxtLink to="/auth/register" class="rounded-full px-3 py-1.5 text-[11px] font-bold text-white bg-indigo-600">Créer un compte</NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <MarketingFooter />
  </div>
</template>

<script setup>
import { industryContent } from '~/data/industry.js'

const FOOD_SLUGS = new Set(['restaurants','cafes','home-based-food-business','bakery-pastry','catering-meal-subscription','hotel-bars-restaurants','grocer-butcher','b2b-wholesale'])
const ECOM_SLUGS = new Set(['ecommerce','fashion-apparel','pharmacies-health','mobile-electronics','digital-products-services','popup-event-store','personal-shopping','jewelry-accessories','religious-community'])

const tabs = [
  { id: 'all', label: 'Tous les secteurs' },
  { id: 'food', label: 'Food Business' },
  { id: 'ecom', label: 'Ecommerce' },
  { id: 'services', label: 'Services' }
]

const activeFilter = ref('all')

const industries = computed(() => {
  return Object.entries(industryContent).map(([slug, c]) => {
    let group = 'services'
    if (FOOD_SLUGS.has(slug)) group = 'food'
    else if (ECOM_SLUGS.has(slug)) group = 'ecom'
    return {
      slug,
      group,
      title: c.title,
      lead: c.lead,
      subtitle: c.subtitle,
      benefits: c.benefits ? c.benefits.slice(0, 3) : [],
      kpis: c.kpis || [],
      phoneHeader: c.title,
      phoneStatus: group === 'food' ? 'Ouvert' : group === 'ecom' ? 'En ligne' : 'Disponible'
    }
  })
})

const filtered = computed(() => {
  if (activeFilter.value === 'all') return industries.value
  return industries.value.filter(i => i.group === activeFilter.value)
})

const groupColor = (group) => {
  if (group === 'food') return 'bg-indigo-600'
  if (group === 'ecom') return 'bg-blue-600'
  return 'bg-purple-600'
}

const groupHeaderColor = (group) => {
  if (group === 'food') return 'bg-indigo-600'
  if (group === 'ecom') return 'bg-blue-600'
  return 'bg-purple-600'
}

const groupBadgeColor = (group) => {
  if (group === 'food') return 'bg-indigo-600'
  if (group === 'ecom') return 'bg-blue-500'
  return 'bg-purple-500'
}

const groupShort = (group) => {
  if (group === 'food') return 'Food'
  if (group === 'ecom') return 'Ecom'
  return 'Srv'
}

useHead({
  title: 'Secteurs d’activité | Wa-Shop Cameroun',
  meta: [
    { name: 'description', content: 'Découvrez les secteurs couverts par Wa-Shop Cameroun : restauration, ecommerce, services et plus encore, avec des expériences WhatsApp adaptées.' },
    { property: 'og:title', content: 'Secteurs d’activité | Wa-Shop Cameroun' },
    { property: 'og:description', content: 'Parcourez les cas d’usage Wa-Shop par secteur et découvrez comment vendre mieux sur WhatsApp.' },
    { property: 'og:image', content: '/og-industry-index.jpg' },
    { name: 'twitter:card', content: 'summary_large_image' }
  ]
})
</script>
