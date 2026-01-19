<template>
  <div class="fixed bottom-0 left-0 right-0 z-50 border-t bg-white">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
      <div class="font-semibold">{{ t('catalog.cartTotal') }}: {{ total.toLocaleString(numberLocale) }} XAF</div>
      <NuxtLink :to="`/${slug}/cart`" class="rounded-lg bg-primary px-5 py-2 font-semibold text-white">
        {{ t('catalog.viewCart') }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ slug: { type: String, required: true } })
import { useCartStore } from '~/stores/cart'
import { useI18n } from '~/composables/i18n'
const cartStore = useCartStore()
const { locale, t } = useI18n()
const numberLocale = computed(() => (locale.value === 'fr' ? 'fr-FR' : locale.value === 'it' ? 'it-IT' : 'en-US'))
onMounted(() => {
  cartStore.load(props.slug)
})
const total = computed(() => cartStore.total)
</script>
