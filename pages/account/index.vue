<template>
  <div class="min-h-screen bg-gray-50 pb-12">
    <CatalogHeader />

    <main class="mx-auto max-w-5xl px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">{{ t('account.dashboard') }}</h1>

      <div class="grid gap-8 md:grid-cols-[300px_1fr]">
        <!-- Sidebar -->
        <div class="space-y-6">
          <div class="rounded-xl bg-white p-6 shadow-sm">
            <div class="flex flex-col items-center text-center">
              <div class="mb-4 h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <User class="h-10 w-10" />
              </div>
              <h2 class="text-xl font-bold">{{ user?.user_metadata?.full_name || 'Client' }}</h2>
              <p class="text-sm text-gray-500">{{ user?.email }}</p>
            </div>
            
            <div class="mt-6 border-t pt-6 space-y-2">
              <button 
                class="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left hover:bg-gray-50"
                :class="{ 'bg-primary/5 text-primary font-medium': activeTab === 'orders' }"
                @click="activeTab = 'orders'"
              >
                <ShoppingBag class="h-5 w-5" />
                {{ t('account.orders') }}
              </button>
              <button 
                class="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left hover:bg-gray-50"
                :class="{ 'bg-primary/5 text-primary font-medium': activeTab === 'profile' }"
                @click="activeTab = 'profile'"
              >
                <UserCog class="h-5 w-5" />
                {{ t('account.profile') }}
              </button>
              <button 
                @click="handleLogout"
                class="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left text-red-600 hover:bg-red-50"
              >
                <LogOut class="h-5 w-5" />
                {{ t('auth.logout') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="space-y-6">
          <!-- Orders Tab -->
          <div v-if="activeTab === 'orders'">
            <h2 class="text-xl font-bold mb-4">{{ t('account.orderHistory') }}</h2>
            
            <div v-if="loadingOrders" class="py-12 text-center">
               <div class="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            </div>

            <div v-else-if="orders.length === 0" class="rounded-xl bg-white p-12 text-center shadow-sm">
              <ShoppingBag class="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <p class="text-gray-500">{{ t('account.noOrders') }}</p>
            </div>

            <div v-else class="space-y-4">
              <div v-for="order in orders" :key="order.id" class="rounded-xl bg-white p-6 shadow-sm border border-gray-100 hover:border-primary/30 transition-colors">
                <div class="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <div class="text-sm text-gray-500">
                      {{ new Date(order.created_at).toLocaleDateString() }} • {{ new Date(order.created_at).toLocaleTimeString() }}
                    </div>
                    <div class="font-bold text-lg">
                      {{ formatMoney(order.total_amount) }}
                    </div>
                    <div class="text-sm font-medium text-primary mt-1">
                      {{ order.stores?.name }}
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <span 
                      class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                      :class="getStatusColor(order.status)"
                    >
                      {{ t(`order.status.${order.status}`) || order.status }}
                    </span>
                  </div>
                </div>
                
                <div class="border-t pt-4 text-sm text-gray-600">
                  <div class="flex items-center gap-2 mb-2">
                    <MapPin class="h-4 w-4" />
                    {{ order.city }}, {{ order.delivery_address }}
                  </div>
                  <div v-if="order.note" class="flex items-center gap-2 italic">
                    <MessageSquare class="h-4 w-4" />
                    "{{ order.note }}"
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Profile Tab -->
          <div v-if="activeTab === 'profile'">
            <h2 class="text-xl font-bold mb-4">{{ t('account.personalInfo') }}</h2>
            <div class="rounded-xl bg-white p-6 shadow-sm">
              <div class="grid gap-6 md:grid-cols-2">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('checkout.field.name') }}</label>
                  <div class="rounded-lg border bg-gray-50 px-4 py-2 text-gray-900">{{ user?.user_metadata?.full_name || '-' }}</div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('checkout.field.phone') }}</label>
                  <div class="rounded-lg border bg-gray-50 px-4 py-2 text-gray-900">{{ user?.user_metadata?.phone || '-' }}</div>
                </div>
                <div>
                   <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                   <div class="rounded-lg border bg-gray-50 px-4 py-2 text-gray-900">{{ user?.email }}</div>
                </div>
                 <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('checkout.field.cityDetail') }}</label>
                  <div class="rounded-lg border bg-gray-50 px-4 py-2 text-gray-900">{{ user?.user_metadata?.city || '-' }}</div>
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('checkout.field.addressDetail') }}</label>
                  <div class="rounded-lg border bg-gray-50 px-4 py-2 text-gray-900">{{ user?.user_metadata?.address || '-' }}</div>
                </div>
              </div>
              
              <div class="mt-6 flex justify-end">
                <p class="text-xs text-gray-500">
                  {{ t('account.editInfoHint') }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { User, ShoppingBag, LogOut, UserCog, MapPin, MessageSquare } from 'lucide-vue-next'

const { t } = useI18n()
const { user, signOut } = useAuth()
const nuxt = useNuxtApp()
const client = nuxt.$supabase as any
const router = useRouter()

const activeTab = ref('orders')
const loadingOrders = ref(false)
const orders = ref<any[]>([])

// Redirect if not logged in
watchEffect(() => {
  if (!user.value) {
    router.push('/')
  }
})

onMounted(() => {
  if (user.value) {
    fetchOrders()
  }
})

async function fetchOrders() {
  loadingOrders.value = true
  
  // We try to find orders by phone match since we sync it
  const phone = user.value?.user_metadata?.phone
  
  // If no phone, we can't find orders currently as we don't save user_id
  if (!phone) {
     orders.value = []
     loadingOrders.value = false
     return
  }
  
  const { data, error } = await client
    .from('orders')
    .select('*, stores(name)')
    .eq('customer_phone', phone)
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
  } else {
    orders.value = data || []
  }
  
  loadingOrders.value = false
}

async function handleLogout() {
  await signOut()
  router.push('/')
}

function getStatusColor(status: string) {
  switch (status) {
    case 'sent_to_whatsapp': return 'bg-green-100 text-green-800'
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    case 'cancelled': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

function formatMoney(amount: number) {
  return new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF' }).format(amount)
}
</script>
