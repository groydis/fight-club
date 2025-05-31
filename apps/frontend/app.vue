<template>
  <div class="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-blue-900 text-white">
    <NuxtPage />
    <LoadingOverlay />
  </div>
</template>

<script setup>
import LoadingOverlay from '~/components/LoadingOverlay.vue'
</script>
