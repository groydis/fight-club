<template>
  <div
    class="p-4 rounded text-sm tracking-wide border"
    :class="[
      variant === 'positive' && 'bg-green-950 text-green-300 border-green-700',
      variant === 'warning' && 'bg-yellow-950 text-yellow-300 border-yellow-700',
      (variant === 'danger' || !variant) && 'bg-red-950 text-red-300 border-red-700'
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  variant?: 'danger' | 'warning' | 'positive'
}>()
</script>
