<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '~/stores/user'

const { showLoading, hideLoading } = useLoading()
const { user, fetchUser, updateProfile, uploadAvatar, loading } = useUserStore()
const saving = ref(false)
const savingAvatar = ref(false)
const avatarError = ref('')

const form = ref({
  username: '',
  bio: '',
})

onMounted(async () => {
  await fetchUser()
  if (!user) return
  form.value.username = user.username
  form.value.bio = user.bio || ''
})

async function submitProfileUpdate() {
  showLoading()
  saving.value = true
  try {
    await updateProfile(form.value)
  } catch (err: unknown) {
    console.error('Failed to update profile:', err)
  } finally {
    saving.value = false
    hideLoading();
  }
}

async function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files?.[0]) return
  const file = input.files[0]
  savingAvatar.value = true
  avatarError.value = ''
  showLoading()
  try {
    await uploadAvatar(file)
  } catch (err: unknown) {
    avatarError.value = 'Failed to upload avatar.'
    console.error('Failed to upload avatar:', err)
  } finally {
    savingAvatar.value = false
    hideLoading()
  }
}
</script>

<template>
  <div class="min-h-screen bg-zinc-950 text-gray-100 px-6 py-12">
    <div class="max-w-2xl mx-auto space-y-10">

      <!-- Header -->
      <header class="border-b border-zinc-800 pb-6">
        <h1 class="text-3xl font-extrabold tracking-wide text-white">Your Profile</h1>
        <p class="text-sm text-zinc-500 mt-1 italic">Edit your identity or vanish into the void.</p>
      </header>

      <!-- Loading State -->
      <div v-if="loading" class="text-center text-zinc-500">Loading…</div>

      <!-- Profile Content -->
      <div v-else class="space-y-8">
        <!-- Avatar & Upload -->
        <div class="flex items-center gap-6">
          <div class="w-24 h-24 rounded-full bg-zinc-700 overflow-hidden flex items-center justify-center">
            <div v-if="user">
              <img
                v-if="user.avatarUrl"
                :src="user.avatarUrl"
                alt="Avatar"
                class="object-cover w-full h-full"
              />
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                class="h-full w-full text-zinc-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          </div>
          <div>
            <label class="block font-semibold text-sm mb-1">Change Avatar</label>
            <input
              type="file"
              accept="image/*"
              :disabled="savingAvatar"
              class="text-sm text-gray-400 file:bg-zinc-800 file:text-white file:px-3 file:py-1 file:rounded"
              @change="onFileChange"
            />
            <p v-if="avatarError" class="text-red-500 text-xs mt-1">{{ avatarError }}</p>
          </div>
        </div>

        <!-- Profile Form -->
        <form class="space-y-6" @submit.prevent="submitProfileUpdate">
          <div>
            <label class="block font-semibold text-sm mb-1">Username</label>
            <input
              v-model="form.username"
              :disabled="saving"
              type="text"
              class="w-full p-2 rounded bg-zinc-800 border border-zinc-700 focus:outline-none"
              required
            />
          </div>

          <div>
            <label class="block font-semibold text-sm mb-1">Profile / Bio</label>
            <textarea
              v-model="form.bio"
              :disabled="saving"
              rows="3"
              class="w-full p-2 rounded bg-zinc-800 border border-zinc-700 focus:outline-none"
              placeholder="Who are you, really?"
            />
          </div>

          <div>
            <label class="block font-semibold text-sm mb-1">Email</label>
            <input
              :value="user?.email"
              type="email"
              readonly
              class="w-full p-2 rounded bg-zinc-800 border border-zinc-700 text-zinc-500 cursor-not-allowed"
            />
          </div>

          <!-- Save -->
          <button
            type="submit"
            :disabled="saving"
            class="bg-red-700 hover:bg-red-600 px-4 py-2 rounded text-white font-bold uppercase tracking-wide disabled:opacity-50"
          >
            <span v-if="saving" class="flex items-center gap-2">
              <svg
                class="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Saving…
            </span>
            <span v-else>Save Changes</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
