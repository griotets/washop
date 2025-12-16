<template>
  <main class="mx-auto max-w-6xl px-6 py-12">
    <h1 class="text-3xl font-bold">Products</h1>
    <p class="mt-3 text-gray-600">Choose a solution to start.</p>

    <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <NuxtLink to="/products/whatsapp-order" class="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition">
        <div class="flex items-center gap-3">
          <span class="material-icons text-primary">shopping_cart</span>
          <div class="font-semibold">WhatsApp Order</div>
        </div>
        <div class="mt-2 text-sm text-gray-600">Customers place orders via WhatsApp.</div>
      </NuxtLink>

      <NuxtLink to="/products/whatsapp-business-api" class="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition">
        <div class="flex items-center gap-3">
          <span class="material-icons text-primary">hub</span>
          <div class="font-semibold">WhatsApp Business API</div>
        </div>
        <div class="mt-2 text-sm text-gray-600">Automate and integrate messaging workflows.</div>
      </NuxtLink>

      <NuxtLink to="/products/chatbot" class="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition">
        <div class="flex items-center gap-3">
          <span class="material-icons text-primary">smart_toy</span>
          <div class="font-semibold">Chatbot</div>
        </div>
        <div class="mt-2 text-sm text-gray-600">Answer questions and capture orders automatically.</div>
      </NuxtLink>

      <NuxtLink to="/products/telegram-order" class="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition">
        <div class="flex items-center gap-3">
          <span class="material-icons text-primary">send</span>
          <div class="font-semibold">Telegram Order</div>
        </div>
        <div class="mt-2 text-sm text-gray-600">Offer ordering via Telegram channels or DMs.</div>
      </NuxtLink>
    </div>
  </main>
</template>
<script setup>
useHead({ title: 'Products | Wa-Shop' })
</script>
