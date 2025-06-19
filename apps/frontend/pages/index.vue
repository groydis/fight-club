<template>
  <div class="min-h-screen flex items-center justify-center bg-zinc-950 px-6 py-12">
    <div class="text-center space-y-6 max-w-md">
      <h1 class="text-4xl sm:text-5xl font-extrabold text-zinc-100 tracking-tight">
        Welcome to <span class="text-rose-600">Fight Club</span>
      </h1>
      <p class="text-zinc-400 text-lg">The arena is open. Only the brutal survive.</p>

      <NuxtLink
        to="/auth"
        class="inline-block px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold uppercase tracking-wide rounded shadow-lg transition-all duration-200"
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
  if (user.value) {
    navigateTo('/dashboard')
  }
})
</script>
