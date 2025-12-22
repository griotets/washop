export async function getServerSupabase() {
  const config = useRuntimeConfig()
  const url = String((config.public as any)?.supabaseUrl || '')
  const key = String((config as any)?.supabaseServiceKey || (config.public as any)?.supabaseAnonKey || '')
  const { createRequire } = await import('node:module')
  const require = createRequire(import.meta.url)
  const mod: any = require('@supabase/supabase-js')
  if (typeof mod?.createClient !== 'function') throw new Error('Failed to load Supabase createClient')
  return mod.createClient(url, key)
}
