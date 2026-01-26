<template>
  <div class="min-h-screen bg-gray-50 pb-12">
    <CatalogHeader />

    <main class="mx-auto max-w-5xl px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">{{ t('account.dashboard') }}</h1>

      <div v-if="checkingSession" class="grid grid-cols-1 gap-8 md:grid-cols-[300px_1fr]">
         <!-- Skeleton Sidebar -->
         <div class="space-y-6">
           <div class="rounded-xl bg-white p-6 shadow-sm animate-pulse">
             <div class="flex flex-col items-center text-center">
               <div class="mb-4 h-20 w-20 rounded-full bg-gray-200"></div>
               <div class="h-6 w-32 bg-gray-200 rounded mb-2"></div>
               <div class="h-4 w-48 bg-gray-200 rounded"></div>
             </div>
             <div class="mt-6 border-t pt-6 space-y-2">
               <div class="h-10 w-full bg-gray-200 rounded"></div>
               <div class="h-10 w-full bg-gray-200 rounded"></div>
               <div class="h-10 w-full bg-gray-200 rounded"></div>
             </div>
           </div>
         </div>
         <!-- Skeleton Content -->
         <div class="space-y-6">
            <div class="h-8 w-48 bg-gray-200 rounded mb-4 animate-pulse"></div>
            <div class="space-y-4">
              <div class="rounded-xl bg-white p-6 shadow-sm h-32 animate-pulse"></div>
              <div class="rounded-xl bg-white p-6 shadow-sm h-32 animate-pulse"></div>
            </div>
         </div>
      </div>

      <div v-else class="grid grid-cols-1 gap-8 md:grid-cols-[300px_1fr]">
        <!-- Sidebar -->
        <div class="space-y-6">
          <div class="rounded-xl bg-white p-6 shadow-sm">
            <div class="flex flex-col items-center text-center">
              <div class="mb-4 h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <User class="h-10 w-10" />
              </div>
              <h2 class="text-xl font-bold">{{ user?.user_metadata?.full_name || t('account.defaultName') }}</h2>
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
                :disabled="loggingOut"
                class="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                <Loader2 v-if="loggingOut" class="h-5 w-5 animate-spin" />
                <LogOut v-else class="h-5 w-5" />
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
            
            <div v-if="loadingOrders" class="space-y-4">
               <div class="rounded-xl bg-white p-6 shadow-sm h-32 animate-pulse" v-for="i in 3" :key="i"></div>
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
            <div class="rounded-xl bg-white p-6 shadow-sm">
              <h2 class="text-xl font-bold mb-6">{{ t('account.personalInfo') }}</h2>
              
              <div class="space-y-6">
                <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <!-- Name -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      {{ t('checkout.fullName') }}
                    </label>
                    <input 
                      v-model="profileForm.full_name"
                      type="text"
                      class="w-full rounded-lg border-gray-300 px-4 py-2 focus:border-primary focus:ring-primary shadow-sm"
                      :placeholder="t('checkout.namePlaceholder')"
                    />
                  </div>

                  <!-- Email -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      {{ t('checkout.email') }}
                    </label>
                    <input 
                      v-model="profileForm.email"
                      type="email"
                      class="w-full rounded-lg border-gray-300 px-4 py-2 focus:border-primary focus:ring-primary shadow-sm"
                      :placeholder="t('checkout.emailPlaceholder')"
                    />
                  </div>

                  <!-- Phone -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      {{ t('checkout.phone') }}
                    </label>
                    <PhoneInput v-model="profileForm.phone" />
                  </div>

                  <!-- City -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      {{ t('checkout.field.city') }}
                    </label>
                    <input 
                      v-model="profileForm.city"
                      type="text"
                      class="w-full rounded-lg border-gray-300 px-4 py-2 focus:border-primary focus:ring-primary shadow-sm"
                      placeholder="Douala, Yaoundé..."
                    />
                  </div>
                </div>

                <!-- Address -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    {{ t('checkout.field.address') }}
                  </label>
                  <AddressAutocomplete 
                    :initial-value="profileForm.address"
                    :placeholder="t('checkout.searchAddressPlaceholder')"
                    @select="handleAddressSelect"
                  />
                  <!-- Fallback manual input if needed, but AddressAutocomplete handles text input too via its query model if we bind it right. 
                       Actually AddressAutocomplete uses its own internal query. 
                       We should probably sync it or just use a simple input if AddressAutocomplete is too strict. 
                       Looking at AddressAutocomplete code, it emits 'select' but doesn't bind v-model nicely for simple text updates that aren't selections.
                       Let's add a simple input below it or instead of it if we want full manual control? 
                       Actually, let's just use a simple input for address for now to be safe, as AddressAutocomplete is specialized. 
                       Wait, the user wants 'custom information'. 
                       Let's use a simple textarea/input for address to ensure they can type whatever they want.
                  -->
                   <textarea 
                      v-model="profileForm.address"
                      rows="2"
                      class="mt-2 w-full rounded-lg border-gray-300 px-4 py-2 focus:border-primary focus:ring-primary shadow-sm"
                      :placeholder="t('checkout.addressPlaceholder')"
                    ></textarea>
                </div>

                <div class="flex justify-end pt-4 border-t">
                  <button 
                    @click="saveProfile" 
                    :disabled="savingProfile"
                    class="rounded-lg bg-primary px-6 py-2.5 font-semibold text-white hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
                  >
                    <Loader2 v-if="savingProfile" class="h-4 w-4 animate-spin" />
                    {{ t('common.save') || 'Enregistrer' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { User, ShoppingBag, LogOut, UserCog, MapPin, MessageSquare, Loader2 } from 'lucide-vue-next'
import { useAuth } from '~/composables/auth'
import PhoneInput from '~/components/PhoneInput.vue'
import AddressAutocomplete from '~/components/AddressAutocomplete.vue'

const { t } = useI18n()
const { user, signOut, refreshUser } = useAuth()
const nuxt = useNuxtApp()
const client = nuxt.$supabase as any
const router = useRouter()
const route = useRoute()
const toast = useToast()
const slug = computed(() => String(route.params['boutiqueSlug'] || ''))

const activeTab = ref('orders')
const loadingOrders = ref(false)
const orders = ref<any[]>([])
const checkingSession = ref(true)

// Profile Form
const savingProfile = ref(false)
const loggingOut = ref(false)
const profileForm = reactive({
  full_name: '',
  email: '',
  phone: '',
  city: '',
  address: ''
})

onMounted(async () => {
  checkingSession.value = true
  // Ensure we have the latest user state
  if (!user.value) {
    await refreshUser()
  }
  
  if (!user.value) {
    // Not logged in, redirect
    router.push(slug.value ? `/${slug.value}` : '/')
  } else {
    console.log('MyAccount user:', user.value)
    
    // Log user info as requested
    console.log('[MyAccount] User info loaded:', { 
      userId: user.value.id, 
      name: user.value.user_metadata?.full_name, 
      email: user.value.email 
    })

    // Init form
    initProfileForm()

    // Logged in, fetch data
    checkingSession.value = false
    fetchOrders()
  }
})

function initProfileForm() {
  if (!user.value) return
  const m = user.value.user_metadata || {}
  profileForm.full_name = m.full_name || ''
  profileForm.email = user.value.email || m.email || ''
  profileForm.phone = m.phone || ''
  profileForm.city = m.city || ''
  profileForm.address = m.address || ''
}

// Watch for logout or session loss
watch(() => user.value, (newUser) => {
   // Only redirect if we are not currently initializing/checking session
   if (!newUser && !checkingSession.value) {
     router.push(slug.value ? `/${slug.value}` : '/')
   } else if (newUser) {
     initProfileForm()
   }
})

function handleAddressSelect(data: { city: string; address: string; full: any }) {
  if (data.city) profileForm.city = data.city
  if (data.address) profileForm.address = data.address
}

async function saveProfile() {
  if (!user.value) return
  savingProfile.value = true
  
  try {
    const updates = {
      full_name: profileForm.full_name,
      email: profileForm.email, // Note: updating email in metadata doesn't change auth email
      phone: profileForm.phone,
      city: profileForm.city,
      address: profileForm.address
    }

    // 1. Update Supabase User
    // Note: This only updates metadata. To update actual email/phone requires different calls and re-verification.
    // For this simple profile, we assume metadata is the source of truth for display.
    const updatePromise = client.auth.updateUser({
      data: updates
    })
    
    // Timeout safety
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout updating user')), 15000)
    )

    const { error } = await Promise.race([updatePromise, timeoutPromise]) as any

    if (error) throw error

    // 2. If Guest/WhatsApp Session (check if it exists in local storage)
    if (process.client && localStorage.getItem('whatsapp-session')) {
       // Merge updates into existing session object
       const currentSession = JSON.parse(localStorage.getItem('whatsapp-session') || '{}')
       const updatedSession = {
         ...currentSession,
         email: profileForm.email, // Allow updating email property on the object
         user_metadata: {
           ...currentSession.user_metadata,
           ...updates
         }
       }
       localStorage.setItem('whatsapp-session', JSON.stringify(updatedSession))
       
       // Force update local reactive state
       user.value = updatedSession
    } else {
       // Force refresh to get latest metadata in UI if it was a real Supabase update
       // (Supabase client should handle this, but explicit refresh helps)
       await refreshUser() 
    }

    toast.success(t('common.saved') || 'Profil mis à jour')
  } catch (e: any) {
    console.error('Error saving profile:', e)
    toast.error(e.message || 'Erreur lors de la sauvegarde')
  } finally {
    savingProfile.value = false
  }
}


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
  loggingOut.value = true
  try {
    // Add timeout for signOut too
    const signOutPromise = signOut()
    const timeoutPromise = new Promise(resolve => setTimeout(resolve, 5000))
    await Promise.race([signOutPromise, timeoutPromise])
    
    router.push(slug.value ? `/${slug.value}` : '/')
  } finally {
    loggingOut.value = false
  }
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
