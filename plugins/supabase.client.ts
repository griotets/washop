import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { defineNuxtPlugin, useRuntimeConfig } from '#app'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const url = String(config.public.supabaseUrl || '')
  const key = String(config.public.supabaseAnonKey || '')
  if (!url || !key) {
    console.error('Missing Supabase configuration: set NUXT_PUBLIC_SUPABASE_URL and NUXT_PUBLIC_SUPABASE_ANON_KEY')
    return {
      provide: {
        supabase: null as unknown as SupabaseClient
      }
    }
  }
  const client: SupabaseClient = createClient(url, key)
  return {
    provide: {
      supabase: client
    }
  }
})
