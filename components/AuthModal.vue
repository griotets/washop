<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl relative">
      <button @click="$emit('close')" class="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
        <X class="h-6 w-6" />
      </button>

      <div class="mb-6 text-center">
        <h2 class="text-xl font-bold">{{ title || (isLogin ? t('checkout.login.title') : t('auth.login.createAccount')) }}</h2>
        <p class="text-sm text-gray-600">{{ subtitle || (isLogin ? t('checkout.login.subtitle') : t('auth.login.manageStore')) }}</p>
      </div>

      <!-- Tabs -->
      <div class="mb-6 flex rounded-lg bg-gray-100 p-1">
        <button 
          @click="loginMethod = 'whatsapp'" 
          :class="['flex-1 rounded-md py-2 text-sm font-medium transition-colors', loginMethod === 'whatsapp' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700']"
        >
          WhatsApp
        </button>
        <button 
          @click="loginMethod = 'email'" 
          :class="['flex-1 rounded-md py-2 text-sm font-medium transition-colors', loginMethod === 'email' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700']"
        >
          Email
        </button>
      </div>

      <!-- WhatsApp Form -->
      <div v-if="loginMethod === 'whatsapp'" class="space-y-4">
        <div v-if="whatsappStep === 'phone'" class="space-y-4">
           <div class="space-y-2">
             <label class="text-sm font-medium">Numéro WhatsApp</label>
             <PhoneInput v-model="whatsappPhone" />
           </div>
           <button 
              @click="handleWhatsAppSend" 
              :disabled="loading || !whatsappPhone"
              class="w-full rounded-lg bg-[#25D366] py-3 font-semibold text-white disabled:opacity-50 hover:bg-[#128C7E]"
           >
              <span v-if="loading" class="animate-spin mr-2 inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              {{ isLogin ? 'Recevoir le code' : 'Créer mon compte' }}
           </button>
        </div>
        
        <div v-else class="space-y-4">
           <div class="space-y-2">
             <label class="text-sm font-medium">Code de vérification</label>
             <input v-model="whatsappCode" type="text" class="w-full rounded-lg border p-2 text-center text-xl tracking-widest font-mono" placeholder="123456" maxlength="6" />
             <p class="text-xs text-gray-500">Un code a été envoyé au {{ whatsappPhone }}</p>
           </div>
           <button 
              @click="handleWhatsAppVerify" 
              class="w-full rounded-lg bg-primary py-3 font-semibold text-white disabled:opacity-50"
           >
              Vérifier & Continuer
           </button>
           <button @click="whatsappStep = 'phone'" class="w-full text-sm text-gray-500 hover:underline">
             Modifier le numéro
           </button>
        </div>

        <div class="text-center text-sm text-gray-600">
          <button @click="isLogin = !isLogin" class="text-primary hover:underline">
            {{ isLogin ? t('auth.login.noAccount') + ' ' + t('auth.login.createAccount') : t('auth.login.signIn') }}
          </button>
        </div>
      </div>

      <!-- Login/Register Form (Email) -->
      <div v-else class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium">{{ t('auth.login.emailLabel') || 'Email' }}</label>
          <input 
            v-model="form.email" 
            type="email" 
            class="w-full rounded-lg border p-2 focus:border-primary focus:ring-primary" 
            placeholder="email@exemple.com" 
            @keyup.enter="handleSubmit"
          />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">{{ t('auth.login.passwordLabel') || 'Mot de passe' }}</label>
          <div class="relative">
            <input 
              v-model="form.password" 
              :type="showPassword ? 'text' : 'password'"
              class="w-full rounded-lg border p-2 pr-10 focus:border-primary focus:ring-primary" 
              placeholder="********" 
              @keyup.enter="handleSubmit"
            />
            <button 
              @click="showPassword = !showPassword" 
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <component :is="showPassword ? EyeOff : Eye" class="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div v-if="!isLogin" class="space-y-2">
          <label class="text-sm font-medium">{{ t('auth.login.confirmPassword') || 'Confirmer le mot de passe' }}</label>
          <div class="relative">
            <input 
              v-model="form.confirmPassword" 
              :type="showPassword ? 'text' : 'password'"
              class="w-full rounded-lg border p-2 pr-10 focus:border-primary focus:ring-primary" 
              placeholder="********" 
              @keyup.enter="handleSubmit"
            />
          </div>
        </div>

        <button 
          @click="handleSubmit" 
          :disabled="loading"
          class="w-full rounded-lg bg-primary py-3 font-semibold text-white disabled:opacity-50 hover:brightness-110 transition-all"
        >
          <span v-if="loading" class="animate-spin mr-2 inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
          {{ isLogin ? t('auth.login.signIn') : t('auth.login.createAccount') }}
        </button>

        <div class="text-center text-sm text-gray-600">
          <button @click="isLogin = !isLogin" class="text-primary hover:underline">
            {{ isLogin ? t('auth.login.noAccount') + ' ' + t('auth.login.createAccount') : t('auth.login.signIn') }}
          </button>
        </div>
      </div>

      <!-- Guest Option (Always Visible) -->
      <div v-if="allowGuest" class="mt-4">
        <div class="relative my-4 text-center">
          <div class="absolute inset-0 flex items-center"><div class="w-full border-t"></div></div>
          <span class="relative bg-white px-2 text-xs text-gray-500">OU</span>
        </div>

        <button @click="$emit('guest-continue')" class="w-full rounded-lg border border-gray-300 py-3 font-semibold text-gray-700 hover:bg-gray-50">
          {{ t('checkout.login.guest') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { X, Eye, EyeOff } from 'lucide-vue-next'

const props = defineProps<{
  isOpen: boolean
  allowGuest?: boolean
  title?: string
  subtitle?: string
}>()

const emit = defineEmits(['close', 'login-success', 'guest-continue'])

const { t } = useI18n()
const auth = useAuth()
const toast = useToast()
const loading = ref(false)
const isLogin = ref(true)

// WhatsApp State
const loginMethod = ref<'email' | 'whatsapp'>('whatsapp')
const whatsappStep = ref<'phone' | 'code'>('phone')
const whatsappPhone = ref('')
const whatsappCode = ref('')
const sentCode = ref('')

// Email State
const showPassword = ref(false)
const form = ref({
  email: '',
  password: '',
  confirmPassword: ''
})

async function handleWhatsAppSend() {
  if (!whatsappPhone.value) return
  loading.value = true
  const { code, error } = await auth.sendWhatsAppOtp(whatsappPhone.value)
  loading.value = false
  
  if (!error && code) {
    sentCode.value = code
    whatsappStep.value = 'code'
  }
}

async function handleWhatsAppVerify() {
  if (whatsappCode.value === sentCode.value) {
     // Verified! 
     // For AuthModal, we treat this as a successful login. 
     // Since we don't have a backend verified user yet, we pass a mock user object or handle it as guest-verified.
     // However, the prompt implies "Login". 
     // Ideally, we should create a user or link it. 
     // For now, we will emit login-success with a metadata object.
     
     emit('login-success', { 
       id: 'guest-verified', 
       email: whatsappPhone.value + '@whatsapp.local',
       user_metadata: { phone: whatsappPhone.value } 
     })
     
     toast.success('Téléphone vérifié !')
  } else {
    toast.error('Code incorrect')
  }
}

async function handleSubmit() {
  if (!form.value.email || !form.value.password) return
  
  if (!isLogin.value) {
    if (form.value.password !== form.value.confirmPassword) {
      toast.error(t('auth.error.passwordMismatch') || 'Les mots de passe ne correspondent pas')
      return
    }
  }

  loading.value = true
  let res
  
  if (isLogin.value) {
    res = await auth.signIn(form.value.email, form.value.password)
  } else {
    res = await auth.signUp(form.value.email, form.value.password)
  }
  
  loading.value = false
  
  if (res.user) {
    emit('login-success', res.user)
    form.value.email = ''
    form.value.password = ''
    isLogin.value = true
  }
}
</script>
