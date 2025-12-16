import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const url = String(config.public.supabaseUrl || '')
  const key = String(config.public.supabaseAnonKey || '')
  if (!url || !key) {
    throw new Error('Missing Supabase configuration: set NUXT_PUBLIC_SUPABASE_URL and NUXT_PUBLIC_SUPABASE_ANON_KEY')
  }
  const client: SupabaseClient = createClient(url, key)
  return {
    provide: {
      supabase: client
    }
  }
})
