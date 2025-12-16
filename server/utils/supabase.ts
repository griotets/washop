export async function getServerSupabase() {
  const config = useRuntimeConfig()
  const url = String((config.public as any)?.supabaseUrl || '')
  const key = String((config as any)?.supabaseServiceKey || (config.public as any)?.supabaseAnonKey || '')
  const { createClient } = await import('@supabase/supabase-js')
  return createClient(url, key)
}
