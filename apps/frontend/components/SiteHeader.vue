<!-- components/SiteHeader.vue -->
<template>
  <header class="w-full bg-gray-900 text-white shadow-md">
    <div class="max-w-6xl mx-auto flex items-center justify-between h-14 px-4">

      <!-- Left: Title -->
      <div class="text-lg font-bold">Fight Club</div>

      <!-- Right: Avatar + Username + Chevron (fixed width) -->
      <div class="relative">
        <template v-if="supabaseUser">
          <!--
            - w-56 gives the button a fixed overall width (adjust to suit your typical username length).
            - Inside, avatar and chevron are flex-shrink-0, and the username is flex-1 with truncate.
          -->
          <button
            @click="menuOpen = !menuOpen"
            class="flex items-center w-56 h-10 bg-gray-900 rounded px-2 space-x-2 focus:outline-none"
            aria-label="Toggle user menu"
          >
            <!-- Avatar (never shrinks) -->
            <div class="w-8 h-8 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
              <img
                v-if="userAvatar"
                :src="userAvatar"
                alt="Avatar"
                class="object-cover w-full h-full"
              />
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                class="w-full h-full text-gray-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                />
              </svg>
            </div>

            <!-- Username (flex-1, will truncate if too long) -->
            <span class="flex-1 text-sm font-medium truncate">
              {{ userName }}
            </span>

            <!-- Chevron (never shrinks, rotates in place) -->
            <div class="w-4 h-4 flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                :class="[
                  'h-4 w-4 transform transition-transform duration-200 ease-in-out',
                  menuOpen ? 'rotate-180' : 'rotate-0'
                ]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          <!-- Dropdown (absolute, does not affect the fixed button) -->
          <transition name="fade">
            <div
              v-if="menuOpen"
              class="absolute top-full right-0 mt-1 w-48 bg-gray-800 rounded shadow-lg z-50"
            >
              <div class="py-2">
                <NuxtLink
                  to="/profile"
                  class="block px-4 py-2 hover:bg-gray-700 transition"
                  @click="menuOpen = false"
                >
                  Profile
                </NuxtLink>
                <button
                  @click="logout"
                  class="w-full text-left px-4 py-2 hover:bg-gray-700 transition text-red-300 hover:text-white"
                >
                  Logout
                </button>
              </div>
            </div>
          </transition>
        </template>

        <!-- If not signed in, show “Login” link -->
        <template v-else>
          <NuxtLink
            to="/auth"
            class="px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 transition"
          >
            Login
          </NuxtLink>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const menuOpen = ref(false)
const supabaseUser = useSupabaseUser()
const supabase = useSupabaseClient()
const userStore = useUserStore()

const userName = computed(() => {
  return (
    userStore.data?.name ||
    supabaseUser.value?.email?.split('@')[0] ||
    'Anonymous'
  )
})

const userAvatar = computed(() => {
  return userStore.data?.avatarUrl || null
})

async function logout() {
  await supabase.auth.signOut()
  userStore.$reset()
  menuOpen.value = false
  await navigateTo('/')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
