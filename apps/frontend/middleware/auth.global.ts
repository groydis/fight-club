export default defineNuxtRouteMiddleware((to) => {
  const userStore = useUserStore()
  const supaUser = useSupabaseUser()

  const publicPaths = ['/', '/auth', '/auth/login', '/auth/signup']
  const isProfilePage = to.path.startsWith('/fighters/profile/')
  const isPublic = publicPaths.includes(to.path) || isProfilePage

  if (!supaUser.value && !isPublic) {
    return navigateTo('/auth')
  }

  if (userStore.user && userStore.user.username === userStore.user.email) {
    if (to.path !== '/choose-username' && to.path !== '/welcome') {
      return navigateTo('/welcome')
    }
  }
})
