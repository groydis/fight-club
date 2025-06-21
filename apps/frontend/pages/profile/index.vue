<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { ref, onMounted } from 'vue'
import { useUserStore } from '~/stores/user'

const { user, fetchUser, updateProfile, uploadAvatar } = useUserStore()
const saving = ref(false)
const savingAvatar = ref(false)
const avatarError = ref('')

// ✅ Define schema
const profileSchema = yup.object({
  username: yup.string().required('Username is required').min(3, 'Too short').max(20, 'Too long'),
  bio: yup.string().max(300, 'Bio must be 300 characters max'),
})

// ✅ VeeValidate setup
const { handleSubmit, errors, setValues } = useForm({
  validationSchema: profileSchema,
})

const { value: username } = useField('username')
const { value: bio } = useField('bio')

// ✅ Prefill data
onMounted(async () => {
  await withLoading(async () => {
    await fetchUser()
    if (!user) return
    setValues({
      username: user.username,
      bio: user.bio || '',
    })
  })
})

// ✅ Submit handler
const submitProfileUpdate = handleSubmit(async (values) => {
  saving.value = true
  try {
    await withLoading(() => updateProfile(values))
  } catch (err) {
    console.error('Failed to update profile:', err)
  } finally {
    saving.value = false
  }
})

// ✅ Avatar upload
async function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files?.[0]) return

  const file = input.files[0]
  savingAvatar.value = true
  avatarError.value = ''

  try {
    await withLoading(() => uploadAvatar(file))
    await fetchUser(true) // ✅ Refresh the user profile to show updated avatar
  } catch (err) {
    avatarError.value = 'Failed to upload avatar.'
    console.error('Failed to upload avatar:', err)
  } finally {
    savingAvatar.value = false
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

      <!-- Profile Content -->
      <div class="space-y-8">
        <!-- Avatar & Upload -->
        <div class="flex items-center gap-6">
          <div class="w-24 h-24 rounded-full bg-zinc-700 overflow-hidden flex items-center justify-center">
            <div v-if="user">
              <img
                v-if="userAvatar"
                :key="userAvatar"
                :src="userAvatar"
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
          <!-- Username -->
          <div>
            <label class="block font-semibold text-sm mb-1">Username</label>
            <input
              v-model="username"
              :disabled="saving"
              type="text"
              class="w-full p-2 rounded bg-zinc-800 border border-zinc-700 focus:outline-none"
            />
            <p v-if="errors.username" class="text-xs text-red-500 mt-1">{{ errors.username }}</p>
          </div>

          <!-- Bio -->
          <div>
            <label class="block font-semibold text-sm mb-1">Profile / Bio</label>
            <textarea
              v-model="bio"
              :disabled="saving"
              rows="3"
              class="w-full p-2 rounded bg-zinc-800 border border-zinc-700 focus:outline-none"
              placeholder="Who are you, really?"
            />
            <p v-if="errors.bio" class="text-xs text-red-500 mt-1">{{ errors.bio }}</p>
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
