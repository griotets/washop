<template>
  <header class="sticky top-0 z-50 bg-white/85 backdrop-blur border-b">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
      <NuxtLink to="/" class="flex items-center gap-2">
        <img src="/logo.svg" alt="Wa-Shop" class="h-8 w-8" />
        <span class="font-semibold text-lg">Wa-Shop</span>
      </NuxtLink>
      <nav class="hidden items-center gap-6 md:flex">
        <div class="relative" @mouseenter="pdOpen=true" @mouseleave="pdOpen=false">
          <button class="inline-flex items-center gap-1 text-gray-700 hover:text-primary">
            <span>{{ t('nav.products') }}</span>
            <ChevronDown class="h-4 w-4" />
          </button>
          <div v-if="pdOpen" class="absolute left-0 mt-2 w-64 rounded-xl border bg-white p-2 shadow-lg">
            <NuxtLink to="/products/whatsapp-order" class="flex items-center gap-2 rounded px-3 py-2 text-gray-700 hover:bg-gray-100" @click="pdOpen=false">{{ t('nav.products.whatsappOrder') }}</NuxtLink>
            <NuxtLink to="/products/whatsapp-business-api" class="flex items-center gap-2 rounded px-3 py-2 text-gray-700 hover:bg-gray-100" @click="pdOpen=false">{{ t('nav.products.whatsappBusinessApi') }}</NuxtLink>
            <NuxtLink to="/products/chatbot" class="flex items-center gap-2 rounded px-3 py-2 text-gray-700 hover:bg-gray-100" @click="pdOpen=false">{{ t('nav.products.chatbot') }}</NuxtLink>
            <NuxtLink to="/products/telegram-order" class="flex items-center gap-2 rounded px-3 py-2 text-gray-700 hover:bg-gray-100" @click="pdOpen=false">{{ t('nav.products.telegramOrder') }}</NuxtLink>
          </div>
        </div>
        <div class="relative" @mouseenter="inOpen=true" @mouseleave="inOpen=false">
          <button class="inline-flex items-center gap-1 text-gray-700 hover:text-primary" :aria-expanded="inOpen">
            <span>{{ t('nav.industry') }}</span>
            <ChevronDown class="h-4 w-4" />
          </button>
          <div v-if="inOpen" class="absolute left-0 mt-2 w-[90vw] max-w-md md:max-w-2xl lg:max-w-3xl rounded-2xl border bg-white p-4 shadow-xl">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              <div>
                <div class="text-sm font-semibold text-gray-500">{{ t('nav.group.food') }}</div>
                <div class="mt-2 flex flex-col">
                  <NuxtLink to="/industry/restaurants" class="rounded px-2 py-1 hover:bg-gray-100">Restaurants</NuxtLink>
                  <NuxtLink to="/industry/cafes" class="rounded px-2 py-1 hover:bg-gray-100">Cafes</NuxtLink>
                  <NuxtLink to="/industry/home-based-food-business" class="rounded px-2 py-1 hover:bg-gray-100">Home-Based Food Business</NuxtLink>
                  <NuxtLink to="/industry/bakery-pastry" class="rounded px-2 py-1 hover:bg-gray-100">Bakery & Pastry</NuxtLink>
                  <NuxtLink to="/industry/catering-meal-subscription" class="rounded px-2 py-1 hover:bg-gray-100">Catering & Meal Subscription</NuxtLink>
                  <NuxtLink to="/industry/hotel-bars-restaurants" class="rounded px-2 py-1 hover:bg-gray-100">Hotel Bars & Restaurants</NuxtLink>
                  <NuxtLink to="/industry/grocer-butcher" class="rounded px-2 py-1 hover:bg-gray-100">Grocer & Butcher</NuxtLink>
                  <NuxtLink to="/industry/b2b-wholesale" class="rounded px-2 py-1 hover:bg-gray-100">B2B and Wholesale</NuxtLink>
                </div>
              </div>
              <div>
                <div class="text-sm font-semibold text-gray-500">{{ t('nav.group.ecommerce') }}</div>
                <div class="mt-2 flex flex-col">
                  <NuxtLink to="/industry/ecommerce" class="rounded px-2 py-1 hover:bg-gray-100">Ecommerce</NuxtLink>
                  <NuxtLink to="/industry/fashion-apparel" class="rounded px-2 py-1 hover:bg-gray-100">Fashion & Apparel</NuxtLink>
                  <NuxtLink to="/industry/pharmacies-health" class="rounded px-2 py-1 hover:bg-gray-100">Pharmacies & Health</NuxtLink>
                  <NuxtLink to="/industry/mobile-electronics" class="rounded px-2 py-1 hover:bg-gray-100">Mobile Phone & Electronics</NuxtLink>
                  <NuxtLink to="/industry/digital-products-services" class="rounded px-2 py-1 hover:bg-gray-100">Digital Products & Services</NuxtLink>
                  <NuxtLink to="/industry/popup-event-store" class="rounded px-2 py-1 hover:bg-gray-100">Popup and Event Store</NuxtLink>
                  <NuxtLink to="/industry/personal-shopping" class="rounded px-2 py-1 hover:bg-gray-100">Personal Shopping</NuxtLink>
                  <NuxtLink to="/industry/jewelry-accessories" class="rounded px-2 py-1 hover:bg-gray-100">Jewelry & Accessories</NuxtLink>
                  <NuxtLink to="/industry/religious-community" class="rounded px-2 py-1 hover:bg-gray-100">Religious & Community</NuxtLink>
                </div>
              </div>
              <div>
                <div class="text-sm font-semibold text-gray-500">{{ t('nav.group.service') }}</div>
                <div class="mt-2 flex flex-col">
                  <NuxtLink to="/industry/salon" class="rounded px-2 py-1 hover:bg-gray-100">Salon</NuxtLink>
                  <NuxtLink to="/industry/laundry" class="rounded px-2 py-1 hover:bg-gray-100">Laundry</NuxtLink>
                  <NuxtLink to="/industry/professional-services" class="rounded px-2 py-1 hover:bg-gray-100">Professional Services</NuxtLink>
                  <NuxtLink to="/industry/pets-grooming" class="rounded px-2 py-1 hover:bg-gray-100">Pets & Grooming</NuxtLink>
                  <NuxtLink to="/industry/hotel-booking" class="rounded px-2 py-1 hover:bg-gray-100">Hotel Booking</NuxtLink>
                  <NuxtLink to="/industry/education" class="rounded px-2 py-1 hover:bg-gray-100">Education</NuxtLink>
                  <NuxtLink to="/industry/printing-services" class="rounded px-2 py-1 hover:bg-gray-100">Printing Services</NuxtLink>
                  <NuxtLink to="/industry/rental" class="rounded px-2 py-1 hover:bg-gray-100">Rental</NuxtLink>
                  <NuxtLink to="/industry/tour-travel-services" class="rounded px-2 py-1 hover:bg-gray-100">Tour & Travel Services</NuxtLink>
                  <NuxtLink to="/industry/ticketing" class="rounded px-2 py-1 hover:bg-gray-100">Ticketing</NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
        <NuxtLink to="/pricing" class="text-gray-700 hover:text-primary">{{ t('nav.pricing') }}</NuxtLink>
        <NuxtLink to="/about_us" class="text-gray-700 hover:text-primary">{{ t('nav.about') }}</NuxtLink>
      </nav>
      <div class="hidden items-center gap-3 md:flex">
        <NuxtLink to="/auth/login" class="text-gray-700 hover:text-primary">{{ t('nav.login') }}</NuxtLink>
        <NuxtLink to="/auth/register" class="rounded-lg bg-primary px-4 py-2 font-semibold text-white shadow-sm hover:brightness-95">{{ t('nav.startFree') }}</NuxtLink>
        <select v-model="locale" class="rounded border border-gray-200 bg-gray-50 px-2 py-1 text-sm focus:border-primary focus:ring-primary">
          <option value="en">English</option>
          <option value="fr">Français</option>
          <option value="it">Italiano</option>
        </select>
      </div>
      <button class="md:hidden inline-flex items-center justify-center rounded-md border border-gray-200 p-2 text-gray-700" @click="open = true" aria-label="Menu">
        <Menu class="h-5 w-5" />
      </button>
    </div>

    <div v-if="open" class="fixed inset-0 z-[60] bg-black/40" @click="open = false"></div>
    <div v-if="open" class="fixed right-0 top-0 z-[70] h-full w-72 bg-white shadow-xl">
      <div class="flex items-center justify-between border-b px-4 py-3">
        <div class="flex items-center gap-2">
          <Store class="h-5 w-5 text-primary" />
          <span class="font-semibold">Wa-Shop</span>
        </div>
        <button class="inline-flex items-center justify-center rounded-md border border-gray-200 p-2 text-gray-700" @click="open = false" aria-label="Close">
          <X class="h-5 w-5" />
        </button>
      </div>
      <nav class="flex flex-col gap-2 px-4 py-4">
        <NuxtLink to="/products" class="rounded px-3 py-2 text-gray-700 hover:bg-gray-100" @click="open=false">{{ t('nav.products') }}</NuxtLink>
        <NuxtLink to="/industry" class="rounded px-3 py-2 text-gray-700 hover:bg-gray-100" @click="open=false">{{ t('nav.industry') }}</NuxtLink>
        <NuxtLink to="/pricing" class="rounded px-3 py-2 text-gray-700 hover:bg-gray-100" @click="open=false">{{ t('nav.pricing') }}</NuxtLink>
        <NuxtLink to="/changelog" class="rounded px-3 py-2 text-gray-700 hover:bg-gray-100" @click="open=false">{{ t('nav.changelog') }}</NuxtLink>
        <NuxtLink to="/resources" class="rounded px-3 py-2 text-gray-700 hover:bg-gray-100" @click="open=false">{{ t('nav.resources') }}</NuxtLink>
      </nav>
      <div class="border-t px-4 py-4">
        <NuxtLink to="/auth/login" class="block rounded px-3 py-2 text-gray-700 hover:bg-gray-100" @click="open=false">{{ t('nav.login') }}</NuxtLink>
        <NuxtLink to="/auth/register" class="mt-2 block rounded-lg bg-primary px-4 py-2 text-center font-semibold text-white" @click="open=false">{{ t('nav.startFree') }}</NuxtLink>
        <div class="mt-4">
          <select v-model="locale" class="w-full rounded border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-primary focus:ring-primary">
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="it">Italiano</option>
          </select>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
const open = ref(false)
const pdOpen = ref(false)
const inOpen = ref(false)
import { Store, ChevronDown, Menu, X } from 'lucide-vue-next'
import { useI18n } from '~/composables/i18n'
const { locale, t } = useI18n()
</script>
