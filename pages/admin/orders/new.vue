<template>
  <div class="mx-auto max-w-5xl px-4 py-8 pb-24">
    <div class="flex items-center gap-4 mb-6">
      <NuxtLink to="/admin/orders" class="p-2 rounded-full hover:bg-gray-100 transition-colors">
        <ArrowLeft class="h-5 w-5 text-gray-600" />
      </NuxtLink>
      <h1 class="text-2xl font-bold text-gray-900">{{ t('admin.ordersNew.title') }}</h1>
    </div>

    <div class="grid gap-6 lg:grid-cols-3">
      <!-- Left Column: Products & Totals -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Products Section -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h2 class="font-semibold text-gray-800 flex items-center gap-2">
              <ShoppingBag class="h-4 w-4" />
              {{ t('admin.ordersNew.productsTitle') }}
            </h2>
            <button @click="openProductModal" class="text-sm text-green-600 font-medium hover:text-green-700 hover:underline">
              {{ t('admin.ordersNew.addProduct') }}
            </button>
          </div>
          
          <div class="p-4">
            <div v-if="orderItems.length === 0" class="text-center py-8 text-gray-500 text-sm">
              {{ t('admin.ordersNew.noProducts') }}
            </div>
            <ul v-else class="divide-y divide-gray-100">
              <li v-for="(item, index) in orderItems" :key="index" class="py-3 flex items-center justify-between gap-4">
                <div class="flex-1">
                  <div class="font-medium text-gray-900">{{ item.product_name }}</div>
                  <div class="text-xs text-gray-500" v-if="item.variant_name">{{ item.variant_name }}</div>
                </div>
                <div class="flex items-center gap-3">
                  <input 
                    type="number" 
                    v-model.number="item.quantity" 
                    min="1" 
                    class="w-16 rounded border-gray-300 py-1 px-2 text-sm focus:border-green-500 focus:ring-green-500"
                    @change="calculateTotals"
                  />
                  <div class="w-24 text-right font-medium text-gray-900">
                    {{ formatPrice(item.unit_price * item.quantity) }}
                  </div>
                  <button @click="removeItem(index)" class="text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- Payment Section -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
           <div class="p-4 border-b border-gray-100 bg-gray-50">
            <h2 class="font-semibold text-gray-800 flex items-center gap-2">
              <CreditCard class="h-4 w-4" />
              {{ t('admin.ordersNew.paymentTitle') }}
            </h2>
          </div>
          <div class="p-4 space-y-3">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">{{ t('admin.ordersNew.subtotal') }}</span>
              <span class="font-medium">{{ formatPrice(subtotal) }}</span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-gray-600">{{ t('admin.ordersNew.deliveryFee') }}</span>
              <input 
                type="number" 
                v-model.number="deliveryFee" 
                class="w-24 text-right rounded border-gray-300 py-1 px-2 text-sm focus:border-green-500 focus:ring-green-500"
                @change="calculateTotals"
              />
            </div>
            <div class="pt-3 border-t border-gray-100 flex justify-between items-center">
              <span class="font-bold text-gray-900">{{ t('admin.ordersNew.total') }}</span>
              <span class="font-bold text-xl text-green-600">{{ formatPrice(total) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Client Info -->
      <div class="space-y-6">
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="p-4 border-b border-gray-100 bg-gray-50">
            <h2 class="font-semibold text-gray-800 flex items-center gap-2">
              <User class="h-4 w-4" />
              {{ t('admin.ordersNew.clientTitle') }}
            </h2>
          </div>
          <div class="p-4 space-y-4">
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">{{ t('admin.ordersNew.phoneLabel') }} <span class="text-red-500">*</span></label>
              <div class="relative">
                <input 
                  v-model="form.phone" 
                  type="text" 
                  :placeholder="t('admin.ordersNew.phonePlaceholder')"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm pl-10"
                  @blur="checkClient"
                />
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone class="h-4 w-4 text-gray-400" />
                </div>
                <div v-if="checkingClient" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Loader2 class="h-4 w-4 text-gray-400 animate-spin" />
                </div>
              </div>
              <p v-if="clientStatus === 'found'" class="mt-1 text-xs text-green-600 font-medium flex items-center gap-1">
                <CheckCircle class="h-3 w-3" /> {{ t('admin.ordersNew.clientFound') }}
              </p>
              <p v-if="clientStatus === 'new'" class="mt-1 text-xs text-blue-600 font-medium flex items-center gap-1">
                <PlusCircle class="h-3 w-3" /> {{ t('admin.ordersNew.clientNew') }}
              </p>
            </div>

            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">{{ t('admin.ordersNew.fullNameLabel') }} <span class="text-red-500">*</span></label>
              <input 
                v-model="form.name" 
                type="text" 
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
              />
            </div>

            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">{{ t('admin.ordersNew.deliveryAddressLabel') }}</label>
              <textarea 
                v-model="form.address" 
                rows="3" 
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
              ></textarea>
            </div>
             
             <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">{{ t('admin.ordersNew.noteLabel') }}</label>
              <textarea 
                v-model="form.notes" 
                rows="2" 
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
              ></textarea>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
           <label class="block text-xs font-medium text-gray-700 mb-1">{{ t('admin.ordersNew.statusLabel') }}</label>
           <select 
             v-model="form.status" 
             class="block w-full rounded-md border shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm font-medium"
             :class="statusClass(form.status)"
           >
             <option value="new">{{ t('admin.ordersPage.status.new') }}</option>
             <option value="sent_to_whatsapp">{{ t('admin.ordersPage.status.sent_to_whatsapp') }}</option>
             <option value="processing">{{ t('admin.ordersPage.status.processing') }}</option>
             <option value="completed">{{ t('admin.ordersPage.status.completed') }}</option>
             <option value="cancelled">{{ t('admin.ordersPage.status.cancelled') }}</option>
           </select>
        </div>

        <button 
          @click="submitOrder" 
          :disabled="submitting || orderItems.length === 0 || !form.phone || !form.name"
          class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Loader2 v-if="submitting" class="h-5 w-5 animate-spin mr-2" />
          {{ submitting ? t('admin.ordersNew.creating') : t('admin.ordersNew.create') }}
        </button>
      </div>
    </div>

    <!-- Product Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="showModal = false"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4" id="modal-title">
              {{ t('admin.ordersNew.modalTitle') }}
            </h3>
            <div class="mb-4">
               <input 
                 v-model="productSearch" 
                 type="text" 
                 :placeholder="t('admin.ordersNew.modalSearchPlaceholder')"
                 class="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
               />
            </div>
            <div class="mt-2 max-h-60 overflow-y-auto space-y-2">
               <div v-if="loadingProducts" class="text-center py-4 text-gray-500">{{ t('admin.ordersNew.loadingProducts') }}</div>
               <div v-else-if="filteredProducts.length === 0" class="text-center py-4 text-gray-500">{{ t('admin.ordersNew.noProductFound') }}</div>
               <div 
                 v-for="product in filteredProducts" 
                 :key="product.id" 
                 class="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                 @click="selectProduct(product)"
               >
                 <div class="flex justify-between items-center">
                  <span class="font-medium text-gray-900">{{ product.name }}</span>
                  <span class="text-sm font-semibold text-green-600">{{ formatPrice(product.price) }}</span>
                </div>
                <div class="text-xs text-gray-500" v-if="product.sku">SKU: {{ product.sku }}</div>
               </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" @click="showModal = false">
              {{ t('common.close') }}
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import type { SupabaseClient } from '@supabase/supabase-js'
import { useAdminStore } from '~/stores/admin'
import { useI18n } from '~/composables/i18n'
import { ArrowLeft, ShoppingBag, CreditCard, User, Phone, Loader2, CheckCircle, PlusCircle, Trash2 } from 'lucide-vue-next'

definePageMeta({ layout: 'admin' })

const nuxt = useNuxtApp()
const supabase = nuxt.$supabase as SupabaseClient
const admin = useAdminStore()
const router = useRouter()
const { t, locale } = useI18n()

// State
const form = reactive({
  phone: '',
  name: '',
  address: '',
  notes: '',
  status: 'new'
})
const clientStatus = ref<'idle' | 'checking' | 'found' | 'new'>('idle')
const checkingClient = ref(false)
const existingClientId = ref<string | null>(null)

const orderItems = ref<any[]>([])
const deliveryFee = ref(0)
const subtotal = ref(0)
const total = ref(0)

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800 border-blue-200',
  sent_to_whatsapp: 'bg-green-100 text-green-800 border-green-200',
  processing: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  completed: 'bg-gray-100 text-gray-800 border-gray-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200'
}

function statusClass(status: string) {
  return statusColors[status] || 'bg-white text-gray-700 border-gray-300'
}

const showModal = ref(false)
const productSearch = ref('')
const products = ref<any[]>([])
const loadingProducts = ref(false)
const submitting = ref(false)

// Computed
const filteredProducts = computed(() => {
  if (!productSearch.value) return products.value
  const term = productSearch.value.toLowerCase()
  return products.value.filter(p => p.name.toLowerCase().includes(term) || p.sku?.toLowerCase().includes(term))
})

// Methods
function formatPrice(amount: number) {
  return 'FCFA ' + Number(amount || 0).toLocaleString(getNumberLocale())
}

function getNumberLocale() {
  if (locale.value === 'fr') return 'fr-FR'
  if (locale.value === 'it') return 'it-IT'
  return 'en-US'
}

function calculateTotals() {
  subtotal.value = orderItems.value.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0)
  total.value = subtotal.value + (deliveryFee.value || 0)
}

function removeItem(index: number) {
  orderItems.value.splice(index, 1)
  calculateTotals()
}

async function checkClient() {
  if (!form.phone || form.phone.length < 5) return
  
  const storeId = admin.selectedShopId
  if (!storeId) return

  checkingClient.value = true
  clientStatus.value = 'checking'
  
  try {
    const { data } = await supabase
      .from('clients')
      .select('*')
      .eq('store_id', storeId)
      .eq('phone', form.phone) // Assuming exact match for now. Could add fuzzy logic later.
      .maybeSingle()
      
    if (data) {
      clientStatus.value = 'found'
      existingClientId.value = data.id
      // Auto-fill if empty
      if (!form.name) form.name = data.name
      if (!form.address) form.address = data.address || ''
    } else {
      clientStatus.value = 'new'
      existingClientId.value = null
    }
  } catch (e) {
    console.error('Error checking client:', e)
  } finally {
    checkingClient.value = false
  }
}

async function loadProducts() {
  const storeId = admin.selectedShopId
  if (!storeId) return
  
  loadingProducts.value = true
  try {
    const { data } = await supabase
      .from('products')
      .select('id, name, price, sku')
      .eq('store_id', storeId)
      .eq('is_visible', true)
      .order('name')
      
    products.value = data || []
  } catch (e) {
    console.error('Error loading products:', e)
  } finally {
    loadingProducts.value = false
  }
}

function openProductModal() {
  showModal.value = true
  if (products.value.length === 0) loadProducts()
}

function selectProduct(product: any) {
  // Check if already in order
  const existing = orderItems.value.find(i => i.product_id === product.id)
  if (existing) {
    existing.quantity++
  } else {
    orderItems.value.push({
      product_id: product.id,
      product_name: product.name,
      unit_price: product.price,
      quantity: 1
    })
  }
  calculateTotals()
  showModal.value = false
}

async function submitOrder() {
  const storeId = admin.selectedShopId
  if (!storeId) return
  if (orderItems.value.length === 0) {
    alert(t('admin.ordersNew.noProducts'))
    return
  }
  if (!form.phone || form.phone.length < 5) {
    alert(t('admin.ordersNew.phonePlaceholder'))
    return
  }
  if (!form.name) {
    alert(t('admin.ordersNew.fullNameLabel'))
    return
  }
  
  submitting.value = true
  let createdOrderId: string | null = null
  try {
    // 1. Handle Client
    let clientId = existingClientId.value
    
    // Double check existence to avoid duplicates or race conditions
    if (!clientId) {
       const { data: existing } = await supabase
        .from('clients')
        .select('id')
        .eq('store_id', storeId)
        .eq('phone', form.phone)
        .maybeSingle()
        
       if (existing) {
         clientId = existing.id
       }
    }
    
    if (!clientId) {
      // Create new client
      const { data: newClient, error: clientError } = await supabase
        .from('clients')
        .insert({
          store_id: storeId,
          name: form.name,
          phone: form.phone,
          address: form.address || null,
          notes: t('admin.ordersNew.autoCreatedNote')
        })
        .select('id')
        .single()
        
      if (clientError) throw clientError
      clientId = newClient.id
    } else {
        // Optionally update existing client info if changed? 
        // For now, let's keep it simple and not overwrite existing data unless necessary.
    }

    // 2. Create Order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        store_id: storeId,
        client_id: clientId,
        customer_name: form.name,
        customer_phone: form.phone,
        delivery_address: form.address,
        total_amount: total.value,
        delivery_fee: deliveryFee.value,
        status: form.status,
        note: form.notes // Ensure 'note' column exists in schema or use 'whatsapp_message' as fallback/note
      })
      .select('id')
      .single()
      
    if (orderError) throw orderError
    createdOrderId = order.id
    
    // 3. Create Order Items
    const itemsToInsert = orderItems.value.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      unit_price: item.unit_price,
      quantity: item.quantity
    }))
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(itemsToInsert)
      
    if (itemsError) throw itemsError
    
    // Success
    router.push('/admin/orders')
    
  } catch (e: any) {
    console.error('Error submitting order:', e)
    try {
      if (createdOrderId) {
        await supabase.from('order_items').delete().eq('order_id', createdOrderId)
        await supabase.from('orders').delete().eq('id', createdOrderId)
      }
    } catch (cleanupError) {
      console.error('Error cleaning up failed order creation:', cleanupError)
    }
    alert(t('admin.ordersNew.createError', { msg: e.message || e }))
  } finally {
    submitting.value = false
  }
}

// Init
onMounted(() => {
  // Pre-load products maybe? No, wait for user action.
})
useHead({ title: t('admin.ordersNew.headTitle') })
</script>
