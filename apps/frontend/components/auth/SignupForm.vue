<script setup lang="ts">
const { showLoading, hideLoading } = useLoading()
const form = reactive({ email: '', password: '' })
const { auth } = useSupabaseClient()

async function onSubmit() {
  showLoading()
  try {
    const { error } = await auth.signUp(form)
    if (error) {
      throw error
    }
    await navigateTo('/auth?view=verify-email')
  } catch (e) {
    console.error('Signup error:', e)
  } finally {
    hideLoading()
  }
}
</script>


<template>
  <form class="flex flex-col gap-6" @submit.prevent="onSubmit">
    <!-- Title -->
    <h2 class="text-2xl font-extrabold text-zinc-100 text-center uppercase tracking-wide">
      Create an Account
    </h2>

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
      class="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 rounded 
             uppercase tracking-wider shadow-sm hover:shadow-md transition-all"
    >
      Sign Up
    </button>

    <!-- Navigation Link -->
    <p class="text-sm text-center text-zinc-400">
      Already in the fight?
      <NuxtLink to="/auth?view=login" class="underline hover:text-rose-500">
        Log in
      </NuxtLink>
    </p>
  </form>
</template>
