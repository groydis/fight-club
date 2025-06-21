<template>
  <div class="relative min-h-screen bg-zinc-950 text-white">
    <!-- Loading overlay -->
    <LoadingOverlay />

    <!-- Top header -->
    <SiteHeader />
    <div class="border-t border-zinc-800" />

    <!-- Page content -->
    <main class="flex-1 px-4 sm:px-6 py-6">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup>
import LoadingOverlay from '~/components/LoadingOverlay.vue'
import SiteHeader from '~/components/SiteHeader.vue'
</script>
