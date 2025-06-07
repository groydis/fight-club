<template>
  <div class="max-w-2xl mx-auto p-6 space-y-6">
    <h1 class="text-3xl font-bold">Your Profile</h1>
    <div v-if="loading" class="text-gray-400">Loading…</div>
    <div v-else class="space-y-6">

      <!-- Avatar & Upload -->
      <div class="flex items-center gap-4">
        <div class="w-24 h-24 rounded-full bg-gray-700 overflow-hidden">
        <div v-if="user">
          <img
            v-if="user.avatarUrl"
            :src="user.avatarUrl"
            alt="Avatar"
            class="object-cover w-full h-full"
          >
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-full w-full text-gray-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
            />
          </svg>
          </div>
        </div>
        <div>
          <label class="block font-semibold mb-1">Change Avatar</label>
          <input
            type="file"
            accept="image/*"
            :disabled="savingAvatar"
            class="block text-sm text-gray-400 file:bg-gray-700 file:text-white file:px-3 file:py-1 file:rounded"
            @change="onFileChange"
          >
          <p v-if="avatarError" class="text-red-500 text-sm mt-1">{{ avatarError }}</p>
        </div>
      </div>

      <!-- Name Field -->
      <form class="space-y-4" @submit.prevent="submitProfileUpdate">
        <div>
          <label class="block font-semibold mb-1">Username</label>
          <input
            v-model="form.username"
            :disabled="saving"
            type="text"
            class="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none"
            required
          >
        </div>

        <!-- Profile/Bio Field (optional editing if you want later) -->
        <div>
          <label class="block font-semibold mb-1">Profile / Bio</label>
          <textarea
            v-model="form.bio"
            :disabled="saving"
            rows="3"
            class="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none"
            placeholder="Tell us a bit about yourself..."
          />
        </div>

        <!-- Email (read-only) -->
        <div>
          <label class="block font-semibold mb-1">Email</label>
          <input
            :value="user?.email"
            type="email"
            readonly
            class="w-full p-2 rounded bg-gray-800 border border-gray-700 text-gray-400 cursor-not-allowed"
          />
        </div>

        <!-- Save Button -->
        <button
          type="submit"
          :disabled="saving"
          class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white disabled:opacity-50"
        >
          <span v-if="saving" class="flex items-center gap-2">
            <svg
              class="animate-spin h-4 w-4 text-white"
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
            Saving…
          </span>
          <span v-else>Save Changes</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '~/stores/user'
const { user, fetchUser, updateProfile, uploadAvatar, loading } = useUserStore()

const saving = ref(false)
const savingAvatar = ref(false)
const avatarError = ref('')

const form = ref({
  username: '',
  bio: '',
})

// Fetch the current user on mount
onMounted(async () => {
  await fetchUser()

  await fetchUser()
  if (!user) return
  form.value.username = user.username
  form.value.bio = user.bio || ''
})

// Handle updating name/bio
async function submitProfileUpdate() {
  await updateProfile(form.value)
}

// Handle avatar upload
async function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files?.[0]) return
  const file = input.files[0]
  await uploadAvatar(file)
}
</script>
