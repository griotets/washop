<template>
  <main class="mx-auto max-w-5xl px-6 py-12">
    <h1 class="text-3xl font-bold">Confirmation</h1>
    <p class="mt-3 text-gray-600">Votre commande a été envoyée.</p>
  </main>
</template>
<script setup>
const route = useRoute()
useHead({ title: `Confirmation | ${route.params['boutiqueSlug']}` })
</script>

