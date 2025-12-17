<template>
  <div class="bg-white">
    <!-- Header -->
    <MarketingHeader />

    <!-- Hero -->
    <div class="relative isolate px-6 pt-14 lg:px-8">
      <div class="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-center">
        <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Plans simples et transparents
        </h1>
        <p class="mt-6 text-lg leading-8 text-gray-600">
          Choisissez le plan qui convient à votre entreprise. Changez ou annulez à tout moment.
        </p>
      </div>
    </div>

    <!-- Pricing -->
    <div class="py-24 sm:pt-32">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="isolate grid max-w-md grid-cols-1 gap-8 mx-auto mt-10 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          <!-- Free -->
          <div class="rounded-3xl p-8 ring-1 ring-gray-200 xl:p-10">
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
          <div class="rounded-3xl p-8 ring-1 ring-gray-200 bg-gray-900 text-white xl:p-10 lg:mt-0 lg:scale-105 shadow-xl">
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
            <NuxtLink to="/auth/register" class="mt-8 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500 bg-green-500 hover:bg-green-400 text-white shadow-sm">Essayer Premium</NuxtLink>
          </div>

          <!-- Business -->
          <div class="rounded-3xl p-8 ring-1 ring-gray-200 xl:p-10">
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
    
    <MarketingFooter />
  </div>
</template>

<script setup>
import { Check } from 'lucide-vue-next'

useHead({
  title: 'Tarifs | Wa-Shop Cameroun',
  meta: [
    { name: 'description', content: 'Des plans tarifaires flexibles pour tous les types d\'entreprises au Cameroun.' }
  ]
})
</script>
