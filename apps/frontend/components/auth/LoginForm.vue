<template>
  <form class="flex flex-col gap-6" @submit.prevent="onSubmit">
    <h1 class="text-2xl font-bold text-white tracking-wide uppercase">Enter the ring</h1>

    <!-- Email -->
    <div class="flex flex-col gap-1">
      <label for="email" class="text-xs font-medium text-zinc-400">Email</label>
      <input
        id="email"
        v-model="form.email"
        type="email"
        required
        class="bg-zinc-800 text-white border border-zinc-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-500"
      >
    </div>

    <!-- Password -->
    <div class="flex flex-col gap-1">
      <label for="password" class="text-xs font-medium text-zinc-400">Password</label>
      <input
        id="password"
        v-model="form.password"
        type="password"
        required
        class="bg-zinc-800 text-white border border-zinc-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-500"
      >
    </div>

    <!-- Submit -->
    <button
      type="submit"
      class="mt-2 bg-red-600 text-white font-bold py-2 rounded-md hover:bg-red-700 transition-all uppercase tracking-wider"
    >
      Login
    </button>

    <!-- Navigation Links -->
    <p class="mt-4 text-center text-sm text-zinc-400">
      <NuxtLink to="/auth?view=forgot-password" class="underline hover:text-red-500">Forgot Password?</NuxtLink>
    </p>
    <p class="text-center text-sm text-zinc-400">
      No account?
      <NuxtLink to="/auth?view=signup" class="underline hover:text-red-500">Sign up</NuxtLink>
    </p>
  </form>
</template>

<script setup lang="ts">
const { showLoading, hideLoading } = useLoading()
const form = reactive({ email: '', password: '' })

const { auth } = useSupabaseClient()

async function onSubmit() {
  showLoading()
  try {
    const { error } = await auth.signInWithPassword({
      email: form.email,
      password: form.password
    })

    if (error) {
      if (error.message?.toLowerCase().includes('email') && error.message.toLowerCase().includes('confirm')) {
        return await navigateTo('/auth?view=verify-email')
      }
      throw error
    }

    await navigateTo('/dashboard')
  } catch (e) {
    console.error('Login error:', e)
  } finally {
    hideLoading()
  }
}
</script>
