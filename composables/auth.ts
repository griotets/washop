import type { SupabaseClient, User } from '@supabase/supabase-js'
import { parsePhoneNumber } from 'libphonenumber-js'

export function useAuth() {
  const nuxt = useNuxtApp()
  const supabase = nuxt.$supabase as SupabaseClient
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const toast = useToast()

  async function refreshUser() {
    if (!supabase?.auth) return
    const { data, error: e } = await supabase.auth.getUser()
    if (e) console.error('Refresh user error:', e)
    error.value = null
    user.value = data?.user ?? null
  }

  function isEmail(input: string) {
    return /.+@.+\..+/.test(input)
  }

  async function sendOtp(identifier: string) {
    loading.value = true
    try {
      if (!supabase?.auth) {
        error.value = 'Supabase client not initialized'
        console.error(error.value)
        toast.error(error.value)
        return { error: error.value }
      }

      // Ensure clean state before sending OTP
      const { data: currentSession } = await supabase.auth.getSession()
      if (currentSession?.session) {
         console.log('[Auth] Cleaning up existing session before sending OTP')
         await supabase.auth.signOut()
      }

      if (!isEmail(identifier)) {
        error.value = 'Email required'
        toast.error('Adresse email requise')
        return { error: error.value }
      }
      
      const otpPromise = supabase.auth.signInWithOtp({ email: identifier, options: { shouldCreateUser: true } })
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out after 30s')), 30000))
      
      const { error: e } = await Promise.race([otpPromise, timeoutPromise]) as any
      
      if (e) {
        console.error('Send OTP error:', e)
        toast.error(e.message)
      } else {
        toast.success('Code envoyé avec succès')
      }
      error.value = e ? e.message : null
    } catch(err) {
      console.error(err)
      toast.error(String(err))
    } finally {
      loading.value = false
    }
    return { error: error.value }
  }

  async function verifyOtp(identifier: string, token: string) {
    console.log('[Auth] verifyOtp called', { identifier, token })
    loading.value = true
    try {
      if (!supabase?.auth) {
        console.error('[Auth] Supabase client not initialized')
        error.value = 'Supabase client not initialized'
        toast.error(error.value)
        return { user: null, error: error.value }
      }
      if (!isEmail(identifier)) {
        console.warn('[Auth] Invalid email format', identifier)
        error.value = 'Email required'
        toast.error('Adresse email invalide')
        return { user: null, error: error.value }
      }
      console.log('[Auth] Calling supabase.auth.verifyOtp with:', { email: identifier, tokenLength: token.length, type: 'email' })
      
      // Re-introducing a safety timeout (30s) to prevent infinite spinner
      const verifyPromise = supabase.auth.verifyOtp({ token: token.trim(), type: 'email', email: identifier } as any)
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Verification timed out after 30s')), 30000))
      
      const { data, error: e } = await Promise.race([verifyPromise, timeoutPromise]) as any
      
      console.log('[Auth] verifyOtp result:', { data, error: e })
      if (e) {
        console.error(e)
        toast.error('Erreur vérification: ' + e.message)
      } else {
        toast.success('Connexion réussie')
      }
      error.value = e ? e.message : null
      user.value = data?.user ?? null
    } catch (err) {
      console.error('[Auth] verifyOtp exception:', err)
      error.value = String(err)
      toast.error('Erreur: ' + String(err))
    } finally {
      loading.value = false
    }
    return { user: user.value, error: error.value }
  }

  async function signIn(identifier: string, password: string) {
    loading.value = true
    if (!supabase?.auth) {
      loading.value = false
      error.value = 'Supabase client not initialized'
      toast.error(error.value)
      return { user: null, error: error.value }
    }
    if (!isEmail(identifier)) {
      loading.value = false
      error.value = 'Email required'
      toast.error('Email requis')
      return { user: null, error: error.value }
    }
    const { data, error: e } = await supabase.auth.signInWithPassword({ email: identifier, password } as any)
    loading.value = false
    if (e) {
      console.error(e)
      toast.error(e.message)
    } else {
      toast.success('Connexion réussie')
    }
    error.value = e ? e.message : null
    user.value = data?.user ?? null
    return { user: user.value, error: error.value }
  }

  async function signUp(identifier: string, password: string) {
    loading.value = true
    if (!supabase?.auth) {
      loading.value = false
      error.value = 'Supabase client not initialized'
      toast.error(error.value)
      return { user: null, error: error.value }
    }
    if (!isEmail(identifier)) {
      loading.value = false
      error.value = 'Email required'
      toast.error('Email requis')
      return { user: null, error: error.value }
    }
    
    const signUpPromise = supabase.auth.signUp({ email: identifier, password } as any)
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out after 30s')), 30000))
    
    const { data, error: e } = await Promise.race([signUpPromise, timeoutPromise]) as any
    
    loading.value = false
    if (e) {
      console.error(e)
      toast.error(e.message)
    } else {
      toast.success('Inscription réussie')
    }
    error.value = e ? e.message : null
    user.value = data?.user ?? null
    return { user: user.value, error: error.value }
  }

  async function signOut() {
    loading.value = true
    if (!supabase?.auth) {
      loading.value = false
      return { error: 'Supabase client not initialized' }
    }
    
    const signOutPromise = supabase.auth.signOut()
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('SignOut timed out')), 5000))
    
    let e = null
    try {
      const res = await Promise.race([signOutPromise, timeoutPromise]) as any
      e = res?.error
    } catch (err) {
      console.error(err)
      e = { message: 'Déconnexion lente ou échouée' }
    }
    
    loading.value = false
    if (e) {
      console.error(e)
      toast.error(e.message)
    } else {
      toast.success('Déconnecté')
    }
    error.value = e ? e.message : null
    user.value = null
    return { error: error.value }
  }

  async function sendWhatsAppOtp(phone: string) {
    loading.value = true
    try {
      if (!supabase?.functions) {
        throw new Error('Supabase functions not initialized')
      }

      // Validate phone number with libphonenumber-js
      let formattedPhone = phone
      try {
        const parsed = parsePhoneNumber(phone)
        if (!parsed || !parsed.isValid()) {
          throw new Error('Numéro de téléphone invalide')
        }
        formattedPhone = parsed.number
      } catch (e: any) {
        throw new Error(e.message || 'Numéro de téléphone invalide (format international requis)')
      }
      
      const generatedCode = Math.floor(100000 + Math.random() * 900000).toString()

      // Use direct fetch to avoid Supabase client timeout issues
      const config = useRuntimeConfig()
      const supabaseUrl = config.public.supabaseUrl
      const supabaseKey = config.public.supabaseAnonKey

      const invokePromise = fetch(`${supabaseUrl}/functions/v1/send-whatsapp-otp`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phone: formattedPhone, code: generatedCode })
      }).then(async res => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.error?.message || data.error || 'Erreur inconnue')
        return { data, error: null }
      })

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out after 30s')), 30000)
      )

      const { data, error: e } = (await Promise.race([invokePromise, timeoutPromise])) as any

      if (e) throw e
      
      toast.success('Code WhatsApp envoyé')
      return { code: generatedCode, error: null }
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Erreur lors de l\'envoi du code')
      return { code: null, error: err.message }
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    if (supabase?.auth) {
      supabase.auth.onAuthStateChange(async () => {
        await refreshUser()
      })
      refreshUser()
    }
  })

  return {
    user,
    loading,
    error,
    refreshUser,
    sendOtp,
    verifyOtp,
    signIn,
    signUp,
    signOut,
    sendWhatsAppOtp
  }
}
