export default defineNuxtRouteMiddleware(async (to) => {
  if (!process.client) return
  try {
    if (to.path.startsWith('/admin')) {
      const nuxt = useNuxtApp()
      const supabase = nuxt.$supabase as any
      if (!supabase?.auth) {
        // Supabase not initialized, redirect to login (or error page?)
        // If config is missing, login won't work either.
        // But better than crash.
        return navigateTo('/auth/login')
      }
      const { data } = await supabase.auth.getUser()
      const user = data?.user
      if (!user) {
        try { localStorage.setItem('postLoginPath', to.fullPath) } catch {}
        return navigateTo('/auth/login')
      }
    }
  } catch {
    if (to.path.startsWith('/admin')) {
      try { localStorage.setItem('postLoginPath', to.fullPath) } catch {}
      return navigateTo('/auth/login')
    }
  }
})
