<script setup lang="ts">
import type { Character } from '@/types/character'
import CharacterCard from './CharacterCard.vue'

defineProps<{
  characters: Character[]
  isLoading: boolean
}>()

defineEmits(['select'])
</script>

<template>
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
    <CharacterCard
      v-for="char in characters"
      :key="char.id"
      :character="char"
      @click="$emit('select', char)"
    />
    <div v-if="isLoading" class="col-span-full grid grid-cols-2 sm:grid-cols-5 gap-4">
      <div
        v-for="i in 4"
        :key="`skeleton-${i}`"
        class="animate-pulse bg-zinc-800 aspect-square rounded-xl"
      ></div>
    </div>
  </div>
</template>