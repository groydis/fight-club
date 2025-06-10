<template>
  <div class="flex flex-col min-h-screen bg-zinc-950 text-zinc-100">
    <LoadingOverlay />
    <main class="flex-1 flex items-center justify-center px-4 py-12">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup>
import LoadingOverlay from '~/components/LoadingOverlay.vue'
</script>