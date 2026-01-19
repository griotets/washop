import { createClient } from '@supabase/supabase-js'

export async function getServerSupabase() {
  const config = useRuntimeConfig()
  const url = String((config.public as any)?.supabaseUrl || '')
  const key = String((config as any)?.supabaseServiceKey || (config.public as any)?.supabaseAnonKey || '')
  
  return createClient(url, key)
}
