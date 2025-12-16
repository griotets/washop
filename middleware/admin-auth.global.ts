export default defineNuxtRouteMiddleware(async (to) => {
  if (!process.client) return
  try {
    if (to.path.startsWith('/admin')) {
      const nuxt = useNuxtApp()
      const supabase = nuxt.$supabase as any
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
