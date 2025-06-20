<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useLoading } from '~/composables/useLoading'; // Loading composable (if available for global spinner)
import CharacterDetail from '@/components/CharacterDetail.vue';
import ConfirmModal from '@/components/ui/ConfirmModal.vue';
import type { Character } from '@/types/character'

const route = useRoute();
const router = useRouter();

const character = ref(null);      // will hold the fetched character data
const showConfirmModal = ref(false);
const isDeleting = ref(false);

const { showLoading, hideLoading } = useLoading();  // use global loading indicator if available

// Fetch character data by ID from route
const fetchCharacter = async () => {
  showLoading();  // show global loading spinner (optional)
  try {
    const { data, error, execute } = await useCustomFetch('/api/character', {
      method: 'GET',
      query: { id: route.params.id }
    });
    await execute();
    if (error.value) throw error.value;
    
    // Assuming the API returns the character object directly
    character.value = data.value as Character;
  } catch (err) {
    console.error('Failed to fetch character:', err);
    character.value = null;
  } finally {
    hideLoading(); // hide global loading spinner
  }
};

// Trigger fetch on component mount
onMounted(fetchCharacter);

// If the route param changes (e.g., navigating to a different profile while this component is mounted), refetch data
watch(() => route.params.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    fetchCharacter();
  }
});

// Handle click on the back button (from CharacterDetail)
const handleBack = () => {
  // Navigate back to fighters list (or previous page)
  router.push('/fighters');
};

// Open the delete confirmation modal
const confirmDelete = () => {
  showConfirmModal.value = true;
};

// Handle confirmation of deletion
const handleDeleteConfirmed = async () => {
  if (!character.value) return;
  isDeleting.value = true;
  try {
    const { error, execute } = await useCustomFetch('/api/character', {
      method: 'DELETE',
      query: { id: character.value.id }
    });
    await execute();
    if (error.value) throw error.value;
    
    // Deletion successful – navigate to fighters list
    router.push('/fighters');
  } catch (err) {
    console.error('Failed to delete character:', err);
    alert('Failed to delete character. Try again.');
  } finally {
    isDeleting.value = false;
    showConfirmModal.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-zinc-950 text-white px-4">
    <div class="w-full max-w-6xl py-10 space-y-8">
      <!-- Error or Not Found state -->
      <div v-if="character === null" class="text-center text-zinc-500">
        Character not found.
      </div>

      <!-- Character Detail Display -->
      <div v-else>
        <CharacterDetail 
          :character="character" 
          @back="handleBack" 
          @delete="confirmDelete" 
        />
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      v-if="showConfirmModal"
      :title="`Delete ${character?.name}?`"
      body="This action cannot be undone."
      confirmText="Delete"
      cancelText="Cancel"
      :loading="isDeleting"
      autoFocus="cancel"
      @confirm="handleDeleteConfirmed"
      @cancel="showConfirmModal = false"
    />
  </div>
</template>

