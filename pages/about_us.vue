<template>
  <div class="bg-white">
    <!-- Header -->
    <MarketingHeader />

    <!-- Hero with Gradient -->
    <div class="relative isolate px-6 pt-14 lg:px-8 bg-gradient-to-b from-green-50 to-white">
      <div class="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-center">
        <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600">
          {{ t('about.heroTitle') }}
        </h1>
        <p class="mt-6 text-lg leading-8 text-gray-600">
          {{ t('about.heroSubtitle') }}
        </p>
      </div>
      
      <!-- Decorative Gradient Blurs -->
      <div class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
        <div class="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#4ade80] to-[#22c55e] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
      </div>
    </div>

    <!-- Mission & Phone Visual -->
    <div class="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <!-- Mission Text -->
        <div>
           <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-6">{{ t('about.missionTitle') }}</h2>
           <p class="text-lg leading-8 text-gray-600 mb-6">
             {{ t('about.missionP1') }}
           </p>
           <p class="text-lg leading-8 text-gray-600">
             {{ t('about.missionP2') }}
           </p>
        </div>
        
        <!-- Phone Mockup: Merchant Dashboard -->
        <div class="flex justify-center lg:justify-end">
            <div class="relative border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                <div class="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
                <div class="h-[32px] w-[3px] bg-gray-800 absolute -left-[17px] top-[72px] rounded-l-lg"></div>
                <div class="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
                <div class="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
                <div class="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
                <div class="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-gray-50">
                    <!-- Screen Content: Admin Dashboard -->
                    <div class="flex flex-col h-full">
                       <!-- Header -->
                       <div class="bg-white p-4 pt-8 shadow-sm border-b flex justify-between items-center">
                          <div class="font-bold text-gray-800">{{ t('about.phoneStoreTitle') }}</div>
                          <div class="h-8 w-8 bg-gray-200 rounded-full"></div>
                       </div>
                       
                       <div class="p-4 space-y-4">
                          <!-- Stats Card -->
                          <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                             <div class="text-xs text-gray-500 uppercase font-semibold">{{ t('about.phoneSalesToday') }}</div>
                             <div class="text-2xl font-bold text-gray-900 mt-1">15,000 FCFA</div>
                             <div class="text-xs text-green-600 mt-1 flex items-center gap-1">
                                <span>↑ 12%</span> depuis hier
                             </div>
                          </div>
                          
                          <!-- Chart Placeholder -->
                          <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 h-32 flex items-end justify-between px-2 pb-2">
                             <div class="w-2 bg-green-100 h-1/3 rounded-t"></div>
                             <div class="w-2 bg-green-200 h-1/2 rounded-t"></div>
                             <div class="w-2 bg-green-300 h-2/3 rounded-t"></div>
                             <div class="w-2 bg-green-400 h-1/2 rounded-t"></div>
                             <div class="w-2 bg-green-500 h-3/4 rounded-t"></div>
                             <div class="w-2 bg-green-600 h-full rounded-t"></div>
                             <div class="w-2 bg-green-500 h-2/3 rounded-t"></div>
                          </div>
                          
                          <!-- Recent Orders -->
                          <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                             <div class="px-4 py-3 border-b border-gray-50 font-semibold text-sm">{{ t('about.phoneRecentOrders') }}</div>
                             <div class="divide-y divide-gray-50">
                                <div class="px-4 py-3 flex justify-between items-center">
                                   <div>
                                      <div class="text-sm font-medium">Jean Dupont</div>
                                      <div class="text-xs text-gray-500">2 articles</div>
                                   </div>
                                   <div class="text-sm font-bold">5,000 F</div>
                                </div>
                                <div class="px-4 py-3 flex justify-between items-center">
                                   <div>
                                      <div class="text-sm font-medium">Marie Claire</div>
                                      <div class="text-xs text-gray-500">1 article</div>
                                   </div>
                                   <div class="text-sm font-bold">2,500 F</div>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
      
      <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
        <dl class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
          <div class="flex flex-col bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <dt class="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
              <div class="h-10 w-10 flex items-center justify-center rounded-lg bg-green-600">
                <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              {{ t('about.card1Title') }}
            </dt>
            <dd class="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
              <p class="flex-auto">{{ t('about.card1Desc') }}</p>
            </dd>
          </div>
          <div class="flex flex-col bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <dt class="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
              <div class="h-10 w-10 flex items-center justify-center rounded-lg bg-blue-600">
                <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                </svg>
              </div>
              {{ t('about.card2Title') }}
            </dt>
            <dd class="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
              <p class="flex-auto">{{ t('about.card2Desc') }}</p>
            </dd>
          </div>
          <div class="flex flex-col bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <dt class="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
              <div class="h-10 w-10 flex items-center justify-center rounded-lg bg-purple-600">
                <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.746 3.746 0 0121 12z" />
                </svg>
              </div>
              {{ t('about.card3Title') }}
            </dt>
            <dd class="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
              <p class="flex-auto">{{ t('about.card3Desc') }}</p>
            </dd>
          </div>
        </dl>
      </div>
    </div>

    <!-- Contact & CTA Section -->
    <div class="bg-white pb-24 sm:pb-32">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-2xl text-center border-t border-gray-100 pt-16">
          <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{{ t('about.ctaTitle') }}</h2>
          <p class="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
            {{ t('about.ctaDesc') }}
          </p>
          <div class="mt-10 flex items-center justify-center gap-x-6">
            <NuxtLink to="/auth/register" class="rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600">{{ t('about.ctaStart') }}</NuxtLink>
            <a href="mailto:contact@wa-shop.cm" class="text-sm font-semibold leading-6 text-gray-900">{{ t('about.ctaContact') }} <span aria-hidden="true">→</span></a>
          </div>
        </div>
        
        <!-- Contact Info Grid -->
        <div class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 text-base leading-7 sm:grid-cols-2 sm:gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-4">
            <div>
                <h3 class="border-l border-green-600 pl-6 font-semibold text-gray-900">{{ t('about.officeTitle') }}</h3>
                <address class="border-l border-gray-200 pl-6 pt-2 not-italic text-gray-600">
                    <p>Douala, Cameroun</p>
                    <p>Akwa, Blvd de la Liberté</p>
                </address>
            </div>
            <div>
                <h3 class="border-l border-green-600 pl-6 font-semibold text-gray-900">{{ t('about.contactTitle') }}</h3>
                <address class="border-l border-gray-200 pl-6 pt-2 not-italic text-gray-600">
                    <p>contact@wa-shop.cm</p>
                    <p>+237 699 00 00 00</p>
                </address>
            </div>
             <div>
                <h3 class="border-l border-green-600 pl-6 font-semibold text-gray-900">{{ t('about.supportTitle') }}</h3>
                <address class="border-l border-gray-200 pl-6 pt-2 not-italic text-gray-600">
                    <p>support@wa-shop.cm</p>
                    <p>24/7 via WhatsApp</p>
                </address>
            </div>
             <div>
                <h3 class="border-l border-green-600 pl-6 font-semibold text-gray-900">{{ t('about.hoursTitle') }}</h3>
                <address class="border-l border-gray-200 pl-6 pt-2 not-italic text-gray-600">
                    <p>{{ t('about.hoursDays') }}</p>
                    <p>{{ t('about.hoursTime') }}</p>
                </address>
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
  title: 'À propos de nous | Wa-Shop',
  meta: [
    { name: 'description', content: 'Wa-Shop aide les entreprises à vendre en ligne simplement via WhatsApp. Découvrez notre mission et nos valeurs.' },
    { property: 'og:title', content: 'À propos de nous | Wa-Shop' },
    { property: 'og:description', content: 'Simplifier le commerce en ligne. Une mission, une équipe, une solution pour tous.' },
    { property: 'og:image', content: '/og-about.jpg' },
    { name: 'twitter:card', content: 'summary_large_image' }
  ]
})
</script>
