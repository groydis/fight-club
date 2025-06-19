export default defineNuxtRouteMiddleware(async (to) => {
  console.log('[middleware] Route hit:', to.fullPath)

  const supaUser = useSupabaseUser()
  const supa = useSupabaseClient()
  const userStore = useUserStore()

  const publicPaths = ['/', '/auth', '/auth/login', '/auth/signup']
  const isProfilePage = to.path.startsWith('/fighters/profile/')
  const isPublic = publicPaths.includes(to.path) || isProfilePage

  if (!supaUser.value && !isPublic) {
    return navigateTo('/auth')
  }

  if (!userStore.data && !userStore.loading) {
    userStore.loading = true
    try {
      const {
        data: { session },
      } = await supa.auth.getSession()

      if (!session?.access_token) return

      const token = session.access_token
      const config = useRuntimeConfig()
      const url = `${config.public.apiBase}/api/user`

      const userProfile = await $fetch<{
        user: {
          id: string
          email: string
          name: string
          role: string
          status: string
          username: string
        }
      }>(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      userStore.setUser(userProfile.user)
    } catch (err) {
      console.error('Failed to fetch user in middleware:', err)
    } finally {
      userStore.loading = false
    }
  }

  if (userStore.data && userStore.data.username === userStore.data.email) {
    if (to.path !== '/choose-username' && to.path !== '/welcome') {
      return navigateTo('/welcome')
    }
  }
})
