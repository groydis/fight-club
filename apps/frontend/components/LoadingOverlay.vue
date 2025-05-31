<template>
  <div
    v-if="loading"
    class="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center"
  >
    <div class="text-white text-xl font-bold animate-pulse">
      Loading...
    </div>
  </div>
</template>

<script setup lang="ts">
const { loading } = useLoading()
</script>
