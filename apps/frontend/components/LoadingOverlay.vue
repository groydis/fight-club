<!-- components/LoadingOverlay.vue -->
<script setup lang="ts">
const { loading } = useLoading()
</script>

<template>
  <div
    v-if="loading.value"
    class="fixed inset-0 z-50 bg-zinc-950 bg-opacity-90 backdrop-blur-sm flex items-center justify-center"
  >
    <div class="text-white text-2xl font-black tracking-wide animate-pulse">
      Loading...
    </div>
  </div>
</template>
