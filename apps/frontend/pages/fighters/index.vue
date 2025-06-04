<template>
  <div class="flex justify-center items-center min-h-screen">
    <div class="p-10">
      <!-- Character Select Screen -->
      <div
        v-if="!selectedCharacter"
        class="grid gap-4 grid-rows-5 grid-cols-2 sm:grid-rows-2 sm:grid-cols-5"
      >
        <button
          v-for="index in 10"
          :key="index"
          class="relative border-2 border-transparent hover:border-fuchsia-500 transition rounded-xl overflow-hidden group"
          @click="
            characters[index - 1]
              ? selectCharacter(characters[index - 1])
              : goToCreate()
          "
        >
          <img
            :src="characters[index - 1]?.imageProfileUrl || '/images/question-mark.png'"
            :alt="characters[index - 1]?.name || 'Create Fighter'"
            class="w-full aspect-square object-cover bg-black/50"
          >
          <div
            class="absolute bottom-0 w-full text-center bg-black/60 text-white text-sm p-1 group-hover:bg-fuchsia-700"
          >
            {{ characters[index - 1]?.name || 'Create Character' }}
          </div>
        </button>
      </div>

      <!-- Character Detail Panel -->
      <div
        v-else
        class="relative max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 p-4"
      >
        <button
          class="absolute top-2 left-2 bg-gray-800 text-white px-3 py-1 rounded-md text-xs"
          @click="selectedCharacter = null"
        >
          ← Back
        </button>

        <!-- Left: Profile Image -->
        <img
          :src="selectedCharacter.imageProfileUrl"
          :alt="selectedCharacter.name"
          class="w-full rounded-xl object-cover aspect-square"
        >

        <!-- Right: Details -->
        <div class="space-y-6">
          <!-- Name / Description / Lore -->
          <div>
            <h2 class="text-3xl font-bold">{{ selectedCharacter.name }}</h2>
            <p class="text-sm text-gray-300">{{ selectedCharacter.lore }}</p>
          </div>

          <!-- Stats (read-only) -->
          <div>
            <h3 class="text-xl font-semibold mb-2">Stats</h3>
            <div class="grid grid-cols-2 gap-2">
              <div
                v-for="([statKey, statVal], idx) in statEntries"
                :key="idx"
                class="flex items-center gap-2"
              >
                <!-- Emoji + Stat Name -->
                <span class="text-2xl">{{ STAT_EMOJI_MAP[statKey] }}</span>
                <span class="capitalize font-medium">{{ statKey }}:</span>
                <span class="font-bold">{{ statVal }}</span>
                <span
                  v-tippy="{
                    content: STAT_EXPLANATION_MAP[statKey],
                    placement: 'top',
                    theme: 'light-border'
                  }"
                  class="cursor-help text-gray-500"
                >
                  (?)
                </span>
              </div>
            </div>
          </div>

          <!-- Moves -->
          <div>
            <h3 class="text-xl font-semibold mb-2">Basic Moves</h3>
            <div class="list-disc list-inside space-y-1">
              <div v-for="(move, i) in basicMoves" :key="i" class="gap-2">
                <span class="text-2xl pr-1">{{ STAT_EMOJI_MAP[move.primaryStat] }}</span>
                <span class="capitalize font-medium">{{ move.name }}</span>
                <p class="text-sm text-gray-400"> {{ move.description }}</p>
              </div>
            </div>

            <h3 class="text-xl font-semibold mt-4 mb-2">Special Moves</h3>
            <div class="list-disc list-inside space-y-1">
              <div v-for="(move, i) in specialMoves" :key="i">
                <span class="text-2xl pr-1">{{ STAT_EMOJI_MAP[move.primaryStat]  }}</span>
                <span class="font-medium">{{ move.name }}</span>
                <p class="text-sm text-gray-400"> {{ move.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type {
  Character,
  CharacterMoveDetailed,
  MoveType,
  CharacterStats
} from '@/types/character'
import { STAT_EMOJI_MAP } from '@/utils/stat-emoji.map'
import { STAT_EXPLANATION_MAP } from '@/utils/stat-explanation.map'

const characters = ref<Character[]>([])
const selectedCharacter = ref<Character | null>(null)
const loading = ref(false)
const router = useRouter()

const fetchCharacters = async () => {
  loading.value = true
  try {
    const { data, error, execute } = await useCustomFetch('/api/characters', {
      method: 'GET',
    })
    await execute()
    if (error.value) throw error.value

    characters.value = (data.value as Character[]) || []
  } catch (err) {
    console.error('Failed to fetch characters:', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchCharacters)

const selectCharacter = (character: Character) => {
  selectedCharacter.value = character
}
const goToCreate = () => {
  router.push('/fighters/create')
}

const statEntries = computed<[keyof CharacterStats, number][]>(() => {
  if (!selectedCharacter.value) return []
  return Object.entries(
    selectedCharacter.value.stats
  ) as [keyof CharacterStats, number][]
})

const basicMoves = computed<CharacterMoveDetailed[]>(() => {
  if (!selectedCharacter.value) return []
  return (selectedCharacter.value.moves || []).filter(
    (m) =>
      m.type === ('BASIC' as unknown as MoveType)
  )
})

const specialMoves = computed<CharacterMoveDetailed[]>(() => {
  if (!selectedCharacter.value) return []
  return (selectedCharacter.value.moves || []).filter(
    (m) =>
      m.type === ('SPECIAL' as unknown as MoveType)
  )
})
</script>
