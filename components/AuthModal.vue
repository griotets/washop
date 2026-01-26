<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl relative">
      <button @click="$emit('close')" class="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
        <X class="h-6 w-6" />
      </button>

      <div class="mb-6 text-center">
        <h2 class="text-xl font-bold">{{ title || (isLogin ? t('checkout.login.title') : t('checkout.register.title')) }}</h2>
        <p class="text-sm text-gray-600">{{ subtitle || (isLogin ? t('checkout.login.subtitle') : t('checkout.register.subtitle')) }}</p>
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
             <label class="text-sm font-medium">{{ t('auth.whatsapp.label') }}</label>
             <PhoneInput v-model="whatsappPhone" />
           </div>
           <button 
              @click="handleWhatsAppSend" 
              :disabled="loading || !whatsappPhone"
              class="w-full rounded-lg bg-[#25D366] py-3 font-semibold text-white disabled:opacity-50 hover:bg-[#128C7E]"
           >
              <span v-if="loading" class="animate-spin mr-2 inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              {{ isLogin ? t('auth.whatsapp.sendCode') : t('auth.whatsapp.createAccount') }}
           </button>
        </div>
        
        <div v-else class="space-y-4">
           <div class="space-y-2">
             <label class="text-sm font-medium">{{ t('auth.whatsapp.verifyLabel') }}</label>
             <input v-model="whatsappCode" type="text" class="w-full rounded-lg border p-2 text-center text-xl tracking-widest font-mono" placeholder="123456" maxlength="6" />
             <p class="text-xs text-gray-500">{{ t('auth.whatsapp.codeSent', { phone: whatsappPhone }) }}</p>
           </div>
           <button 
              @click="handleWhatsAppVerify" 
              class="w-full rounded-lg bg-primary py-3 font-semibold text-white disabled:opacity-50"
           >
              {{ t('auth.whatsapp.verify') }}
           </button>
           <button @click="whatsappStep = 'phone'" class="w-full text-sm text-gray-500 hover:underline">
             {{ t('auth.whatsapp.changePhone') }}
           </button>
        </div>

        <div class="text-center text-sm text-gray-600">
          <button @click="isLogin = !isLogin" class="text-primary hover:underline">
            {{ isLogin ? t('auth.login.noAccount') + ' ' + t('checkout.register.action') : t('auth.login.signIn') }}
          </button>
        </div>
      </div>

      <!-- Login/Register Form (Email) -->
      <div v-else class="space-y-4">
        <!-- OTP Mode (Only option now) -->
        <div class="space-y-4">
          <div v-if="emailStep === 'email'" class="space-y-4">
            <div class="space-y-2">
              <label class="text-sm font-medium">{{ t('auth.login.emailLabel') || 'Email' }}</label>
              <input 
                v-model="form.email" 
                type="email" 
                class="w-full rounded-lg border p-2 focus:border-primary focus:ring-primary" 
                placeholder="email@exemple.com" 
                @keyup.enter="handleEmailOtpSend"
              />
            </div>
            <button 
              @click="handleEmailOtpSend" 
              :disabled="loading || !form.email"
              class="w-full rounded-lg bg-primary py-3 font-semibold text-white disabled:opacity-50 hover:brightness-110 transition-all"
            >
              <span v-if="loading" class="animate-spin mr-2 inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              {{ t('register.continueEmail') || 'Recevoir le code' }}
            </button>
          </div>

          <div v-else class="space-y-4">
            <div class="space-y-2">
              <label class="text-sm font-medium">{{ t('register.codeLabel') || 'Code de vérification' }}</label>
              <input 
                v-model="emailOtpCode" 
                type="text" 
                inputmode="numeric"
                class="w-full rounded-lg border p-2 text-center text-xl tracking-widest font-mono" 
                placeholder="12345678" 
                maxlength="8" 
                @keyup.enter="handleEmailOtpVerify"
              />
              <p class="text-xs text-gray-500">{{ t('register.codeMessage', { email: form.email }) || `Code envoyé à ${form.email}` }}</p>
            </div>
            <button 
              @click="handleEmailOtpVerify" 
              :disabled="loading || !emailOtpCode"
              class="w-full rounded-lg bg-primary py-3 font-semibold text-white disabled:opacity-50 hover:brightness-110 transition-all"
            >
              <span v-if="loading" class="animate-spin mr-2 inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              {{ t('register.verifyContinue') || 'Vérifier & Continuer' }}
            </button>
            <button @click="emailStep = 'email'" class="w-full text-sm text-gray-500 hover:underline">
              {{ t('auth.login.editEmail') || "Modifier l'email" }}
            </button>
          </div>

          <div class="text-center text-sm text-gray-600">
            <button @click="isLogin = !isLogin" class="text-primary hover:underline">
              {{ isLogin ? t('auth.login.noAccount') + ' ' + t('checkout.register.action') : t('auth.login.signIn') }}
            </button>
          </div>
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
import { X } from 'lucide-vue-next'

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
const emailStep = ref<'email' | 'code'>('email')
const emailOtpCode = ref('')
const form = ref({
  email: ''
})

async function handleEmailOtpSend() {
  if (!form.value.email) return
  loading.value = true
  const res = await auth.sendOtp(form.value.email)
  loading.value = false
  if (!res.error) {
    emailStep.value = 'code'
  }
}

async function handleEmailOtpVerify() {
  if (!emailOtpCode.value) return
  loading.value = true
  const res = await auth.verifyOtp(form.value.email, emailOtpCode.value)
  loading.value = false
  if (res.user) {
    emit('login-success', res.user)
    form.value.email = ''
    emailOtpCode.value = ''
    emailStep.value = 'email'
  }
}

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
     // Create a session-like user object
     const mockUser = { 
       id: 'guest-verified', 
       aud: 'authenticated',
       created_at: new Date().toISOString(),
       app_metadata: { provider: 'whatsapp' },
       user_metadata: { phone: whatsappPhone.value },
       email: whatsappPhone.value + '@whatsapp.local',
       phone: whatsappPhone.value,
       role: 'authenticated',
       updated_at: new Date().toISOString()
     }
     
     // Update global auth state
     auth.user.value = mockUser as any
     
     // Persist to LocalStorage for page refresh
     try {
       localStorage.setItem('whatsapp-session', JSON.stringify(mockUser))
     } catch (e) {
       console.error('Failed to save whatsapp session', e)
     }

     emit('login-success', mockUser)
     
     toast.success(t('auth.phoneVerified'))
  } else {
    toast.error(t('auth.codeIncorrect'))
  }
}
</script>
