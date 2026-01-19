<template>
  <div class="group relative flex flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-md">
    <div class="aspect-square w-full overflow-hidden bg-gray-200 relative">
      <NuxtImg 
        :src="imageUrl" 
        :alt="product.name" 
        loading="lazy"
        width="300"
        height="300"
        class="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        provider="ipx"
      />
      
      <!-- Availability / Cart Controls -->
      <div v-if="available" class="absolute top-2 right-2 transition-opacity" :class="cartQuantity > 0 ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'">
        <div v-if="cartQuantity > 0" class="flex items-center gap-2 rounded-full bg-white p-1 shadow">
          <button @click.prevent="updateQuantity(-1)" class="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">-</button>
          <span class="text-sm font-semibold">{{ cartQuantity }}</span>
          <button @click.prevent="updateQuantity(1)" class="flex h-6 w-6 items-center justify-center rounded-full text-white hover:brightness-110" :style="{ backgroundColor: primaryColor }">+</button>
        </div>
        <button v-else @click.prevent="addToCart" class="p-2 rounded-full bg-white shadow text-gray-900 hover:text-primary transition-colors" :title="t('storefront.addToCartTitle')">
          <ShoppingCart class="h-5 w-5" />
        </button>
      </div>
    </div>
    
    <div class="flex flex-1 flex-col p-4">
      <h3 class="text-base font-semibold text-gray-900">
        <NuxtLink :to="`/${storeSlug}/product/${product.id}`">
          <span aria-hidden="true" class="absolute inset-0" />
          {{ product.name }}
        </NuxtLink>
      </h3>
      
      <div class="mt-1 relative z-10">
        <p class="text-sm text-gray-500" :class="{ 'line-clamp-2': !expanded }">
          {{ product.description }}
        </p>
        <button 
          v-if="product.description && product.description.length > 60" 
          @click.prevent.stop="expanded = !expanded" 
          class="mt-1 text-xs font-medium hover:underline focus:outline-none"
          :style="{ color: primaryColor }"
        >
          {{ expanded ? t('storefront.seeLess') : t('storefront.seeMore') }}
        </button>
      </div>
      
      <div class="mt-4 flex flex-1 items-end justify-between">
        <div class="flex flex-col">
          <p v-if="available" class="text-lg font-bold text-gray-900">{{ formattedPrice }}</p>
          <p v-if="product.original_price > product.price" class="text-sm text-gray-500 line-through">{{ formatOriginalPrice }}</p>
        </div>
        <div v-if="!available" class="rounded bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-800">
          {{ t('storefront.soldOut') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ShoppingCart } from 'lucide-vue-next'
import { useI18n } from '~/composables/i18n'

const props = defineProps<{
  product: any
  cartQuantity: number
  primaryColor: string
  storeSlug: string
  available: boolean
}>()

const emit = defineEmits<{
  (e: 'update-quantity', delta: number): void
}>()

const { t, locale } = useI18n()
const expanded = ref(false)

const imageUrl = computed(() => {
  const p = props.product
  if (Array.isArray(p.images) && p.images.length > 0) return p.images[0]
  if (typeof p.images === 'string') {
    try {
      const parsed = JSON.parse(p.images)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed[0]
    } catch {}
  }
  return 'https://via.placeholder.com/300?text=No+Image'
})

const formattedPrice = computed(() => formatCurrency(props.product.price))
const formatOriginalPrice = computed(() => formatCurrency(props.product.original_price))

function formatCurrency(price: number) {
  const l = locale.value === 'it' ? 'it-IT' : locale.value === 'en' ? 'en-US' : 'fr-FR'
  return new Intl.NumberFormat(l, { style: 'currency', currency: 'XAF' }).format(price)
}

function updateQuantity(delta: number) {
  emit('update-quantity', delta)
}

function addToCart() {
  updateQuantity(1)
}
</script>
