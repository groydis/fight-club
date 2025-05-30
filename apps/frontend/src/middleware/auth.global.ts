export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()

  if (!user.value && to.path !== '/auth') {
    return navigateTo('/auth')
  }

  if (user.value && to.path === '/auth') {
    return navigateTo('/dashboard')
  }
})
