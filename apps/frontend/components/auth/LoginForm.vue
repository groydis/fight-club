<template>
  <form class="flex flex-col gap-6" @submit.prevent="onSubmit">
    <!-- Title -->
    <h1 class="text-2xl font-extrabold text-zinc-100 tracking-wide text-center uppercase">
      Enter the Ring
    </h1>

    <!-- Email Field -->
    <div class="flex flex-col gap-1">
      <label for="email" class="text-xs font-semibold text-zinc-400">Email</label>
      <input
        id="email"
        v-model="form.email"
        type="email"
        required
        class="bg-zinc-900 text-zinc-100 placeholder-zinc-500 border border-zinc-700 rounded px-4 py-2 
               focus:outline-none focus:ring-2 focus:ring-rose-600"
      >
    </div>

    <!-- Password Field -->
    <div class="flex flex-col gap-1">
      <label for="password" class="text-xs font-semibold text-zinc-400">Password</label>
      <input
        id="password"
        v-model="form.password"
        type="password"
        required
        class="bg-zinc-900 text-zinc-100 placeholder-zinc-500 border border-zinc-700 rounded px-4 py-2 
               focus:outline-none focus:ring-2 focus:ring-rose-600"
      >
    </div>

    <!-- Submit Button -->
    <button
      type="submit"
      class="mt-2 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 rounded 
             uppercase tracking-wider shadow-sm hover:shadow-md transition-all"
    >
      Login
    </button>

    <!-- Navigation Links -->
    <p class="mt-4 text-center text-sm text-zinc-400">
      <NuxtLink to="/auth?view=forgot-password" class="underline hover:text-rose-500">
        Forgot Password?
      </NuxtLink>
    </p>
    <p class="text-center text-sm text-zinc-400">
      No account?
      <NuxtLink to="/auth?view=signup" class="underline hover:text-rose-500">
        Sign up
      </NuxtLink>
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
