<template>
  <main class="mx-auto max-w-5xl px-6 py-12">
    <h1 class="text-3xl font-bold">Produit</h1>
    <p class="mt-3 text-gray-600">Fiche produit détaillée.</p>
  </main>
</template>
<script setup>
const route = useRoute()
useHead({ title: `Produit ${route.params.id} | Wa-Shop` })
</script>

