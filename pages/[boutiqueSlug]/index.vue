<template>
  <div>
    <CatalogHeader />
    <main class="mx-auto max-w-5xl px-6 py-6">
      <div v-if="appearance.bannerText" class="rounded-lg px-4 py-3 text-sm" :style="bannerStyle">
        <a v-if="appearance.bannerLink" :href="appearance.bannerLink" target="_blank" class="font-semibold" :style="{ color: appearance.primary }">{{ appearance.bannerText }}</a>
        <span v-else class="font-semibold" :style="{ color: appearance.primary }">{{ appearance.bannerText }}</span>
      </div>
      <div class="mt-8">
        <h1 class="text-3xl font-bold">Catalogue</h1>
        <p class="mt-3 text-gray-600">Produits de la boutique.</p>
      </div>
      <div v-if="blocks && blocks.length" class="mt-6 space-y-6">
        <div v-for="b in blocks" :key="b.id">
          <div v-if="b.type==='banner'" class="rounded-lg px-4 py-3 text-sm" :style="bannerStyle">
            <span class="font-semibold" :style="{ color: appearance.primary }">{{ b.text }}</span>
          </div>
          <div v-else-if="b.type==='popup'"></div>
        </div>
      </div>
    </main>
    <CatalogFooter />
    <div v-if="showPopup" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div class="w-80 rounded-xl border bg-white p-4">
        <div class="flex items-center justify-between">
          <div class="font-semibold text-sm">{{ popupTitle }}</div>
          <button class="rounded border bg-white px-2 py-1 text-xs" @click="closePopup">Fermer</button>
        </div>
        <div class="mt-2 text-sm text-gray-700">{{ popupDescription }}</div>
        <div class="mt-3">
          <a v-if="popupLink" :href="popupLink" target="_blank" class="rounded bg-gray-900 px-3 py-2 text-sm text-white">Découvrir</a>
          <span v-else class="rounded border bg-white px-3 py-2 text-sm">Aucun lien</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const route = useRoute()
const slug = computed(() => String(route.params['boutiqueSlug'] || ''))
const appearance = reactive<{ primary: string; background: string; bannerText: string; bannerLink: string; popupEnabled: boolean; popupTitle: string; popupDescription: string; popupLink: string }>({ primary: '#25D366', background: '#ffffff', bannerText: '', bannerLink: '', popupEnabled: false, popupTitle: '', popupDescription: '', popupLink: '' })
const blocks = ref<any[]>([])
const popupBlock = computed(() => Array.isArray(blocks.value) ? blocks.value.find((b: any) => b && b.type === 'popup') : null)
const showPopup = ref(false)
const bannerStyle = computed(() => `background-color: ${appearance.background}`)
const popupTitle = computed(() => String((popupBlock.value && popupBlock.value.title) || appearance.popupTitle || 'Offre de bienvenue spéciale'))
const popupDescription = computed(() => String((popupBlock.value && popupBlock.value.description) || appearance.popupDescription || 'Bénéficiez de 20 % de réduction sur votre premier achat.'))
const popupLink = computed(() => String((popupBlock.value && popupBlock.value.link) || appearance.popupLink || ''))
function closePopup() {
  showPopup.value = false
  try { localStorage.setItem(`popupShown:${slug.value}`, '1') } catch {}
}
onMounted(() => {
  try {
    const raw = localStorage.getItem(`design:${slug.value}`)
    const d = raw ? JSON.parse(raw) : null
    if (d?.appearance) {
      appearance.primary = String(d.appearance.primary || appearance.primary)
      appearance.background = String(d.appearance.background || appearance.background)
      appearance.bannerText = String(d.appearance.bannerText || '')
      appearance.bannerLink = String(d.appearance.bannerLink || '')
      appearance.popupEnabled = !!d.appearance.popupEnabled
      appearance.popupTitle = String(d.appearance.popupTitle || '')
      appearance.popupDescription = String(d.appearance.popupDescription || '')
      appearance.popupLink = String(d.appearance.popupLink || '')
    }
    blocks.value = Array.isArray(d?.blocks) ? d.blocks : []
    const shown = localStorage.getItem(`popupShown:${slug.value}`)
    if (popupBlock.value) {
      showPopup.value = !shown
      if (shown) showPopup.value = false
    } else {
      showPopup.value = !!appearance.popupEnabled && !shown
    }
  } catch {}
})
useHead({ title: `${route.params['boutiqueSlug']} | Wa-Shop` })
</script>
