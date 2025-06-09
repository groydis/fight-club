<template>
  <form class="flex flex-col gap-6" @submit.prevent="onSubmit">
    <!-- Title -->
    <h2 class="text-2xl font-extrabold text-zinc-100 text-center uppercase tracking-wide">
      Reset Your Password
    </h2>

    <!-- Email Field -->
    <div class="flex flex-col gap-1">
      <label for="email" class="text-xs font-semibold text-zinc-400">Email</label>
      <input
        id="email"
        v-model="form.email"
        type="email"
        required
        class="bg-zinc-900 border border-zinc-700 rounded px-4 py-2 text-zinc-100 placeholder-zinc-500 
               focus:outline-none focus:ring-2 focus:ring-rose-600"
      >
    </div>

    <!-- Submit Button -->
    <button
      type="submit"
      class="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 rounded transition 
             uppercase tracking-wider shadow-sm hover:shadow-md"
    >
      Send Reset Link
    </button>

    <!-- Navigation Link -->
    <p class="text-sm text-center text-zinc-400">
      Got it sorted?
      <NuxtLink to="/auth?view=login" class="underline hover:text-rose-500">Back to login</NuxtLink>
    </p>
  </form>
</template>

<script setup lang="ts">
const { showLoading, hideLoading } = useLoading()
const form = reactive({ email: '' })
const { auth } = useSupabaseClient()

async function onSubmit() {
  showLoading()
  try {
    const { error } = await auth.resetPasswordForEmail(form.email)
    if (error) {
      throw error
    }
    await navigateTo('/auth?view=verify-email')
  } catch (e) {
    console.error('Error sending reset password email:', e)
  } finally {
    hideLoading()
  }
}
</script>
