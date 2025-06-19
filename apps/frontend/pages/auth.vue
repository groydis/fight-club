<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-black to-zinc-800 px-4">
    <div
      class="w-full max-w-md border border-zinc-700 bg-zinc-900/80 backdrop-blur-sm shadow-2xl rounded-xl p-8"
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
