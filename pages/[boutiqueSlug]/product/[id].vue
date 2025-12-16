<template>
  <div>
    <main class="mx-auto max-w-5xl px-6 py-12">
      <h1 class="text-3xl font-bold">Produit</h1>
      <p class="mt-3 text-gray-600">Fiche produit détaillée.</p>
    </main>
    <div v-if="showPopup" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div class="w-80 rounded-xl border bg-white p-4">
        <div class="flex items-center justify-between">
          <div class="font-semibold text-sm">{{ (popupBlock?.title) || 'Offre de bienvenue spéciale' }}</div>
          <button class="rounded border bg-white px-2 py-1 text-xs" @click="closePopup">Fermer</button>
        </div>
        <div class="mt-2 text-sm text-gray-700">{{ (popupBlock?.description) || 'Bénéficiez de 20 % de réduction sur votre premier achat.' }}</div>
        <div class="mt-3">
          <a v-if="popupBlock?.link" :href="popupBlock?.link" target="_blank" class="rounded bg-gray-900 px-3 py-2 text-sm text-white">Découvrir</a>
          <span v-else class="rounded border bg-white px-3 py-2 text-sm">Aucun lien</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const route = useRoute()
const slug = computed(() => String(route.params['boutiqueSlug'] || ''))
const showPopup = ref(false)
const popupBlock = ref<any>(null)
function closePopup() {
  showPopup.value = false
  try { localStorage.setItem(`popupShown:${slug.value}`, '1') } catch {}
}
onMounted(() => {
  try {
    const raw = localStorage.getItem(`design:${slug.value}`)
    const d = raw ? JSON.parse(raw) : null
    const blocks = Array.isArray(d?.blocks) ? d.blocks : []
    popupBlock.value = blocks.find((b: any) => b?.type === 'popup') || null
    const shown = localStorage.getItem(`popupShown:${slug.value}`)
    showPopup.value = !!popupBlock.value && !shown
  } catch {}
})
useHead({ title: `Produit ${route.params.id} | Wa-Shop` })
</script>
