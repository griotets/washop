<template>
  <footer class="border-t bg-white">
    <div class="mx-auto max-w-6xl px-6 py-10">
      <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div class="text-xl font-bold">Wa-Shop Cameroun</div>
          <p class="mt-2 text-gray-600">Empowering businesses in Cameroon with WhatsApp-first e-commerce tools.</p>
        </div>
        <div>
          <div class="font-semibold">Company</div>
          <ul class="mt-2 space-y-2 text-gray-600">
            <li><NuxtLink to="/resources">About</NuxtLink></li>
            <li><NuxtLink to="/resources">Contact</NuxtLink></li>
          </ul>
        </div>
        <div>
          <div class="font-semibold">Products</div>
          <ul class="mt-2 space-y-2 text-gray-600">
            <li><NuxtLink to="/products">Features</NuxtLink></li>
            <li><NuxtLink to="/pricing">Pricing</NuxtLink></li>
          </ul>
        </div>
        <div>
          <div class="font-semibold">Legal</div>
          <ul class="mt-2 space-y-2 text-gray-600">
            <li><NuxtLink to="/resources">Terms</NuxtLink></li>
            <li><NuxtLink to="/resources">Privacy</NuxtLink></li>
          </ul>
        </div>
      </div>
      <div class="mt-8 text-sm text-gray-500">Propulsé par Wa-Shop Cameroun</div>
    </div>
  </footer>
</template>
