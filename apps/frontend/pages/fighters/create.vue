<template>
  <div class="max-w-2xl mx-auto p-6 space-y-6">
    <h1 class="text-3xl font-bold">Create Fighter</h1>

    <p class="text-sm text-gray-400">
      Begin crafting your fighter. Start with a name and a short description of who they are or what they’re about.
    </p>

    <form class="space-y-4" @submit.prevent="submitCreateCharacterSuggestion">
      <!-- Name Field -->
      <div>
        <label class="block font-semibold mb-1">Name</label>
        <input
          v-model="form.name"
          :disabled="loading"
          type="text"
          class="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none"
          required
        >
      </div>

      <!-- Description Field -->
      <div>
        <label class="block font-semibold mb-1">Description</label>
        <textarea
          v-model="form.description"
          :disabled="loading"
          class="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none"
          rows="4"
          required
        />
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="loading"
        class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white disabled:opacity-50"
      >
        <span v-if="loading" class="flex items-center gap-2">
          <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          Generating...
        </span>

        <span v-else>Generate Fighter</span>
      </button>
    </form>

    <!-- Results -->
    <div v-if="suggestion" class="mt-10 space-y-8">
      <!-- Stats -->
      <div>
        <h2 class="text-2xl font-bold mb-2">Stats</h2>
        <p class="text-sm text-gray-400 mb-4">
          These stats are suggestions based on your fighter’s description. You may modify them, but they will directly impact your fighter’s performance in battle.
        </p>
        <p class="text-sm text-yellow-400 mt-2">
          You have {{ remainingPoints }} of {{ MAX_TOTAL_STAT_POINTS }} points left.
        </p>
        <div class="space-y-2">
          <div
            v-for="(value, key) in suggestion.stats"
            :key="key"
            class="flex items-center gap-2"
          >
            <div class="flex items-center gap-1 w-36">
              <label class="capitalize">
                {{ STAT_EMOJI_MAP[key] }} {{ key }}
              </label>
              <span
                v-tippy="{ content: STAT_EXPLANATION_MAP[key], placement: 'top', theme: 'light-border' }"
                class="cursor-help"
              >
                (?)
              </span>
            </div>

            <div class="flex items-center gap-1">
              <button
                type="button"
                class="bg-gray-700 px-2 py-1 rounded text-white hover:bg-gray-600 disabled:opacity-30"
                :disabled="value <= MIN_POINTS_PER_STAT"
                @click="decreaseStat(key)"
              >-</button>

              <input
                :value="value"
                readonly
                class="w-12 text-center p-1 rounded bg-gray-800 border border-gray-700"
              >

              <button
                type="button"
                class="bg-gray-700 px-2 py-1 rounded text-white hover:bg-gray-600 disabled:opacity-30"
                :disabled="remainingPoints <= 0 || value >= MAX_POINTS_PER_STAT"
                @click="increaseStat(key)"
              >+</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Basic Moves -->
      <div>
        <h2 class="text-2xl font-bold mb-2">Basic Moves</h2>
        <p v-if="selectedBasicMoves.length < 2" class="text-sm text-yellow-400 mt-2">
          Please select 2 basic moves.
        </p>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="(move, index) in suggestion.basicMoves"
            :key="'basic-' + index"
            type="button"
            class="p-2 rounded border text-left transition-all"
            :class="{
              'bg-blue-700 border-blue-500 text-white': isSelected(index, 'basic'),
              'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700': !isSelected(index, 'basic'),
              'opacity-50 cursor-not-allowed': !isSelected(index, 'basic') && selectedBasicMoves.length >= 2
            }"
            :disabled="!isSelected(index, 'basic') && selectedBasicMoves.length >= 2"
            @click="toggleMove(index, 'basic')"
          >
            {{ STAT_EMOJI_MAP[move.primaryStat] }} {{ move.name }}
          </button>
        </div>
      </div>

      <!-- Special Moves -->
      <div>
        <h2 class="text-2xl font-bold mb-2">Special Moves</h2>
        <p v-if="selectedSpecialMoves.length < 2" class="text-sm text-yellow-400 mt-2">
          Please select 2 special moves.
        </p>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="(move, index) in suggestion.specialMoves"
            :key="'special-' + index"
            type="button"
            class="p-2 rounded border text-left transition-all"
            :class="{
              'bg-purple-700 border-purple-500 text-white': isSelected(index, 'special'),
              'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700': !isSelected(index, 'special'),
              'opacity-50 cursor-not-allowed': !isSelected(index, 'special') && selectedSpecialMoves.length >= 2
            }"
            :disabled="!isSelected(index, 'special') && selectedSpecialMoves.length >= 2"
            @click="toggleMove(index, 'special')"
          >
            {{ STAT_EMOJI_MAP[move.primaryStat] }} {{ move.name }}
          </button>
        </div>
      </div>

      <!-- Warning & Finalize -->
      <div class="bg-yellow-900 text-yellow-300 p-4 rounded text-sm">
        ⚠️ Once you submit your fighter, there’s no turning back. Make sure everything looks good before finalizing.
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white disabled:opacity-50"
        @click="finaliseCharacter"
      >
        <span v-if="loading" class="flex items-center gap-2">
          <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          Finalising...
        </span>
        <span v-else>Finalise Fighter</span>
    </button>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { CharacterSuggestion, SuggestCharacterStatsDto, Character, CreateCharacterDto } from '@/types/character'
import { STAT_EMOJI_MAP } from '@/utils/stat-emoji.map'
import { STAT_EXPLANATION_MAP } from '@/utils/stat-explanation.map'

const form = ref<SuggestCharacterStatsDto>({
  name: '',
  description: '',
})

const loading = ref(false)
const suggestion = ref<CharacterSuggestion | null>(null)

const submitCreateCharacterSuggestion = async () => {
  loading.value = true
  suggestion.value = null

  try {
    const { execute, data, error } = await useCustomFetch<CharacterSuggestion, SuggestCharacterStatsDto>(
      '/api/character/suggestion',
      {
        method: 'POST',
        body: form.value,
      }
    )

    await execute()

    if (error.value) throw error.value

    suggestion.value = data.value as CharacterSuggestion
    if (!suggestion.value) {
      throw new Error('No suggestion returned from the server')
    }
  } catch (err) {
    console.error('Failed to fetch character suggestion:', err)
  } finally {
    loading.value = false
  }
}

// STATS
const MAX_POINTS_PER_STAT = 10
const MAX_TOTAL_STAT_POINTS = 30
const MIN_POINTS_PER_STAT = 1

const remainingPoints = computed(() => {
  if (!suggestion.value) return 0
  const totalAllocated = Object.values(suggestion.value.stats).reduce((acc, val) => acc + val, 0)
  return MAX_TOTAL_STAT_POINTS - totalAllocated
})

function increaseStat(stat: keyof CharacterSuggestion['stats']) {
  if (!suggestion.value) return
  if (remainingPoints.value <= 0 || suggestion.value.stats[stat] >= MAX_POINTS_PER_STAT) return
  suggestion.value.stats[stat]++
}

function decreaseStat(stat: keyof CharacterSuggestion['stats']) {
  if (!suggestion.value) return
  if (suggestion.value.stats[stat] <= MIN_POINTS_PER_STAT) return
  suggestion.value.stats[stat]--
}

// Moves
const selectedBasicMoves = ref<number[]>([])
const selectedSpecialMoves = ref<number[]>([])

function toggleMove(index: number, type: 'basic' | 'special') {
  const selected = type === 'basic' ? selectedBasicMoves : selectedSpecialMoves

  if (selected.value.includes(index)) {
    selected.value = selected.value.filter(i => i !== index)
  } else {
    if (selected.value.length >= 2) return
    selected.value.push(index)
  }
}

function isSelected(index: number, type: 'basic' | 'special') {
  const selected = type === 'basic' ? selectedBasicMoves : selectedSpecialMoves
  return selected.value.includes(index)
}

const finaliseCharacter = async () => {
  if (!suggestion.value) return;
  loading.value = true

  try {
    const payload = {
      name: form.value.name,
      description: form.value.description,
      stats: suggestion.value.stats,
      basicMoves: selectedBasicMoves.value.map((i) => suggestion.value!.basicMoves[i]),
      specialMoves: selectedSpecialMoves.value.map((i) => suggestion.value!.specialMoves[i]),
    };

    const { execute, data, error } = await useCustomFetch<Character, CreateCharacterDto>(
      '/api/character',
      {
        method: 'POST',
        body: payload,
      }
    );

    await execute();

    if (error.value) throw error.value;

    console.log('Character created!', data.value);
    navigateTo('/fighters');
  } catch (err) {
    console.error('Failed to finalize character:', err);
  } finally {
    loading.value = false
  }
};

</script>
