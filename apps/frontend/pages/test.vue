<script setup lang="ts">
const { loading, showLoading, hideLoading } = useLoading()
</script>

<template>
  <div class="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6">
    <p>loading.value: {{ loading }}</p>
    <button @click="showLoading" class="bg-green-600 px-4 py-2 rounded">Show</button>
    <button @click="hideLoading" class="bg-red-600 px-4 py-2 rounded">Hide</button>
  </div>
</template>
