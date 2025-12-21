<template>
  <div class="bg-white">
    <!-- Header -->
    <MarketingHeader />

    <!-- Hero with Gradient -->
    <div class="relative isolate px-6 pt-14 lg:px-8 bg-gradient-to-b from-green-50 to-white">
      <div class="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-center">
        <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600">
          Plans simples et transparents
        </h1>
        <p class="mt-6 text-lg leading-8 text-gray-600">
          Choisissez le plan qui convient à votre entreprise. Changez ou annulez à tout moment.
        </p>
      </div>
      
      <!-- Decorative Gradient Blurs -->
      <div class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
        <div class="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#80ff8c] to-[#047857] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
      </div>
    </div>

    <!-- Pricing -->
    <div class="py-24 sm:pt-32">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="isolate grid max-w-md grid-cols-1 gap-8 mx-auto mt-10 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          <!-- Free -->
          <div class="rounded-3xl p-8 ring-1 ring-gray-200 xl:p-10 hover:shadow-lg transition-shadow duration-300">
            <h3 class="text-lg font-semibold leading-8 text-gray-900">Gratuit</h3>
            <p class="mt-4 text-sm leading-6 text-gray-600">Pour démarrer votre activité en ligne.</p>
            <p class="mt-6 flex items-baseline gap-x-1">
              <span class="text-4xl font-bold tracking-tight text-gray-900">0</span>
              <span class="text-sm font-semibold leading-6 text-gray-600">FCFA / mois</span>
            </p>
            <ul role="list" class="mt-8 space-y-3 text-sm leading-6 text-gray-600">
              <li class="flex gap-x-3"><Check class="h-6 w-5 flex-none text-green-600" /> Commandes WhatsApp illimitées</li>
              <li class="flex gap-x-3"><Check class="h-6 w-5 flex-none text-green-600" /> Jusqu'à 20 produits</li>
              <li class="flex gap-x-3"><Check class="h-6 w-5 flex-none text-green-600" /> Sous-domaine wa-shop.cm</li>
            </ul>
            <NuxtLink to="/auth/register" class="mt-8 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 ring-1 ring-inset ring-green-200 hover:ring-green-300 text-green-600 hover:bg-green-50">Commencer gratuitement</NuxtLink>
          </div>

          <!-- Premium -->
          <div class="rounded-3xl p-8 ring-1 ring-gray-200 bg-gray-900 text-white xl:p-10 lg:mt-0 lg:scale-105 shadow-xl relative overflow-hidden">
            <!-- Gradient Overlay -->
            <div class="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 -z-10"></div>
            <div class="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-green-500 blur-2xl opacity-20 rounded-full"></div>
            
            <h3 class="text-lg font-semibold leading-8 text-white">Premium</h3>
            <p class="mt-4 text-sm leading-6 text-gray-300">Pour les entreprises en pleine croissance.</p>
            <p class="mt-6 flex items-baseline gap-x-1">
              <span class="text-4xl font-bold tracking-tight text-white">5,000</span>
              <span class="text-sm font-semibold leading-6 text-gray-300">FCFA / mois</span>
            </p>
            <ul role="list" class="mt-8 space-y-3 text-sm leading-6 text-gray-300">
              <li class="flex gap-x-3"><Check class="h-6 w-5 flex-none text-green-400" /> Produits illimités</li>
              <li class="flex gap-x-3"><Check class="h-6 w-5 flex-none text-green-400" /> Statistiques avancées</li>
              <li class="flex gap-x-3"><Check class="h-6 w-5 flex-none text-green-400" /> Codes promo</li>
              <li class="flex gap-x-3"><Check class="h-6 w-5 flex-none text-green-400" /> Export CRM clients</li>
              <li class="flex gap-x-3"><Check class="h-6 w-5 flex-none text-green-400" /> Support prioritaire</li>
            </ul>
            <NuxtLink to="/auth/register" class="mt-8 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white shadow-lg transition-all transform hover:scale-105">Essayer Premium</NuxtLink>
          </div>

          <!-- Business -->
          <div class="rounded-3xl p-8 ring-1 ring-gray-200 xl:p-10 hover:shadow-lg transition-shadow duration-300">
            <h3 class="text-lg font-semibold leading-8 text-gray-900">Business</h3>
            <p class="mt-4 text-sm leading-6 text-gray-600">Pour les grandes structures et franchises.</p>
            <p class="mt-6 flex items-baseline gap-x-1">
              <span class="text-4xl font-bold tracking-tight text-gray-900">25,000</span>
              <span class="text-sm font-semibold leading-6 text-gray-600">FCFA / mois</span>
            </p>
            <ul role="list" class="mt-8 space-y-3 text-sm leading-6 text-gray-600">
              <li class="flex gap-x-3"><Check class="h-6 w-5 flex-none text-green-600" /> Tout ce qui est dans Premium</li>
              <li class="flex gap-x-3"><Check class="h-6 w-5 flex-none text-green-600" /> Nom de domaine personnalisé</li>
              <li class="flex gap-x-3"><Check class="h-6 w-5 flex-none text-green-600" /> Multi-magasins (jusqu'à 3)</li>
              <li class="flex gap-x-3"><Check class="h-6 w-5 flex-none text-green-600" /> Marque blanche (sans logo Wa-Shop)</li>
            </ul>
            <NuxtLink to="/auth/register" class="mt-8 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 ring-1 ring-inset ring-green-200 hover:ring-green-300 text-green-600 hover:bg-green-50">Contacter les ventes</NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Phone Preview Section -->
    <div class="overflow-hidden bg-white py-24 sm:py-32">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div class="lg:pr-8 lg:pt-4">
            <div class="lg:max-w-lg">
              <h2 class="text-base font-semibold leading-7 text-green-600">Mobile First</h2>
              <p class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Votre boutique dans la poche de vos clients</p>
              <p class="mt-6 text-lg leading-8 text-gray-600">
                Wa-Shop est conçu pour offrir une expérience d'achat fluide sur mobile. Vos clients parcourent vos produits et commandent directement sur WhatsApp.
              </p>
              <dl class="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                <div class="relative pl-9">
                  <dt class="inline font-semibold text-gray-900">
                    <Check class="absolute left-1 top-1 h-5 w-5 text-green-600" />
                    Chargement instantané
                  </dt>
                  <dd class="inline">. Pas d'application à télécharger pour vos clients.</dd>
                </div>
                <div class="relative pl-9">
                  <dt class="inline font-semibold text-gray-900">
                    <Check class="absolute left-1 top-1 h-5 w-5 text-green-600" />
                    Interface intuitive
                  </dt>
                  <dd class="inline">. Une navigation simple adaptée aux petits écrans.</dd>
                </div>
              </dl>
            </div>
          </div>
          <!-- CSS Phone Mockup -->
          <div class="flex items-center justify-center">
             <div class="relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
                <div class="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"></div>
                <div class="h-[32px] w-[3px] bg-gray-800 absolute -left-[17px] top-[72px] rounded-l-lg"></div>
                <div class="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
                <div class="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
                <div class="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
                <div class="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-white">
                    <!-- Screen Content -->
                    <div class="flex flex-col h-full">
                       <!-- App Header -->
                       <div class="bg-green-600 text-white p-4 pt-8 shadow-sm">
                          <div class="font-bold text-lg">Ma Boutique</div>
                          <div class="text-xs opacity-90">En ligne</div>
                       </div>
                       <!-- Products Grid -->
                       <div class="flex-1 overflow-y-auto p-3 bg-gray-50">
                          <div class="grid grid-cols-2 gap-3">
                             <!-- Fake Product 1 -->
                             <div class="bg-white p-2 rounded-lg shadow-sm">
                                <div class="bg-gray-200 h-24 rounded-md mb-2"></div>
                                <div class="h-3 w-3/4 bg-gray-300 rounded mb-1"></div>
                                <div class="h-3 w-1/2 bg-green-500 rounded"></div>
                             </div>
                             <!-- Fake Product 2 -->
                             <div class="bg-white p-2 rounded-lg shadow-sm">
                                <div class="bg-gray-200 h-24 rounded-md mb-2"></div>
                                <div class="h-3 w-3/4 bg-gray-300 rounded mb-1"></div>
                                <div class="h-3 w-1/2 bg-green-500 rounded"></div>
                             </div>
                             <!-- Fake Product 3 -->
                             <div class="bg-white p-2 rounded-lg shadow-sm">
                                <div class="bg-gray-200 h-24 rounded-md mb-2"></div>
                                <div class="h-3 w-3/4 bg-gray-300 rounded mb-1"></div>
                                <div class="h-3 w-1/2 bg-green-500 rounded"></div>
                             </div>
                             <!-- Fake Product 4 -->
                             <div class="bg-white p-2 rounded-lg shadow-sm">
                                <div class="bg-gray-200 h-24 rounded-md mb-2"></div>
                                <div class="h-3 w-3/4 bg-gray-300 rounded mb-1"></div>
                                <div class="h-3 w-1/2 bg-green-500 rounded"></div>
                             </div>
                          </div>
                       </div>
                       <!-- Bottom Bar -->
                       <div class="bg-white border-t p-3 flex justify-between items-center">
                          <div class="text-sm font-semibold">2 Articles</div>
                          <div class="bg-green-600 text-white px-4 py-1.5 rounded-full text-xs font-bold">Commander via WhatsApp</div>
                       </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <MarketingFooter />
  </div>
</template>

<script setup>
import { Check } from 'lucide-vue-next'

useHead({
  title: 'Tarifs et Plans | Wa-Shop',
  meta: [
    { name: 'description', content: 'Découvrez nos offres pour créer votre boutique WhatsApp. Plan gratuit disponible, sans carte de crédit requise.' },
    { property: 'og:title', content: 'Tarifs et Plans | Wa-Shop' },
    { property: 'og:description', content: 'Créez votre boutique en ligne dès aujourd\'hui. Plans adaptés à tous les budgets.' },
    { property: 'og:image', content: '/og-pricing.jpg' }, // Placeholder for OG image
    { name: 'twitter:card', content: 'summary_large_image' }
  ]
})
</script>
