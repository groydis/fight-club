<template>
  <form class="flex flex-col gap-6" @submit.prevent="onSubmit">
    <h2 class="text-2xl font-bold text-white text-center uppercase tracking-wide">
      Reset Your Password
    </h2>

    <!-- Email Field -->
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

    <!-- Submit Button -->
    <button
      type="submit"
      class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-md transition-all uppercase tracking-wider"
    >
      Send Reset Link
    </button>

    <!-- Navigation Link -->
    <p class="text-sm text-center text-zinc-400">
      Got it sorted?
      <NuxtLink to="/auth?view=login" class="underline hover:text-red-500">Back to login</NuxtLink>
    </p>
  </form>
</template>

<script setup lang="ts">
const form = reactive({ email: '' })
const { auth } = useSupabaseClient()

async function onSubmit() {
  try {
    const { error } = await auth.resetPasswordForEmail(form.email)
    if (error) {
      throw error
    }
    // Todo: maybe add a custom page here:
    await navigateTo('/auth?view=verify-email')
  } catch (e) {
    console.error('Error sending reset password email:', e)
  }
}
</script>
