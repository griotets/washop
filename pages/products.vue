<template>
  <div class="bg-white">
    <!-- Header -->
    <MarketingHeader />

    <!-- Hero with Gradient -->
    <div class="relative isolate px-6 pt-14 lg:px-8 bg-gradient-to-b from-green-50 to-white">
      <div class="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-center">
        <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600">
          Nos Solutions
        </h1>
        <p class="mt-6 text-lg leading-8 text-gray-600">
          Des outils puissants pour vendre, automatiser et engager vos clients sur leurs canaux préférés.
        </p>
      </div>
      
      <!-- Decorative Gradient Blurs -->
      <div class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
        <div class="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#4ade80] to-[#22c55e] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
      </div>
    </div>

    <!-- Products Grid -->
    <div class="py-24 sm:py-32">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-2xl lg:text-center">
          <h2 class="text-base font-semibold leading-7 text-green-600">Écosystème</h2>
          <p class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Tout pour réussir votre commerce conversationnel</p>
          <p class="mt-6 text-lg leading-8 text-gray-600">
            Une suite complète d'outils interconnectés pour gérer votre activité de A à Z.
          </p>
        </div>
        <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl class="lg:grid lg:max-w-none lg:grid-cols-2 lg:gap-x-8 lg:gap-y-16 flex gap-6 overflow-x-auto snap-x snap-mandatory px-1">
            <!-- Product 1: WhatsApp Order -->
            <div class="flex flex-col bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group snap-center min-w-[300px]">
              <dt class="flex items-center gap-x-3 text-xl font-bold leading-7 text-gray-900">
                <div class="h-12 w-12 flex items-center justify-center rounded-xl bg-green-100 group-hover:bg-green-600 transition-colors duration-300">
                  <ShoppingCart class="h-6 w-6 text-green-600 group-hover:text-white transition-colors duration-300" />
                </div>
                Commande WhatsApp
              </dt>
              <dd class="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p class="flex-auto">Transformez votre catalogue en boutique WhatsApp. Vos clients remplissent leur panier et vous envoient la commande directement dans une conversation.</p>
                <div class="mt-6">
                  <NuxtLink to="/products/whatsapp-order" class="text-sm font-semibold leading-6 text-green-600 hover:text-green-500">En savoir plus <span aria-hidden="true">→</span></NuxtLink>
                </div>
              </dd>
            </div>

            <!-- Product 2: WhatsApp Business API -->
            <div class="flex flex-col bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group snap-center min-w-[300px]">
              <dt class="flex items-center gap-x-3 text-xl font-bold leading-7 text-gray-900">
                <div class="h-12 w-12 flex items-center justify-center rounded-xl bg-green-100 group-hover:bg-green-600 transition-colors duration-300">
                  <Share2 class="h-6 w-6 text-green-600 group-hover:text-white transition-colors duration-300" />
                </div>
                API WhatsApp Business
              </dt>
              <dd class="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p class="flex-auto">Connectez votre CRM, envoyez des notifications automatiques et gérez des milliers de conversations avec l'API officielle WhatsApp.</p>
                <div class="mt-6">
                  <NuxtLink to="/products/whatsapp-business-api" class="text-sm font-semibold leading-6 text-green-600 hover:text-green-500">En savoir plus <span aria-hidden="true">→</span></NuxtLink>
                </div>
              </dd>
            </div>

            <!-- Product 3: Chatbot -->
            <div class="flex flex-col bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group snap-center min-w-[300px]">
              <dt class="flex items-center gap-x-3 text-xl font-bold leading-7 text-gray-900">
                <div class="h-12 w-12 flex items-center justify-center rounded-xl bg-purple-100 group-hover:bg-purple-600 transition-colors duration-300">
                  <Bot class="h-6 w-6 text-purple-600 group-hover:text-white transition-colors duration-300" />
                </div>
                Chatbot Intelligent
              </dt>
              <dd class="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p class="flex-auto">Automatisez votre service client 24/7. Répondez aux questions fréquentes et guidez vos clients vers l'achat sans intervention humaine.</p>
                <div class="mt-6">
                  <NuxtLink to="/products/chatbot" class="text-sm font-semibold leading-6 text-purple-600 hover:text-purple-500">En savoir plus <span aria-hidden="true">→</span></NuxtLink>
                </div>
              </dd>
            </div>

            <!-- Product 4: Telegram Order -->
            <div class="flex flex-col bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group snap-center min-w-[300px]">
              <dt class="flex items-center gap-x-3 text-xl font-bold leading-7 text-gray-900">
                <div class="h-12 w-12 flex items-center justify-center rounded-xl bg-sky-100 group-hover:bg-sky-600 transition-colors duration-300">
                  <Send class="h-6 w-6 text-sky-600 group-hover:text-white transition-colors duration-300" />
                </div>
                Commande Telegram
              </dt>
              <dd class="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p class="flex-auto">Profitez de la puissance des canaux Telegram. Vendez vos produits directement à votre communauté avec une expérience d'achat fluide.</p>
                <div class="mt-6">
                  <NuxtLink to="/products/telegram-order" class="text-sm font-semibold leading-6 text-sky-600 hover:text-sky-500">En savoir plus <span aria-hidden="true">→</span></NuxtLink>
                </div>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>

    <div class="bg-purple-900 py-16 sm:py-24">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto max-w-2xl text-center">
          <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">Prêt à digitaliser votre commerce ?</h2>
          <p class="mx-auto mt-6 max-w-xl text-lg leading-8 text-purple-200">
            Commencez gratuitement dès aujourd'hui. Aucune carte de crédit requise.
          </p>
          <div class="mt-10 flex items-center justify-center gap-x-6">
            <NuxtLink to="/auth/register" class="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-purple-900 shadow-sm hover:bg-purple-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Créer mon compte</NuxtLink>
            <NuxtLink to="/pricing" class="text-sm font-semibold leading-6 text-white">Voir les tarifs <span aria-hidden="true">→</span></NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <MarketingFooter />

    <div class="fixed bottom-4 left-4 right-4 lg:hidden z-40">
      <div class="flex items-center justify-between rounded-full bg-white/90 backdrop-blur px-3 py-2 shadow-lg border border-gray-200">
        <div class="text-xs text-gray-700">
          Nos solutions WhatsApp
        </div>
        <div class="flex gap-2">
          <NuxtLink to="/pricing" class="rounded-full px-3 py-1.5 text-[11px] font-semibold text-gray-900 ring-1 ring-gray-200">Tarifs</NuxtLink>
          <NuxtLink to="/auth/register" class="rounded-full px-3 py-1.5 text-[11px] font-bold text-white bg-purple-600">Créer un compte</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ShoppingCart, Share2, Bot, Send } from 'lucide-vue-next'

useHead({
  title: 'Nos Produits | Wa-Shop Cameroun',
  meta: [
    { name: 'description', content: 'Découvrez notre suite d\'outils pour le commerce conversationnel : Boutique WhatsApp, API Business, Chatbot et Telegram.' },
    { property: 'og:title', content: 'Nos Produits | Wa-Shop Cameroun' },
    { property: 'og:description', content: 'Tout pour vendre sur WhatsApp et Telegram. Solutions simples et efficaces.' },
    { property: 'og:image', content: '/og-products.jpg' },
    { name: 'twitter:card', content: 'summary_large_image' }
  ]
})
</script>
