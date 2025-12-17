import type { SupabaseClient, User } from '@supabase/supabase-js'

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
      const { error: e } = await supabase.auth.signInWithOtp({ email: identifier, options: { shouldCreateUser: true } })
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
    const { data, error: e } = await supabase.auth.signUp({ email: identifier, password } as any)
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
    const { error: e } = await supabase.auth.signOut()
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

  onMounted(() => {
    if (supabase?.auth) {
      supabase.auth.onAuthStateChange(async () => {
        await refreshUser()
      })
      refreshUser()
    }
  })

  return { user, loading, error, sendOtp, verifyOtp, signIn, signUp, signOut, refreshUser }
}
