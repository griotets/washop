export default defineNuxtRouteMiddleware(async () => {
  const { user, refreshUser } = useAuth()
  if (!user.value) {
    await refreshUser()
  }
  if (!user.value) {
    return navigateTo('/auth/login')
  }
})
