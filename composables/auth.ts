import type { SupabaseClient, User } from '@supabase/supabase-js'

export function useAuth() {
  const nuxt = useNuxtApp()
  const supabase = nuxt.$supabase as SupabaseClient
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function refreshUser() {
    const { data, error: e } = await supabase.auth.getUser()
    error.value = null
    user.value = data?.user ?? null
  }

  function isEmail(input: string) {
    return /.+@.+\..+/.test(input)
  }

  async function sendOtp(identifier: string) {
    loading.value = true
    try {
      if (!isEmail(identifier)) {
        error.value = 'Email required'
        return { error: error.value }
      }
      const { error: e } = await supabase.auth.signInWithOtp({ email: identifier, options: { shouldCreateUser: true } })
      error.value = e ? e.message : null
    } finally {
      loading.value = false
    }
    return { error: error.value }
  }

  async function verifyOtp(identifier: string, token: string) {
    loading.value = true
    try {
      if (!isEmail(identifier)) {
        error.value = 'Email required'
        return { user: null, error: error.value }
      }
      const { data, error: e } = await supabase.auth.verifyOtp({ token, type: 'email', email: identifier } as any)
      error.value = e ? e.message : null
      user.value = data?.user ?? null
    } finally {
      loading.value = false
    }
    return { user: user.value, error: error.value }
  }

  async function signIn(identifier: string, password: string) {
    loading.value = true
    if (!isEmail(identifier)) {
      loading.value = false
      error.value = 'Email required'
      return { user: null, error: error.value }
    }
    const { data, error: e } = await supabase.auth.signInWithPassword({ email: identifier, password } as any)
    loading.value = false
    error.value = e ? e.message : null
    user.value = data?.user ?? null
    return { user: user.value, error: error.value }
  }

  async function signUp(identifier: string, password: string) {
    loading.value = true
    if (!isEmail(identifier)) {
      loading.value = false
      error.value = 'Email required'
      return { user: null, error: error.value }
    }
    const { data, error: e } = await supabase.auth.signUp({ email: identifier, password } as any)
    loading.value = false
    error.value = e ? e.message : null
    user.value = data?.user ?? null
    return { user: user.value, error: error.value }
  }

  async function signOut() {
    loading.value = true
    const { error: e } = await supabase.auth.signOut()
    loading.value = false
    error.value = e ? e.message : null
    user.value = null
    return { error: error.value }
  }

  onMounted(() => {
    supabase.auth.onAuthStateChange(async () => {
      await refreshUser()
    })
    refreshUser()
  })

  return { user, loading, error, sendOtp, verifyOtp, signIn, signUp, signOut, refreshUser }
}
