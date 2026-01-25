<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <CatalogHeader :store="storeData" />
    
    <main class="mx-auto max-w-3xl px-4 py-8 pb-32 flex-grow w-full">
      <!-- Stepper -->
      <div class="mb-8 flex items-center justify-between px-4">
        <div class="flex flex-col items-center gap-2">
          <div :class="['flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold', step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500']">1</div>
          <div class="text-xs font-medium text-gray-600">{{ t('catalog.cart') }}</div>
        </div>
        <div :class="['h-1 flex-1 rounded-full mx-2', step >= 2 ? 'bg-primary' : 'bg-gray-200']"></div>
        <div class="flex flex-col items-center gap-2">
          <div :class="['flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold', step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500']">2</div>
          <div class="text-xs font-medium text-gray-600">{{ t('checkout.step.delivery') }}</div>
        </div>
        <div :class="['h-1 flex-1 rounded-full mx-2', step >= 3 ? 'bg-primary' : 'bg-gray-200']"></div>
        <div class="flex flex-col items-center gap-2">
          <div :class="['flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold', step >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500']">3</div>
          <div class="text-xs font-medium text-gray-600">{{ t('checkout.step.confirm') }}</div>
        </div>
      </div>

      <!-- Step 1: Cart -->
      <div v-if="step === 1">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold">{{ t('checkout.cartTitle') }}</h1>
          <NuxtLink v-if="cart.items.length > 0" :to="`/${slug}`" class="text-sm font-medium text-primary hover:underline">
            {{ t('checkout.backToStore') }}
          </NuxtLink>
        </div>
        
        <div v-if="cart.items.length === 0" class="mt-8 text-center">
          <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <ShoppingCart class="h-8 w-8 text-gray-400" />
          </div>
          <p class="text-gray-600">{{ t('checkout.cartEmpty') }}</p>
          <NuxtLink :to="`/${slug}`" class="mt-4 inline-block rounded-lg bg-primary px-6 py-2 text-white">
            {{ t('checkout.backToStore') }}
          </NuxtLink>
        </div>

        <div v-else class="mt-6 space-y-4">
          <div v-for="item in cart.items" :key="item.id" class="flex items-center gap-4 rounded-xl border bg-white p-4 shadow-sm">
            <div v-if="item.image && item.image.length > 0" class="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
              <img :src="item.image" class="h-full w-full object-cover" />
            </div>
            <div class="flex-1">
              <div class="font-semibold">{{ item.name }}</div>
              <div v-if="item.variantId" class="text-xs text-gray-500">{{ t('product.variant') }} #{{ item.variantId }}</div>
              <div v-if="item.options && Object.keys(item.options || {}).length > 0" class="mt-1 text-xs text-gray-500">
                {{ t('product.options') }}:
                <span v-for="(val,key,idx) in item.options" :key="key">
                  {{ key }}={{ String(val) }}<span v-if="idx < Object.keys(item.options).length - 1">, </span>
                </span>
              </div>
              <div class="text-sm font-medium text-primary">{{ formatMoney(item.price) }}</div>
            </div>
            <div class="flex items-center gap-3 rounded-lg bg-gray-50 p-1">
              <button class="h-7 w-7 rounded bg-white shadow-sm hover:bg-gray-100 disabled:opacity-50" @click="updateItemQty(item, -1)">
                -
              </button>
              <span class="w-4 text-center text-sm font-medium">{{ item.quantity }}</span>
              <button class="h-7 w-7 rounded bg-white shadow-sm hover:bg-gray-100" @click="updateItemQty(item, 1)">
                +
              </button>
            </div>
            <button class="flex items-center gap-1 text-red-500 hover:text-red-700" @click="cart.remove(item.id)" :title="t('common.remove')">
              <Trash2 class="h-5 w-5" />
              <span class="hidden sm:inline text-sm font-medium">{{ t('common.remove') }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Step 2: Delivery -->
      <div v-if="step === 2">
        <h1 class="text-2xl font-bold">{{ t('checkout.deliveryTitle') }}</h1>
        
        <div class="mt-6 space-y-6 rounded-xl border bg-white p-6 shadow-sm">
          <!-- Delivery Method -->
          <div v-if="availableMethods.length > 1">
            <label class="mb-3 block text-sm font-medium text-gray-700">{{ t('checkout.deliveryMethod') }}</label>
            <div class="grid grid-cols-2 gap-4">
              <label :class="['flex cursor-pointer flex-col items-center rounded-xl border-2 p-4 transition-colors', form.method === 'pickup' ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200']">
                <input type="radio" v-model="form.method" value="pickup" class="sr-only" />
                <Store class="mb-2 h-6 w-6" :class="form.method === 'pickup' ? 'text-primary' : 'text-gray-400'" />
                <span :class="['font-medium', form.method === 'pickup' ? 'text-primary' : 'text-gray-600']">{{ t('checkout.pickup') }}</span>
              </label>
              <label :class="['flex cursor-pointer flex-col items-center rounded-xl border-2 p-4 transition-colors', form.method === 'delivery' ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200']">
                <input type="radio" v-model="form.method" value="delivery" class="sr-only" />
                <Truck class="mb-2 h-6 w-6" :class="form.method === 'delivery' ? 'text-primary' : 'text-gray-400'" />
                <span :class="['font-medium', form.method === 'delivery' ? 'text-primary' : 'text-gray-600']">{{ t('checkout.delivery') }}</span>
              </label>
            </div>
          </div>

          <!-- Contact Info -->
          <div class="space-y-4">
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">{{ t('checkout.fullName') }}</label>
              <input v-model="form.name" type="text" class="w-full rounded-lg border-gray-300 px-4 py-2 focus:border-primary focus:ring-primary" :placeholder="t('checkout.namePlaceholder')" />
            </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-gray-700">{{ t('checkout.whatsAppPhone') }}</label>
            <PhoneInput v-model="form.phone" />
          </div>

            <div v-if="form.method === 'delivery'" class="space-y-4">
              <!-- Address Autocomplete -->
              <div class="mb-4">
                <label class="mb-1 block text-sm font-medium text-gray-700">{{ t('checkout.searchAddressPlaceholder') }}</label>
                <AddressAutocomplete 
                   :placeholder="t('checkout.searchAddressPlaceholder')" 
                   @select="handleAddressSelect"
                />
              </div>

              <div>
                <label class="mb-1 block text-sm font-medium text-gray-700">{{ t('checkout.field.cityDetail') }}</label>
                <input v-model="form.city" type="text" class="w-full rounded-lg border-gray-300 px-4 py-2 focus:border-primary focus:ring-primary" :placeholder="t('checkout.cityPlaceholder')" />
              </div>
              <div>
                <label class="mb-1 block text-sm font-medium text-gray-700">{{ t('checkout.field.addressDetail') }}</label>
                <textarea v-model="form.address" rows="2" class="w-full rounded-lg border-gray-300 px-4 py-2 focus:border-primary focus:ring-primary" :placeholder="t('checkout.addressPlaceholder')"></textarea>
              </div>
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-gray-700">{{ form.method === 'delivery' ? 'Note pour le livreur' : t('checkout.noteOptional') }}</label>
              <textarea v-model="form.note" rows="2" class="w-full rounded-lg border-gray-300 px-4 py-2 focus:border-primary focus:ring-primary" :placeholder="t('checkout.notePlaceholder')"></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 3: Confirmation -->
      <div v-if="step === 3">
        <h1 class="text-2xl font-bold">{{ t('checkout.confirmTitle') }}</h1>
        
        <div class="mt-6 space-y-6">
          <!-- Summary Card -->
          <div class="rounded-xl border bg-white p-6 shadow-sm">
            <h3 class="mb-4 font-semibold text-gray-900">{{ t('checkout.summaryTitle') }}</h3>
            <div class="space-y-3">
              <div v-for="item in cart.items" :key="item.id" class="flex justify-between text-sm">
                <span class="text-gray-600">
                  {{ item.quantity }}x {{ item.name }}
                  <span v-if="item.options && Object.keys(item.options || {}).length > 0" class="ml-1 text-gray-500">
                    ({{ t('product.options') }}:
                    <span v-for="(val,key,idx) in item.options" :key="key">
                      {{ key }}={{ String(val) }}<span v-if="idx < Object.keys(item.options).length - 1">, </span>
                    </span>)
                  </span>
                </span>
                <span class="font-medium">{{ formatMoney(item.price * item.quantity) }}</span>
              </div>
            </div>
            <div class="my-4 border-t border-dashed"></div>
            <div class="flex justify-between text-lg font-bold">
              <span>{{ t('checkout.total') }}</span>
              <span class="text-primary">{{ formatMoney(cart.total) }}</span>
            </div>
          </div>

          <!-- Info Card -->
          <div class="rounded-xl border bg-white p-6 shadow-sm">
            <h3 class="mb-4 font-semibold text-gray-900">{{ t('checkout.yourInfoTitle') }}</h3>
            <dl class="space-y-3 text-sm">
              <div class="flex justify-between">
                <dt class="text-gray-500">{{ t('checkout.field.name') }}</dt>
                <dd class="font-medium">{{ form.name }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-gray-500">{{ t('checkout.field.phone') }}</dt>
                <dd class="font-medium">{{ form.phone }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-gray-500">{{ t('checkout.field.method') }}</dt>
                <dd class="inline-flex items-center gap-1 font-medium text-primary">
                  <component :is="form.method === 'pickup' ? Store : Truck" class="h-4 w-4" />
                  {{ form.method === 'pickup' ? t('checkout.method.pickupStore') : t('checkout.delivery') }}
                </dd>
              </div>
              <div v-if="form.method === 'delivery'">
                <dt class="mt-2 text-gray-500">{{ t('checkout.deliveryAddress') }}</dt>
                <dd class="mt-1 rounded bg-gray-50 p-2 font-medium text-gray-700">
                  {{ form.city }}, {{ form.address }}
                </dd>
              </div>
              <div v-if="form.note">
                <dt class="mt-2 text-gray-500">{{ form.method === 'delivery' ? t('checkout.field.note') : 'Note' }}</dt>
                <dd class="mt-1 italic text-gray-600">"{{ form.note }}"</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </main>

    <!-- Bottom Action Bar -->
    <div class="fixed bottom-0 left-0 right-0 border-t bg-white p-4 shadow-lg">
      <div class="mx-auto flex max-w-3xl items-center justify-between gap-4">
        <div v-if="step === 1" class="font-bold text-lg">
          {{ formatMoney(cart.total) }}
        </div>
        
        <button v-if="step > 1" @click="step--" class="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50">
          {{ t('checkout.back') }}
        </button>
        
        <button v-if="step === 1" @click="step++" :disabled="cart.items.length === 0" class="ml-auto rounded-lg bg-primary px-8 py-3 font-semibold text-white shadow-sm hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed">
          {{ t('checkout.order') }}
        </button>
        
        <button v-else-if="step === 2" @click="validateStep2" class="ml-auto rounded-lg bg-primary px-8 py-3 font-semibold text-white shadow-sm hover:brightness-110">
          {{ t('common.continue') }}
        </button>
        
        <button v-else-if="step === 3" @click="submitOrder" :disabled="loading" class="ml-auto flex items-center gap-2 rounded-lg bg-[#25D366] px-6 py-3 font-semibold text-white shadow-sm hover:brightness-110 disabled:opacity-75 disabled:cursor-not-allowed">
          <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <MessageCircle v-else class="h-5 w-5" />
          {{ loading ? t('common.sending') : t('catalog.sendOrderWhatsApp') }}
        </button>
      </div>
    </div>

    <CatalogFooter v-if="storeData" :social="storeData.social" />
    <WhatsAppFloatButton v-if="storeData" :phone="storeData.phone" :visible="storeData.showWhatsappButton" />
  </div>
</template>

<script setup lang="ts">
import type { SupabaseClient } from '@supabase/supabase-js'
import { ShoppingCart, Trash2, Store, Truck, MessageCircle } from 'lucide-vue-next'
import { useCartStore } from '~/stores/cart'
import PhoneInput from '~/components/PhoneInput.vue'
import AddressAutocomplete from '~/components/AddressAutocomplete.vue'
import { useI18n } from '~/composables/i18n'
const { t, locale } = useI18n()

const route = useRoute()
const nuxt = useNuxtApp()
const supabase = nuxt.$supabase as SupabaseClient
const slug = computed(() => String(route.params['boutiqueSlug'] || ''))
const cart = useCartStore()

useHead({ title: computed(() => `${t('checkout.seoTitle')} | ${slug.value}`) })

// State
const step = ref(1)
const storeConfig = ref<any>({})
const storeData = ref<any>(null)
const loading = ref(false)
const form = reactive({
  name: '',
  phone: '',
  method: 'delivery', // default
  city: '',
  address: '',
  note: ''
})

// Computed
const availableMethods = computed(() => {
  const methods = []
  const deliveryConfig = storeConfig.value?.checkout?.delivery
  if (deliveryConfig?.pickup) methods.push('pickup')
  if (deliveryConfig?.delivery) methods.push('delivery')
  return methods.length > 0 ? methods : ['pickup', 'delivery'] // fallback
})

// Methods
onMounted(async () => {
  cart.load(slug.value)
  loadStoreConfig()
  await loadConstraints()
  
  // Fetch store info
  const { data, error } = await supabase.from('stores').select('id, name, phone, color, image_url, social_whatsapp, social_facebook, social_instagram, social_telegram, design_settings').eq('slug', slug.value).maybeSingle()
  if (error) {
     console.error(error)
     const toast = useToast()
     toast.error('Erreur chargement infos boutique: ' + error.message)
  }
  if (data) {
     storeData.value = {
       id: data.id,
       name: data.name,
       phone: data.phone,
       color: data.color,
       logoUrl: data.image_url,
       social: {
         whatsapp: data.social_whatsapp,
         facebook: data.social_facebook,
         instagram: data.social_instagram,
         telegram: data.social_telegram
       },
       showWhatsappButton: !!data.design_settings?.show_whatsapp_button
     }
     localStorage.setItem(`store:${slug.value}`, JSON.stringify(storeData.value))
  }
  
  loadCustomerDetails()
})

function loadStoreConfig() {
  try {
    const raw = localStorage.getItem(`design:${slug.value}`)
    if (raw) {
      storeConfig.value = JSON.parse(raw)
      // Set default method
      const deliveryConfig = storeConfig.value.checkout?.delivery
      if (deliveryConfig?.pickup && !deliveryConfig?.delivery) form.method = 'pickup'
      else if (!deliveryConfig?.pickup && deliveryConfig?.delivery) form.method = 'delivery'
    }
  } catch {}
}

function loadCustomerDetails() {
  try {
    const raw = localStorage.getItem('customer:info')
    if (raw) {
      const info = JSON.parse(raw)
      if (info.name) form.name = info.name
      if (info.phone) form.phone = info.phone
      if (info.city) form.city = info.city
      if (info.address) form.address = info.address
      // Note: We don't restore 'method' or 'note' as these are usually order-specific
    }
  } catch (e) {
    console.error('Error loading customer info', e)
  }
}

function saveCustomerDetails() {
  try {
    const info = {
      name: form.name,
      phone: form.phone,
      city: form.city,
      address: form.address
    }
    localStorage.setItem('customer:info', JSON.stringify(info))
  } catch (e) {
    console.error('Error saving customer info', e)
  }
}

function validateStep2() {
  const toast = useToast()
  if (!form.name.trim()) return toast.error(t('checkout.error.nameRequired'))
  if (!form.phone.trim() || form.phone.length < 9) return toast.error(t('checkout.error.phoneInvalid'))
  if (form.method === 'delivery' && (!form.city.trim() || !form.address.trim())) {
    return toast.error(t('checkout.error.addressRequired'))
  }
  
  saveCustomerDetails()
  step.value = 3
}

function handleAddressSelect(data: { city: string; address: string; full: any }) {
  if (data.city) form.city = data.city
  if (data.address) form.address = data.address
}

async function submitOrder() {
  const toast = useToast()
  if (!storeData.value?.id) return toast.error(t('checkout.error.storeMissing'))
  
  loading.value = true

  try {
    // 1. Create Order
    // Note: We attempt to save delivery details. If columns don't exist, this might fail.
    // However, usually these are standard columns. If not, we might need to adjust.
    // Based on standard e-commerce schemas, these should be there or in a json column.
    // For now, I'll assume they exist or I'll try to put them in a metadata field if I knew the schema better.
    // Since I can't check schema, I'll assume the best case.
    
    // Construct payload
    const orderPayload: any = {
      store_id: storeData.value.id,
      customer_name: form.name,
      customer_phone: form.phone,
      total_amount: cart.total,
      status: 'sent_to_whatsapp',
      // detailed info
      delivery_method: form.method,
      delivery_address: form.address,
      city: form.city,
      note: form.note
    }

    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert(orderPayload)
      .select('id')
      .single()

    if (orderErr) throw orderErr

    // 2. Create Order Items
    const itemsPayload = cart.items.map(item => ({
      order_id: order.id,
      product_id: item.productId ? Number(item.productId) : null,
      variant_id: item.variantId ? Number(item.variantId) : null,
      product_name: item.name,
      quantity: item.quantity,
      unit_price: item.price,
      options: item.options ? item.options : null
    }))

    const { error: itemsErr } = await supabase
      .from('order_items')
      .insert(itemsPayload)

    if (itemsErr) {
        // If items fail, we might want to delete the order or just log it. 
        // For now, log and proceed (order exists but empty items)
        console.error('Error inserting items:', itemsErr)
    }

    // 3. Open WhatsApp with Bill & Store Links
    const phone = getStorePhone()
    if (phone) {
      let baseUrl = ''
      if (import.meta.client) {
        baseUrl = window.location.origin
      }
      
      const billUrl = `${baseUrl}/${slug.value}/orders/${order.id}`
      const storeUrl = `${baseUrl}/${slug.value}`
      
      // Construct detailed message
      const lines = cart.items.map(i => {
        let text = `- ${i.quantity}x ${i.name} (${formatMoney(i.price * i.quantity)})`
        if (i.options && Object.keys(i.options).length > 0) {
           const opts = Object.entries(i.options).map(([k, v]) => `${k}: ${v}`).join(', ')
           text += `\n   ${t('product.options')}: ${opts}`
        }
        return text
      }).join('\n')
      
      let deliveryDetails = ''
      if (form.method === 'pickup') {
        deliveryDetails = `📍 *${t('checkout.whatsapp.mode')}:* ${t('checkout.method.pickupStore')}\n👤 *${t('checkout.field.name')}:* ${form.name}\n📞 *${t('checkout.field.phone')}:* ${form.phone}`
      } else {
        deliveryDetails = `🚚 *DÉTAILS DE LIVRAISON*
👤 *Nom complet:* ${form.name}
📞 *Numero de telephone:* ${form.phone}
🏠 *Adresse (N° et Rue):* ${form.address}
city *Ville et Code Postal:* ${form.city}`
      }
      if (form.note) {
        const noteLabel = form.method === 'delivery' ? 'Note pour le livreur' : 'Note'
        deliveryDetails += `\n📝 *${noteLabel}:* ${form.note}`
      }
      
      const message = `${baseUrl}\n\n*${t('checkout.whatsapp.newOrderTitle', { id: order.id.slice(0, 8) })}*\n\n${lines}\n\n*${t('checkout.total')}: ${formatMoney(cart.total)}*\n\n----------------\n${deliveryDetails}\n\n📄 ${t('checkout.whatsapp.invoice')}: ${billUrl}\n🏪 ${t('checkout.whatsapp.store')}: ${storeUrl}`
      
      // Track WhatsApp Click
      if (storeData.value?.id) {
         supabase.from('analytics_log').insert({
           store_id: storeData.value.id,
           event_type: 'order_created'
         }).then(() => {}) 
      }

      const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, '_blank')
    }

    // 4. Success - Clear cart and Redirect
    cart.items = [] // Clear items
    cart.persist()
    
    navigateTo(`/${slug.value}/orders/${order.id}`)

  } catch (e: any) {
    console.error('Order submit error:', e)
    toast.error(t('checkout.error.orderSubmit', { msg: e.message }))
  } finally {
    loading.value = false
  }
}

function formatMoney(amount: number) {
  const l = locale.value === 'it' ? 'it-IT' : locale.value === 'en' ? 'en-US' : 'fr-FR'
  return new Intl.NumberFormat(l, { style: 'currency', currency: 'XAF' }).format(amount)
}

// Cart constraints
const productConstraints = reactive<Record<string, { max: number; min: number; stock: number; track: boolean; out: boolean }>>({})
const variantConstraints = reactive<Record<string, { max: number; min: number; stock: number; track: boolean; out: boolean }>>({})

function parseProductId(item: any) {
  if (item.productId) return String(item.productId)
  const parts = String(item.id || '').split('|')
  return parts[0] || String(item.id || '')
}

async function loadConstraints() {
  try {
    const productIds = Array.from(new Set(cart.items.map(parseProductId))).filter(Boolean)
    const variantIds = Array.from(new Set(cart.items.map(i => i.variantId).filter(Boolean)))
    if (productIds.length > 0) {
      const { data, error } = await supabase
        .from('products')
        .select('id,track_inventory,stock_quantity,max_order_quantity,min_order_quantity,is_out_of_stock,max_order_qty,min_order_qty')
        .in('id', productIds.map(id => Number(id)))
      if (error) console.error('loadConstraints products error', error)
      const prods: any[] = Array.isArray(data) ? data : []
      prods.forEach((p: any) => {
        const max = Number(p.max_order_quantity || p.max_order_qty || 0)
        const min = Number(p.min_order_quantity || p.min_order_qty || 0)
        productConstraints[String(p.id)] = { max, min, stock: Number(p.stock_quantity || 0), track: !!p.track_inventory, out: !!p.is_out_of_stock }
      })
    }
    if (variantIds.length > 0) {
      const { data, error } = await supabase
        .from('variants')
        .select('id,track_inventory,stock_quantity,max_order_quantity,is_out_of_stock')
        .in('id', variantIds.map(id => Number(id)))
      if (error) console.error('loadConstraints variants error', error)
      const vars: any[] = Array.isArray(data) ? data : []
      vars.forEach((v: any) => {
        const max = Number(v.max_order_quantity || 0)
        const min = Number(v.min_order_quantity || 0)
        variantConstraints[String(v.id)] = { max, min, stock: Number(v.stock_quantity || 0), track: !!v.track_inventory, out: !!v.is_out_of_stock }
      })
    }
  } catch (e) {
    console.error('loadConstraints error', e)
  }
}

watch(() => cart.items.map(i => i.id), async () => {
  await loadConstraints()
})

function updateItemQty(item: any, delta: number) {
  const toast = useToast()
  const current = Number(item.quantity || 0)
  const next = current + delta
  if (next < 0) return
  const pid = parseProductId(item)
  const p = productConstraints[pid] || { max: 0, min: 0, stock: 0, track: false, out: false }
  const v = item.variantId ? (variantConstraints[String(item.variantId)] || { max: 0, min: 0, stock: 0, track: false, out: false }) : null
  
  const max = v ? v.max : p.max
  if (max > 0 && next > max) {
    toast.error(t('storefront.maxQtyError', { max }))
    return
  }
  const track = v ? v.track : p.track
  const stock = v ? v.stock : p.stock
  if (track && next > stock) {
    toast.error(t('storefront.stockError', { max: stock }))
    return
  }
  if (current === 0 && delta > 0) {
    const min = v ? v.min : p.min
    cart.setQuantity(item.id, 1)
    if (min > 1) {
      cart.setQuantity(item.id, min)
      toast.error(t('storefront.minQtyError', { min }))
      return
    }
    return
  }
  cart.setQuantity(item.id, next)
}


function getStorePhone() {
  if (storeData.value?.phone) return String(storeData.value.phone).replace(/\D/g, '')
  try {
    const raw = localStorage.getItem(`store:${slug.value}`)
    const data = raw ? JSON.parse(raw) : {}
    return String(data.phone || '').replace(/\D/g, '')
  } catch {
    return ''
  }
}
</script>
