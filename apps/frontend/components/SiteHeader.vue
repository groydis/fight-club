<script setup lang="ts">
const menuOpen = ref(false)
const supabaseUser = useSupabaseUser()
const supabase = useSupabaseClient()
const userStore = useUserStore()

const userName = computed(() => userStore.user?.username)
const userAvatar = computed(() => userStore.user?.avatarUrl || null)

async function logout() {
  await supabase.auth.signOut()
  userStore.$reset()
  menuOpen.value = false
  await navigateTo('/')
}
</script>

<template>
  <header class="w-full bg-gradient-to-b from-black via-zinc-900 to-black border-b border-zinc-800 shadow-xl">
    <div class="max-w-6xl mx-auto flex items-center justify-between h-16 px-4">

      <!-- Title -->
      <NuxtLink
        to="/dashboard"
        class="text-xl sm:text-2xl font-extrabold uppercase tracking-wider text-red-600 drop-shadow hover:text-red-400 transition"
      >
        Fight Club
      </NuxtLink>


      <!-- User Menu or Login Link -->
      <div class="relative">
        <template v-if="supabaseUser">
          <button
            @click="menuOpen = !menuOpen"
            class="flex items-center w-56 h-10 bg-zinc-950 border border-zinc-700 rounded-lg px-2 space-x-3 hover:bg-zinc-900 transition-all shadow-inner"
            aria-label="Toggle user menu"
          >
            <!-- Avatar -->
            <div class="w-9 h-9 rounded-full overflow-hidden bg-zinc-800 flex-shrink-0 ring-1 ring-zinc-700">
              <img
                v-if="userAvatar"
                :src="userAvatar"
                alt="Avatar"
                class="object-cover w-full h-full"
              />
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                class="w-full h-full text-zinc-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>

            <!-- Username -->
            <span class="flex-1 text-sm font-semibold text-zinc-300 truncate uppercase">
              {{ userName }}
            </span>

            <!-- Chevron -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              :class="[
                'w-4 h-4 text-zinc-400 transition-transform duration-200 ease-in-out',
                menuOpen ? 'rotate-180' : 'rotate-0'
              ]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Dropdown -->
          <transition name="fade">
            <div
              v-if="menuOpen"
              class="absolute top-full right-0 mt-2 w-48 bg-zinc-950 border border-zinc-800 rounded-md shadow-xl z-50"
            >
              <div class="py-2">
                <NuxtLink
                  to="/profile"
                  class="block px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-red-400 transition-colors"
                  @click="menuOpen = false"
                >
                  Profile
                </NuxtLink>
                <button
                  @click="logout"
                  class="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-zinc-800 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </transition>
        </template>

        <!-- Not signed in -->
        <template v-else>
          <NuxtLink
            to="/auth"
            class="px-4 py-2 text-sm font-semibold text-zinc-300 bg-zinc-800 hover:bg-red-600 hover:text-white rounded-md uppercase tracking-wide transition-all"
          >
            Login
          </NuxtLink>
        </template>
      </div>
    </div>
  </header>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
