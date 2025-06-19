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
          :disabled="characters[index - 1]?.status === 'PROCESSING'"
          @click="
            characters[index - 1]
              ? selectCharacter(characters[index - 1])
              : goToCreate()
          "
        >
          <!-- Spinner Overlay for processing characters -->
          <div
            v-if="characters[index - 1]?.status === 'PROCESSING'"
            class="absolute inset-0 bg-black/70 flex items-center justify-center z-10"
          >
            <svg
              class="animate-spin h-6 w-6 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
          </div>

          <!-- Character Image -->
          <img
            :src="characters[index - 1]?.imageFrontUrl || '/images/question-mark.png'"
            :alt="characters[index - 1]?.name || 'Create Fighter'"
            class="w-full aspect-square object-cover bg-black/60"
          >

          <!-- Character Name / Processing Text -->
          <div
            class="absolute bottom-0 w-full text-center bg-black/70 text-white text-sm p-1 group-hover:bg-red-700 transition"
          >
            {{
              characters[index - 1]?.status === 'PROCESSING'
                ? 'Processing…'
                : (characters[index - 1]?.name || 'Create Character')
            }}
          </div>
        </button>
      </div>
    </div>
      <ConfirmModal
        v-if="showConfirmModal"
        :title="`Delete ${selectedCharacter?.name}?`"
        body="This action can not be undone."
        confirmText="Delete"
        cancelText="Cancel"
        :loading="isDeleting"
        autoFocus="cancel"
        @confirm="handleDeleteConfirmed"
        @cancel="showConfirmModal = false"
      />
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type {
  Character,
} from '@/types/character'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'
import { useUserStore } from '~/stores/user'

const { showLoading, hideLoading } = useLoading()
const { user } = useUserStore()
const characters = ref<Character[]>([])
const selectedCharacter = ref<Character | null>(null)
const loading = ref(false)
const router = useRouter()

const currentPage = ref(1)
const totalPages = ref(1)

const fetchCharacters = async () => {
  showLoading()
  loading.value = true
  try {
    const { data, error, execute } = await useCustomFetch('/api/characters', {
      method: 'GET',
      query: { page: currentPage.value, userId: user?.id},
    })

    await execute()
    if (error.value) throw error.value

    const payload = data.value as {
      items: Character[]
      totalCount: number
      totalPages: number
      currentPage: number
    }

    characters.value = payload.items || []
    totalPages.value = payload.totalPages
    currentPage.value = payload.currentPage
  } catch (err) {
    console.error('Failed to fetch characters:', err)
  } finally {
    loading.value = false
    hideLoading()
  }
}

onMounted(fetchCharacters)

const selectCharacter = (character: Character) => {
  router.push(`/fighters/profile/${character.id}`)
}

const goToCreate = () => {
  router.push('/fighters/create')
}

const showConfirmModal = ref(false)
const isDeleting = ref(false)

const handleDeleteConfirmed = async () => {
  if (!selectedCharacter.value) return

  isDeleting.value = true
  try {
    const { error, execute } = await useCustomFetch('/api/character', {
      method: 'DELETE',
      query: { id: selectedCharacter.value.id },
    })

    await execute()
    if (error.value) throw error.value

    selectedCharacter.value = null
    await fetchCharacters()
    if (characters.value.length === 0 && currentPage.value > 1) {
      currentPage.value--
      await fetchCharacters()
    }
  } catch (err) {
    console.error('Failed to delete character:', err)
    alert('Failed to delete character. Try again.')
  } finally {
    isDeleting.value = false
    showConfirmModal.value = false
  }
}
</script>
