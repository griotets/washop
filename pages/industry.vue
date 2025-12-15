<template>
  <main class="mx-auto max-w-7xl px-6 py-12">
    <h1 class="text-3xl font-bold">Industry</h1>
    <p class="mt-3 text-gray-600">Explore supported business types.</p>

    <div class="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      <div>
        <div class="text-sm font-semibold text-gray-500">F&B</div>
        <ul class="mt-3 space-y-2">
          <li v-for="i in fb" :key="i.slug">
            <NuxtLink :to="`/industry/${i.slug}`" class="block rounded px-3 py-2 hover:bg-gray-100">{{ i.label }}</NuxtLink>
          </li>
        </ul>
      </div>
      <div>
        <div class="text-sm font-semibold text-gray-500">E-commerce</div>
        <ul class="mt-3 space-y-2">
          <li v-for="i in ec" :key="i.slug">
            <NuxtLink :to="`/industry/${i.slug}`" class="block rounded px-3 py-2 hover:bg-gray-100">{{ i.label }}</NuxtLink>
          </li>
        </ul>
      </div>
      <div>
        <div class="text-sm font-semibold text-gray-500">Service</div>
        <ul class="mt-3 space-y-2">
          <li v-for="i in sv" :key="i.slug">
            <NuxtLink :to="`/industry/${i.slug}`" class="block rounded px-3 py-2 hover:bg-gray-100">{{ i.label }}</NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </main>
</template>
<script setup>
const fb = [
  { label: 'Restaurants', slug: 'restaurants' },
  { label: 'Cafes', slug: 'cafes' },
  { label: 'Home-Based Food Business', slug: 'home-based-food-business' },
  { label: 'Bakery & Pastry', slug: 'bakery-pastry' },
  { label: 'Catering & Meal Subscription', slug: 'catering-meal-subscription' },
  { label: 'Hotel Bars & Restaurants', slug: 'hotel-bars-restaurants' },
  { label: 'Grocer & Butcher', slug: 'grocer-butcher' },
  { label: 'B2B and Wholesale', slug: 'b2b-wholesale' }
]
const ec = [
  { label: 'Ecommerce', slug: 'ecommerce' },
  { label: 'Fashion & Apparel', slug: 'fashion-apparel' },
  { label: 'Pharmacies & Health', slug: 'pharmacies-health' },
  { label: 'Mobile Phone & Electronics', slug: 'mobile-electronics' },
  { label: 'Digital Products & Services', slug: 'digital-products-services' },
  { label: 'Popup and Event Store', slug: 'popup-event-store' },
  { label: 'Personal Shopping', slug: 'personal-shopping' },
  { label: 'Jewelry & Accessories', slug: 'jewelry-accessories' },
  { label: 'Religious & Community', slug: 'religious-community' }
]
const sv = [
  { label: 'Salon', slug: 'salon' },
  { label: 'Laundry', slug: 'laundry' },
  { label: 'Professional Services', slug: 'professional-services' },
  { label: 'Pets & Grooming', slug: 'pets-grooming' },
  { label: 'Hotel Booking', slug: 'hotel-booking' },
  { label: 'Education', slug: 'education' },
  { label: 'Printing Services', slug: 'printing-services' },
  { label: 'Rental', slug: 'rental' },
  { label: 'Tour & Travel Services', slug: 'tour-travel-services' },
  { label: 'Ticketing', slug: 'ticketing' }
]
useHead({ title: 'Industry | Wa-Shop Cameroun' })
</script>
