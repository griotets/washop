<template>
  <div>
    <CatalogHeader />
    <main class="mx-auto max-w-5xl px-6 py-12 pb-24">
      <h1 class="text-3xl font-bold">Panier</h1>
      <p class="mt-3 text-gray-600">Récapitulatif et coordonnées.</p>
      <div class="mt-6 space-y-4">
        <div v-for="item in items" :key="item.id" class="flex items-center justify-between rounded-lg border p-4">
          <div>
            <div class="font-semibold">{{ item.name }}</div>
            <div class="text-sm text-gray-600">{{ item.quantity }} × {{ item.price.toLocaleString('fr-FR') }} XAF</div>
          </div>
          <div class="font-semibold">{{ (item.price*item.quantity).toLocaleString('fr-FR') }} XAF</div>
        </div>
      </div>
    </main>
    <CartBar :slug="String(route.params['boutique-slug']||'')" />
  </div>
</template>
<script setup>
const route = useRoute()
useHead({ title: `Panier | ${route.params['boutique-slug']}` })
const items = ref([])
onMounted(() => {
  try {
    const raw = localStorage.getItem(`cart:${String(route.params['boutique-slug']||'')}`)
    items.value = raw ? JSON.parse(raw) : []
  } catch { items.value = [] }
})
</script>
