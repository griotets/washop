<template>
  <div class="fixed bottom-0 left-0 right-0 z-50 border-t bg-white">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
      <div class="font-semibold">Total: {{ total.toLocaleString('fr-FR') }} XAF</div>
      <button class="rounded-lg bg-primary px-5 py-2 font-semibold text-white" @click="sendWhatsApp">Envoyer la commande sur WhatsApp</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ slug: { type: String, required: true } })
import { useCartStore } from '~/stores/cart'
const cartStore = useCartStore()
const store = ref({ phone: '' })
onMounted(() => {
  cartStore.load(props.slug)
  try {
    const raw = localStorage.getItem(`store:${props.slug}`)
    store.value = raw ? JSON.parse(raw) : { phone: '' }
  } catch { store.value = { phone: '' } }
})
const total = computed(() => cartStore.total)
function sendWhatsApp() {
  const lines = cartStore.items.map(i => `- ${(i.quantity||1)}x ${i.name||'Article'} (${((i.price||0)*(i.quantity||1)).toLocaleString('fr-FR')} XAF)`).join('\n')
  const message = `Bonjour, je souhaite commander:\n\n${lines}\n\nTotal : ${total.value.toLocaleString('fr-FR')} XAF\n\nLien de la commande : ${location.href}`
  const encoded = encodeURIComponent(message)
  const digits = String(store.value.phone || '').replace(/\D/g, '')
  const url = `https://wa.me/${digits}?text=${encoded}`
  window.open(url, '_blank')
}
</script>
