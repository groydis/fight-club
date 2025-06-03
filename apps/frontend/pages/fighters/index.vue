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
          @click="characters[index - 1] ? selectCharacter(characters[index - 1]) : goToCreate()"
        >
          <img
            :src="characters[index - 1]?.imageProfileUrl || '/images/question-mark.png'"
            :alt="characters[index - 1]?.name || 'Create Fighter'"
            class="w-full aspect-square object-cover bg-black/50"
          >
          <div class="absolute bottom-0 w-full text-center bg-black/60 text-white text-sm p-1 group-hover:bg-fuchsia-700">
            {{ characters[index - 1]?.name || 'Create Character' }}
          </div>
        </button>
      </div>

      <!-- Character Detail Panel -->
      <div v-else class="relative max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
        <button class="absolute top-2 left-2 bg-gray-800 text-white px-3 py-1 rounded-md text-xs" @click="selectedCharacter = null">
          ← Back
        </button>
        <img :src="selectedCharacter.imageProfileUrl" :alt="selectedCharacter.name" class="w-full rounded-xl object-cover aspect-square" >
        <div class="space-y-3">
          <h2 class="text-3xl font-bold">{{ selectedCharacter.name }}</h2>
          <p class="text-sm text-gray-300">{{ selectedCharacter.description }}</p>
          <p class="text-sm text-gray-300">{{ selectedCharacter.lore }}</p>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <span class="text-xs text-gray-400">Type</span>
              <p class="font-semibold">TBD</p>
            </div>
            <div>
              <span class="text-xs text-gray-400">Range</span>
              <p class="font-semibold">TBD</p>
            </div>
            <div>
              <span class="text-xs text-gray-400">Difficulty</span>
              <p class="font-semibold">TBD</p>
            </div>
            <div>
              <span class="text-xs text-gray-400">Specialty</span>
              <p class="font-semibold">TBD</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const characters = ref([]);
const selectedCharacter = ref(null);
const loading = ref(false);
const router = useRouter();

const fetchCharacters = async () => {
  loading.value = true;
  try {
    const { data, error, execute } = await useCustomFetch('/api/characters', {
      method: 'GET',
    });
    await execute();

    if (error.value) {
      throw error.value;
    }

    characters.value = data.value || [];
    console.log('Fetched characters:', characters.value);
    if (characters.value.length === 0) {
      console.warn('No characters found');
    }
  } catch (err) {
    console.error('Failed to fetch characters:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchCharacters);

const selectCharacter = (character) => {
  selectedCharacter.value = character;
};

const goToCreate = () => {
  router.push('/fighters/create');
};
</script>

<style scoped>
/* Optional: question mark placeholder style */
</style>
