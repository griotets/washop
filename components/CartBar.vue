<template>
  <div class="fixed bottom-0 left-0 right-0 z-50 border-t bg-white">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
      <div class="font-semibold">{{ t('catalog.cartTotal') }}: {{ total.toLocaleString(numberLocale) }} XAF</div>
      <button class="rounded-lg bg-primary px-5 py-2 font-semibold text-white" @click="sendWhatsApp">{{ t('catalog.sendOrderWhatsApp') }}</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ slug: { type: String, required: true } })
import { useCartStore } from '~/stores/cart'
import { useI18n } from '~/composables/i18n'
const cartStore = useCartStore()
const store = ref({ phone: '' })
const { locale, t } = useI18n()
const numberLocale = computed(() => (locale.value === 'fr' ? 'fr-FR' : locale.value === 'it' ? 'it-IT' : 'en-US'))
onMounted(() => {
  cartStore.load(props.slug)
  try {
    const raw = localStorage.getItem(`store:${props.slug}`)
    store.value = raw ? JSON.parse(raw) : { phone: '' }
  } catch { store.value = { phone: '' } }
})
const total = computed(() => cartStore.total)
function sendWhatsApp() {
  const lines = cartStore.items.map(i => `- ${(i.quantity||1)}x ${i.name||t('catalog.itemFallback')} (${((i.price||0)*(i.quantity||1)).toLocaleString(numberLocale.value)} XAF)`).join('\n')
  const message = `${t('cart.messageIntro')}\n\n${lines}\n\n${t('cart.messageTotal')} : ${total.value.toLocaleString(numberLocale.value)} XAF\n\n${t('cart.messageLink')} : ${location.href}`
  const encoded = encodeURIComponent(message)
  const digits = String(store.value.phone || '').replace(/\D/g, '')
  const url = `https://wa.me/${digits}?text=${encoded}`
  window.open(url, '_blank')
}
</script>
