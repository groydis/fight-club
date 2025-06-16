<template>
  <div class="min-h-screen flex items-center justify-center bg-zinc-950 text-white px-4">
    <div class="w-full max-w-6xl py-10 space-y-8">
      <!-- Character Select Screen -->
      <div
        v-if="!selectedCharacter"
        class="grid gap-4 grid-rows-5 grid-cols-2 sm:grid-rows-2 sm:grid-cols-5"
      >
        <button
          v-for="index in 10"
          :key="index"
          class="relative border border-zinc-800 hover:border-red-600 transition rounded-xl overflow-hidden group bg-zinc-900 shadow-md"
          @click="
            characters[index - 1]
              ? selectCharacter(characters[index - 1])
              : goToCreate()
          "
        >
          <img
            :src="characters[index - 1]?.imageProfileUrl || '/images/question-mark.png'"
            :alt="characters[index - 1]?.name || 'Create Fighter'"
            class="w-full aspect-square object-cover bg-black/60"
          >
          <div
            class="absolute bottom-0 w-full text-center bg-black/70 text-white text-sm p-1 group-hover:bg-red-700 transition"
          >
            {{ characters[index - 1]?.name || 'Create Character' }}
          </div>
        </button>
      </div>

      <!-- Character Detail Panel -->
      <div
        v-else
        class="relative grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-900/60 border border-zinc-800 rounded-lg p-6 shadow-xl"
      >
        <button
          class="absolute top-2 left-2 bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1 rounded-md text-xs"
          @click="selectedCharacter = null"
        >
          ← Back
        </button>

        <!-- Left: Profile Image 
        <img
          :src="selectedCharacter.imageProfileUrl"
          :alt="selectedCharacter.name"
          class="w-full rounded-lg object-cover aspect-square border border-zinc-700"
        > -->
        <!-- Images -->
        <div class="flex flex-col gap-6">
          <!-- Profile Picture -->
          <div class="flex flex-col items-center">
            <img
              :src="selectedCharacter.imageProfileUrl"
              :alt="selectedCharacter.name + ' Profile Picture'"
              class="w-64 rounded-lg object-cover aspect-square border border-zinc-700"
            >
            <span class="mt-2 text-sm text-zinc-400">Profile Picture</span>
          </div>

          <!-- Combat Stance -->
          <div class="flex flex-col items-center">
            <img
              :src="selectedCharacter.imageFrontUrl"
              :alt="selectedCharacter.name + ' Combat Pose'"
              class="w-64 rounded-lg object-cover aspect-square border border-zinc-700"
            >
            <span class="mt-2 text-sm text-zinc-400">Combat Pose</span>
          </div>
        </div>
        <!-- Right: Details -->
        <div class="space-y-6">
          <!-- Name / Lore -->
          <div>
            <h2 class="text-3xl font-bold text-red-600 tracking-wide uppercase">
              {{ selectedCharacter.name }}
            </h2>
            <p class="text-sm text-zinc-400 italic">{{ selectedCharacter.lore }}</p>
          </div>

          <!-- Character Info -->
          <div class="text-sm text-zinc-400 space-y-1">
            <p><span class="text-zinc-300 font-semibold">Gender:</span> {{ selectedCharacter.gender || 'Unknown' }}</p>
            <p><span class="text-zinc-300 font-semibold">Species:</span> {{ selectedCharacter.species || 'Unknown' }}</p>
            <p><span class="text-zinc-300 font-semibold">Alignment:</span> {{ selectedCharacter.alignment || 'Unknown' }}</p>
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
const { showLoading, hideLoading } = useLoading()
const characters = ref<Character[]>([])
const selectedCharacter = ref<Character | null>(null)
const loading = ref(false)
const router = useRouter()

const fetchCharacters = async () => {
  showLoading()
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
    hideLoading()
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
