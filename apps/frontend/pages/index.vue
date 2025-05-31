<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-black to-zinc-800 px-4">
    <div class="text-center space-y-6">
      <h1 class="text-4xl font-bold text-white">Welcome to Fight Club</h1>
      <p class="text-zinc-400">Your battleground awaits.</p>
      <NuxtLink
        to="/auth"
        class="inline-block mt-4 px-6 py-2 bg-red-700 hover:bg-red-600 text-white font-bold rounded shadow hover:shadow-lg transition"
      >
        Enter the Arena
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

const user = useSupabaseUser()

onMounted(() => {
    console.log(user.value)
  if (user.value) {
    navigateTo('/dashboard')
  }
})
</script>
