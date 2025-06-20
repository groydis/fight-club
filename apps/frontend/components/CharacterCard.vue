<script setup lang="ts">
import type { Character } from '@/types/character'

const props = defineProps<{
  character?: Character
}>()

const emit = defineEmits<{
  (e: 'select', character: Character): void
  (e: 'create'): void
}>()

const handleClick = () => {
  if (props.character) emit('select', props.character)
  else emit('create')
}
</script>

<template>
  <button
    class="relative border border-zinc-800 hover:border-red-600 transition rounded-xl overflow-hidden group bg-zinc-900 shadow-md"
    @click="handleClick"
  >
    <img
      :src="character?.imageFrontUrl || '/images/question-mark.png'"
      :alt="character?.name || 'Create Fighter'"
      class="w-full aspect-square object-cover bg-black/60"
    />
    <div
      class="absolute bottom-0 w-full text-center bg-black/70 text-white text-sm p-1 group-hover:bg-red-700 transition"
    >
      {{ character?.name || 'Create Character' }}
    </div>
  </button>
</template>

