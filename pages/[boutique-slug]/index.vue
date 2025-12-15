<template>
  <div>
    <CatalogHeader />
    <main class="mx-auto max-w-5xl px-6 py-12">
      <h1 class="text-3xl font-bold">Catalogue</h1>
      <p class="mt-3 text-gray-600">Produits de la boutique.</p>
    </main>
    <CatalogFooter />
  </div>
</template>
<script setup>
const route = useRoute()
useHead({ title: `${route.params['boutique-slug']} | Wa-Shop` })
</script>
