<script setup lang="ts">
import type { Character, CharacterMoveDetailed, CharacterStats } from '@/types/character'
import { STAT_EMOJI_MAP } from '@/utils/stat-emoji.map'
import { STAT_EXPLANATION_MAP } from '@/utils/stat-explanation.map'
import { alignmentOptions } from '@/utils/alignment-options'

import { computed } from 'vue'
import { useUserStore } from '~/stores/user'

const props = defineProps<{
  character: Character
}>()

const { user } = useUserStore()

const isOwner = computed(() => props.character.userId === user?.id)

const alignmentLabel = computed(() => {
  const found = alignmentOptions.find(opt => opt.value === props.character.alignment)
  return found?.label || 'Unknown'
})


const statEntries = computed<[keyof CharacterStats, number][]>(() =>
  Object.entries(props.character.stats) as [keyof CharacterStats, number][]
)

const basicMoves = computed<CharacterMoveDetailed[]>(() =>
  (props.character.moves || []).filter((m) => m.type === 'BASIC')
)

const specialMoves = computed<CharacterMoveDetailed[]>(() =>
  (props.character.moves || []).filter((m) => m.type === 'SPECIAL')
)
</script>

<template>
  <div
    class="relative grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-900/60 border border-zinc-800 rounded-lg p-6 shadow-xl"
  >
    <button
      class="absolute top-2 left-2 bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1 rounded-md text-xs"
      @click="$emit('back')"
    >
      ← Back
    </button>

    <!-- Images -->
    <div class="flex flex-col gap-6">
      <div class="flex flex-col items-center">
        <img
          :src="character.imageFrontUrl"
          :alt="character.name + ' Profile Picture'"
          class="w-64 rounded-lg object-cover aspect-square border border-zinc-700"
        />
        <span class="mt-2 text-sm text-zinc-400">Profile Picture</span>
      </div>

      <div class="flex flex-col items-center">
        <img
          :src="character.imageProfileUrl"
          :alt="character.name + ' Combat Pose'"
          class="w-64 rounded-lg object-cover aspect-square border border-zinc-700"
        />
        <span class="mt-2 text-sm text-zinc-400">Combat Pose</span>
      </div>
    </div>

    <!-- Details -->
    <div class="space-y-6">
      <div>
        <h2 class="text-3xl font-bold text-red-600 tracking-wide uppercase">
          {{ character.name }}
        </h2>
        <p><span class="text-zinc-300 font-semibold">Trainer:</span> {{ character.trainer || 'Unknown' }}</p>
        <p class="text-sm text-zinc-400 italic">{{ character.lore }}</p>
      </div>

      <div class="text-sm text-zinc-400 space-y-1">
        <p><span class="text-zinc-300 font-semibold">Gender:</span> {{ character.gender || 'Unknown' }}</p>
        <p><span class="text-zinc-300 font-semibold">Species:</span> {{ character.species || 'Unknown' }}</p>
        <p>
          <span class="text-zinc-300 font-semibold">Alignment:</span>
          {{ alignmentLabel }}
        </p>
      </div>

      <!-- Stats -->
      <div>
        <h3 class="text-xl font-semibold text-white uppercase mb-2">Stats</h3>
        <div class="grid grid-cols-2 gap-2">
          <div
            v-for="([statKey, statVal], idx) in statEntries"
            :key="idx"
            class="flex items-center gap-2"
          >
            <span class="text-2xl">{{ STAT_EMOJI_MAP[statKey] }}</span>
            <span class="capitalize text-zinc-300">{{ statKey }}:</span>
            <span class="font-bold text-white">{{ statVal }}</span>
            <span
              v-tippy="{
                content: STAT_EXPLANATION_MAP[statKey],
                placement: 'top',
                theme: 'light-border'
              }"
              class="cursor-help text-zinc-500"
            >
              (?)
            </span>
          </div>
        </div>
      </div>

      <!-- Moves -->
      <div>
        <h3 class="text-xl font-semibold text-white uppercase mb-2">Basic Moves</h3>
        <div class="space-y-3">
          <div
            v-for="(move, i) in basicMoves"
            :key="i"
            class="border-l-4 border-red-600 pl-3"
          >
            <span class="text-xl">{{ STAT_EMOJI_MAP[move.primaryStat] }}</span>
            <span class="font-medium text-white">{{ move.name }}</span>
            <p class="text-sm text-zinc-400">{{ move.description }}</p>
          </div>
        </div>

        <h3 class="text-xl font-semibold text-white uppercase mt-6 mb-2">Special Moves</h3>
        <div class="space-y-3">
          <div
            v-for="(move, i) in specialMoves"
            :key="i"
            class="border-l-4 border-purple-600 pl-3"
          >
            <span class="text-xl">{{ STAT_EMOJI_MAP[move.primaryStat] }}</span>
            <span class="font-medium text-white">{{ move.name }}</span>
            <p class="text-sm text-zinc-400">{{ move.description }}</p>
          </div>
        </div>
      </div>

      <div class="pt-4" v-if="isOwner">
        <button
          class="bg-red-800 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-md"
          @click="$emit('delete')"
        >
          🗑️ Delete Character
        </button>
      </div>
    </div>
  </div>
</template>
