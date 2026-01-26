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
      />
      
      <!-- WhatsApp Button -->
      <a 
        v-if="whatsappLink" 
        :href="whatsappLink" 
        target="_blank" 
        @click.stop
        class="absolute top-2 left-2 z-20 p-2 rounded-full bg-green-500 text-white shadow hover:bg-green-600 transition-colors opacity-0 group-hover:opacity-100"
        :title="t('storefront.whatsapp')"
      >
        <MessageCircle class="h-5 w-5" />
      </a>

      <!-- Availability / Cart Controls -->
      <div v-if="available || cartQuantity > 0" class="absolute top-2 right-2 transition-opacity z-20" :class="cartQuantity > 0 ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'">
        <div class="flex items-center gap-1 rounded-full bg-white p-1 shadow">
          <button @click.prevent.stop="updateQuantity(-1)" class="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200" :disabled="cartQuantity <= 0" :class="{ 'opacity-50 cursor-not-allowed': cartQuantity <= 0 }">-</button>
          <input 
            type="text" 
            inputmode="numeric"
            :value="cartQuantity" 
            @input="onInputQty" 
            @click.stop
            class="w-10 text-center text-sm font-semibold border border-gray-200 rounded px-1 bg-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            min="0"
          />
          <button @click.prevent.stop="updateQuantity(1)" class="flex h-6 w-6 items-center justify-center rounded-full text-white hover:brightness-110" :style="{ backgroundColor: primaryColor, opacity: available ? 1 : 0.5, cursor: available ? 'pointer' : 'not-allowed' }" :disabled="!available">+</button>
        </div>
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
          v-if="product.description && product.description.length > 80" 
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
import { ShoppingCart, MessageCircle } from 'lucide-vue-next'
import { useI18n } from '~/composables/i18n'

const props = defineProps<{
  product: any
  cartQuantity: number
  primaryColor: string
  storeSlug: string
  storePhone?: string
  available: boolean
}>()

const emit = defineEmits<{
  (e: 'update-quantity', delta: number): void
  (e: 'update-quantity-input', qty: number): void
}>()

const { t, locale } = useI18n()
const expanded = ref(false)

const whatsappLink = computed(() => {
  const phone = String(props.storePhone || '').trim()
  if (!phone) return ''
  const text = encodeURIComponent(t('storefront.whatsappInterestedMsg', { name: props.product.name || t('storefront.productFallback') }))
  return `https://wa.me/${phone.replace(/\D/g, '')}?text=${text}`
})

function onInputQty(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.value === '') {
    emit('update-quantity-input', 0)
    return
  }
  const val = parseInt(target.value)
  if (!isNaN(val) && val >= 0) {
    emit('update-quantity-input', val)
  }
}

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
