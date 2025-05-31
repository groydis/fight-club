<template>
  <form class="flex flex-col gap-6" @submit.prevent="onSubmit">
    <h2 class="text-2xl font-bold text-white text-center uppercase tracking-wide">
      Create an Account
    </h2>

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

    <!-- CTA Button -->
    <button
      type="submit"
      class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-md transition-all uppercase tracking-wider"
    >
      Sign Up
    </button>

    <!-- Link -->
    <p class="text-sm text-center text-zinc-400">
      Already in the fight?
      <NuxtLink to="/auth?view=login" class="underline hover:text-red-500">Log in</NuxtLink>
    </p>
  </form>
</template>

<script setup lang="ts">
const form = reactive({ email: '', password: '' })
const { auth } = useSupabaseClient()

async function onSubmit() {
  try {
    const { error } = await auth.signUp(form)
    if (error) {
      throw error
    }
    await navigateTo('/auth?view=verify-email')
  } catch (e) {
    console.error('Signup error:', e)
  }
}
</script>
