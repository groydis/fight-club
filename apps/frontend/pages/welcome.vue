<!-- pages/welcome.vue -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

/**
 * Tell Nuxt to use the “welcome” layout for this page.
 * That layout should provide the gradient background and hide the SiteHeader.
 */
definePageMeta({
  layout: 'welcome'
})

const username = ref('')
const loading = ref(false)
const showForm = ref(false)
const isValidUsername = computed(() => username.value.trim().length >= 3)
const headerRef = ref<HTMLElement | null>(null)

async function submitUsername() {
  loading.value = false
  const cleanName = username.value.trim()
    // saving.value = true
    if (!cleanName) return
    try {
      // Replace with your PATCH endpoint
      const { execute, data, error } = await useCustomFetch(`/api/user`, {
        method: 'PATCH',
        body: {
          username: cleanName
        },
      })

      await execute();
      
      console.log('UserName: ', data.value);

      if (error.value) throw error.value;

      navigateTo('/fighters');
    } catch (err: unknown) {
      console.error('Failed to update profile:', err)
    } finally {
      loading.value = false
    }
  }

onMounted(() => {
  const headerEl = headerRef.value
  if (!headerEl) return

  // Remove “start-hidden” so the header is visible (at scale 1.3)
  headerEl.classList.remove('start-hidden')
  // Force a reflow so the browser applies scale(1.3) immediately
  void headerEl.offsetHeight
  // Add the shrink animation (scale 1.3 → 1 over 1s)
  headerEl.classList.add('shrink-animation')

  // Once the shrink finishes (1s), show the form
  setTimeout(() => {
    showForm.value = true
  }, 1000)
})
</script>

<template>
  <div v-cloak class="flex flex-col items-center justify-center min-h-screen px-4 py-8">
    <!-- Optional semi-transparent overlay on top of the gradient (provided by the layout) -->
    <div class="absolute inset-0 bg-black opacity-50"/>

    <!-- Animated header + reveal form -->
    <div class="relative z-10 flex flex-col items-center space-y-8">
      <!-- 1) Starting state: hidden + scaled up -->
      <h1 ref="headerRef" class="text-white font-bold text-center start-hidden">
        Welcome to Fight Club
      </h1>

      <!-- 2) Form only appears after `showForm` becomes true -->
      <transition name="fade-scale" appear>
        <form
          v-if="showForm"
          class="w-full flex flex-col items-center space-y-4"
          @submit.prevent="submitUsername"
        >
          <label class="w-full text-gray-200 text-center font-medium">
            Please, Provide a username
          </label>
          <input
            v-model="username"
            type="text"
            required
            maxlength="20"
            placeholder="Enter username"
            class="w-1/2 px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400 
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
          <button
            type="submit"
            :disabled="!isValidUsername"
            class="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded 
                   disabled:opacity-50"
          >
            Continue
          </button>
        </form>
      </transition>
    </div>
  </div>
</template>

<style scoped>
/* Hide until Vue mounts */
[v-cloak] {
  display: none;
}

/* Initial header state: hidden + scaled up */
.start-hidden {
  visibility: hidden;
  transform: scale(1.3);
}

/* Once visible, animate from scale(1.3) → scale(1) over 1 second */
.shrink-animation {
  visibility: visible;
  animation: shrink-keyframes 1s ease-in-out forwards;
}

@keyframes shrink-keyframes {
  0%   { transform: scale(1.3); font-size: 3rem; }
  100% { transform: scale(1);   font-size: 2rem; }
}

@media (min-width: 640px) {
  @keyframes shrink-keyframes {
    0%   { transform: scale(1.3); font-size: 4rem; }
    100% { transform: scale(1);   font-size: 2.5rem; }
  }
}

@media (min-width: 768px) {
  @keyframes shrink-keyframes {
    0%   { transform: scale(1.3); font-size: 5rem; }
    100% { transform: scale(1);   font-size: 3rem; }
  }
}

/* Fade + scale transition for the form reveal */
.fade-scale-enter-active {
  transition: opacity 0.8s ease-in-out, transform 0.8s ease-in-out;
}
.fade-scale-enter-from {
  opacity: 0;
  transform: scale(0.85);
}
.fade-scale-enter-to {
  opacity: 1;
  transform: scale(1);
}
</style>
