<template>
  <div class="min-h-screen bg-zinc-950 text-white px-4 py-10 max-w-6xl mx-auto space-y-8">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold">All Characters</h1>

      <!-- Sort Dropdown -->
      <select
        v-model="selectedSort"
        @change="resetAndFetch"
        class="bg-zinc-800 text-white px-3 py-2 rounded-md border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-red-600"
      >
        <option value="createdAt_desc">Newest First</option>
        <option value="createdAt_asc">Oldest First</option>
      </select>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <!-- Characters -->
      <div
        v-for="char in characters"
        :key="char.id"
        class="relative border border-zinc-800 hover:border-red-600 transition rounded-xl overflow-hidden group bg-zinc-900 shadow-md"
      >
        <img
          :src="char.imageFrontUrl || '/images/question-mark.png'"
          :alt="char.name"
          class="w-full aspect-square object-cover bg-black/60"
        >
        <div
          class="absolute bottom-0 w-full text-center bg-black/70 text-white text-sm p-1 group-hover:bg-red-700 transition"
        >
          {{ char.name }}
        </div>
      </div>

      <!-- Skeleton Loaders -->
      <div v-if="isLoading" class="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div
          v-for="i in 4"
          :key="`skeleton-${i}`"
          class="animate-pulse bg-zinc-800 aspect-square rounded-xl"
        ></div>
      </div>
    </div>

    <!-- Load More Trigger -->
    <div ref="loadMoreTrigger" class="h-10"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Character } from '@/types/character'

const characters = ref<Character[]>([])
const currentPage = ref(1)
const totalPages = ref(1)
const isLoading = ref(false)
const loadMoreTrigger = ref<HTMLElement | null>(null)
const selectedSort = ref<'createdAt_desc' | 'createdAt_asc'>('createdAt_desc')

const fetchCharacters = async () => {
  if (isLoading.value || (totalPages.value && currentPage.value > totalPages.value)) return
  isLoading.value = true

  const [sortBy, order] = selectedSort.value.split('_')

  try {
    const { data, error, execute } = await useCustomFetch('/api/characters', {
      method: 'GET',
      query: {
        page: currentPage.value,
        sortBy,
        order,
      },
    })

    await execute()
    if (error.value) throw error.value

    const payload = data.value as {
      items: Character[]
      totalCount: number
      totalPages: number
      currentPage: number
    }

    characters.value.push(...payload.items)
    totalPages.value = payload.totalPages
    currentPage.value++
  } catch (err) {
    console.error('Failed to fetch characters:', err)
  } finally {
    isLoading.value = false
  }
}

const resetAndFetch = async () => {
  characters.value = []
  currentPage.value = 1
  totalPages.value = 1
  await fetchCharacters()
}

onMounted(() => {
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) fetchCharacters()
  }, { threshold: 1.0 })

  if (loadMoreTrigger.value) observer.observe(loadMoreTrigger.value)

  fetchCharacters()
})
</script>

<style scoped>
select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 140 140' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolygon points='70,105 15,40 125,40' fill='%23ffffff'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.7em top 50%;
  background-size: 0.6em auto;
}
</style>
