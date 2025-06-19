export default defineNuxtRouteMiddleware(async (to) => {
  const supaUser = useSupabaseUser()
  const supa = useSupabaseClient()
  const userStore = useUserStore()

  // 1. Redirect unauthenticated from /dashboard
  if (!supaUser.value && to.path === '/dashboard') {
    return navigateTo('/auth')
  }

  // 2. If we haven’t loaded user yet, fetch from backend with JWT
  if (!userStore.data && !userStore.loading) {
    userStore.loading = true;
    try {
      // Get the current session’s access_token (JWT)
      const {
        data: { session }
      } = await supa.auth.getSession()

      if (!session?.access_token) {
        // no token → likely not logged in
        return
      }
      const token = session.access_token

      // Build full backend URL
      const config = useRuntimeConfig()
      const url = `${config.public.apiBase}/api/user`

      // Call $fetch with Authorization header
      const userProfile = await $fetch<{ user: { id: string, email: string, name: string, role: string, status: string, username: string } }>(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      userStore.setUser({ ...userProfile.user})
    } catch (err) {
      console.error('Failed to fetch user in middleware:', err)
      // You could optionally redirect to /auth on 401, etc.
    } finally {
      userStore.loading = false;
    }
  }

  // 3. If user.name === 'Unnamed', redirect to /welcome
  if (userStore.data && userStore.data.username === userStore.data.email) {
    if (to.name !== '/choose-username' && to.path !== '/welcome') {
      // TODO:
      return navigateTo('/welcome')
    }
  }
})
