<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-black to-zinc-800 px-4">
    <div
      class="w-full max-w-md bg-zinc-900 border border-zinc-700 p-8 rounded-xl shadow-2xl backdrop-blur-sm"
    >
      <component :is="currentComponent" />
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const currentComponent = computed(() => {
  switch (route.query.view) {
    case 'signup':
      return resolveComponent('SignupForm')
    case 'forgot-password':
      return resolveComponent('ForgotPasswordForm')
    case 'verify-email':
      return resolveComponent('VerifyEmailNotice')
    default:
      return resolveComponent('LoginForm')
  }
})
</script>
