<script setup lang="ts">
const { loading } = useLoading()

watchEffect(() => {
  console.log('[LoadingOverlay] reactive loading =', loading.value)
})
</script>

<template>
  <Transition name="fade">
    <div
      v-if="loading"
      class="fixed inset-0 z-[9999] bg-zinc-950 bg-opacity-90 backdrop-blur-sm flex items-center justify-center"
    >
      <div class="text-white text-3xl font-bold animate-pulse tracking-wide">
        Loading...
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
