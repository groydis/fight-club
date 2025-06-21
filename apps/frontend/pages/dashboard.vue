<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTimeAgo } from '@vueuse/core'
import type { Character } from '@/types/character'
import AlertBanner from '@/components/AlertBanner.vue'
const topFighters = ref<Character[]>([])

const fetchTopFighters = async () => {
  try {
    const { data, error, execute } = await useCustomFetch('/api/characters', {
      method: 'GET',
      query: {
        page: 1,
        limit: 5,
        sortBy: 'createdAt',
        order: 'desc',
      },
    })

    await execute()
    if (error.value) throw error.value

    topFighters.value = (data.value as unknown)?.items || []
  } catch (err) {
    console.error('Failed to fetch top fighters:', err)
  }
}

const recentFighters = ref<Character[]>([])

const fetchRecentFighters = async () => {
  try {
    const { data, error, execute } = await useCustomFetch('/api/characters', {
      method: 'GET',
      query: {
        page: 1,
        limit: 3,
        sortBy: 'createdAt',
        order: 'desc',
      },
    })

    await execute()
    if (error.value) throw error.value

    recentFighters.value = (data.value as unknown)?.items || []
  } catch (err) {
    console.error('Failed to fetch recent fighters:', err)
  }
}


const myFighters = ref<Character[]>([])
const user = useSupabaseUser().value

const fetchMyFighters = async () => {
  try {
    const { data, error, execute } = await useCustomFetch('/api/characters', {
      method: 'GET',
      query: { page: 1, limit: 10, userId: user?.id },
    })

    await execute()
    if (error.value) throw error.value

    myFighters.value = (data.value as unknown)?.items || []
  } catch (err) {
    console.error('Failed to fetch your fighters:', err)
  }
}

onMounted(async () => {
  await withLoading(async () => {
    await fetchTopFighters()
    await fetchMyFighters()
    await fetchRecentFighters()
  })
})
</script>

<template>
  <div class="min-h-screen bg-zinc-950 text-gray-100 px-6 py-10">
    <div class="max-w-6xl mx-auto space-y-10">

      <!-- Header -->
      <header class="border-b border-zinc-800 pb-6">
        <NuxtLink to="/dashboard" class="text-4xl font-extrabold tracking-widest text-white drop-shadow-lg hover:text-red-500 transition">
          Fight Club: Control Panel
        </NuxtLink>
      </header>

      <!-- Tip -->
      <!-- <section class="bg-zinc-900 border border-zinc-800 p-4 rounded-lg text-sm text-zinc-400 italic">
        💡 Tip of the Day: Stat dump into Agility for dodgy little freaks.
      </section> -->

      <AlertBanner variant="warning">
        ⚠️ Fight Club is in early alpha. Expect bugs, weirdness, and things breaking at random. This is all very experimental — proceed with chaos in mind.
      </AlertBanner>

      <!-- Stats Overview -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-zinc-900 border border-zinc-700 p-4 rounded-lg text-center">
          <div class="text-2xl font-bold text-red-500">{{myFighters.length}}</div>
          <p class="text-sm text-zinc-400">Fighters Created</p>
        </div>
        <div class="bg-zinc-900 border border-zinc-700 p-4 rounded-lg text-center">
          <div class="text-2xl font-bold text-green-400">—</div>
          <p class="text-sm text-zinc-400">Total Wins</p>
        </div>
        <div class="bg-zinc-900 border border-zinc-700 p-4 rounded-lg text-center">
          <div class="text-2xl font-bold text-red-400">—</div>
          <p class="text-sm text-zinc-400">Total Losses</p>
        </div>
      </section>

      <!-- My Fighters -->
      <section>
        <div class="flex items-center justify-between mb-2">
          <h2 class="text-xl font-bold text-white uppercase tracking-wide">My Fighters</h2>
          <button
            @click="navigateTo('/fighters/create')"
            :disabled="myFighters.length >= 10"
            class="bg-red-700 hover:bg-red-600 disabled:opacity-30 text-sm font-semibold px-3 py-1 rounded text-white tracking-wide transition"
          >
            Create Fighter
          </button>
        </div>
        <div class="overflow-x-auto bg-zinc-900 border border-zinc-800 rounded-lg">
          <table class="min-w-full text-sm text-left text-zinc-400">
            <thead class="bg-zinc-800 text-zinc-300 uppercase text-xs">
              <tr>
                <th class="px-4 py-2">Fighter</th>
                <th class="px-4 py-2">Wins</th>
                <th class="px-4 py-2">Losses</th>
                <th class="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="fighter in myFighters"
                :key="fighter.id"
                class="border-t border-zinc-800 hover:bg-zinc-800"
              >
                <td class="px-4 py-2 flex items-center gap-3">
                  <NuxtLink :to="`/fighters/profile/${fighter.id}`" class="flex items-center gap-3">
                    <img
                      :src="fighter.imageFrontUrl || '/images/question-mark.png'"
                      alt="Avatar"
                      class="w-8 h-8 rounded-full object-cover ring-1 ring-zinc-700"
                    />
                    <span class="text-red-400 font-medium hover:underline">{{ fighter.name }}</span>
                  </NuxtLink>
                </td>
                <td class="px-4 py-2">—</td>
                <td class="px-4 py-2">—</td>
                <td class="px-4 py-2 text-yellow-400 italic">Coming soon</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="text-right mt-2">
          <NuxtLink to="/fighters" class="text-sm text-red-500 underline hover:text-white">
            View All
          </NuxtLink>
        </div>
      </section>


      <!-- Top Fighters -->
      <section>
        <h2 class="text-xl font-bold text-white mb-2 uppercase tracking-wide">Top Fighters</h2>
        <div class="overflow-x-auto bg-zinc-900 border border-zinc-800 rounded-lg">
          <table class="min-w-full text-sm text-left text-zinc-400">
            <thead class="bg-zinc-800 text-zinc-300 uppercase text-xs">
              <tr>
                <th class="px-4 py-2">Fighter</th>
                <th class="px-4 py-2">Wins</th>
                <th class="px-4 py-2">Losses</th>
                <th class="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="fighter in topFighters"
                :key="fighter.id"
                class="border-t border-zinc-800 hover:bg-zinc-800"
              >
                <td class="px-4 py-2 flex items-center gap-3">
                  <NuxtLink :to="`/fighters/profile/${fighter.id}`" class="flex items-center gap-3">
                    <img
                      :src="fighter.imageFrontUrl || '/images/question-mark.png'"
                      alt="Avatar"
                      class="w-8 h-8 rounded-full object-cover ring-1 ring-zinc-700"
                    />
                    <span class="text-red-400 font-medium hover:underline">{{ fighter.name }}</span>
                  </NuxtLink>
                </td>
                <td class="px-4 py-2">—</td>
                <td class="px-4 py-2">—</td>
                <td class="px-4 py-2 text-yellow-400 italic">Coming soon</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="text-right mt-2">
          <span class="text-sm text-red-500 underline hover:text-white cursor-pointer">View Leaderboard</span>
        </div>
      </section>


      <!-- Recent Creations -->
      <section>
        <h2 class="text-xl font-bold text-white mb-2 uppercase tracking-wide">Recent Creations</h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            v-for="fighter in recentFighters"
            :key="fighter.id"
            class="bg-zinc-900 border border-zinc-800 p-4 rounded-lg space-y-2"
          >
            <NuxtLink :to="`/fighters/${fighter.id}`">
              <img
                :src="fighter.imageFrontUrl || '/images/question-mark.png'"
                alt="Profile"
                class="aspect-square w-full object-cover rounded-lg"
              />
              <h3 class="text-red-400 font-bold mt-2 hover:underline">
                {{ fighter.name }}
              </h3>
            </NuxtLink>
            <p class="text-xs text-zinc-500">
              Created {{ useTimeAgo(fighter.createdAt).value }}
            </p>
          </div>
        </div>
        <div class="text-right mt-2">
          <NuxtLink to="/fighters/all" class="text-sm text-red-500 underline hover:text-white">
            View All Fighters
          </NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>
