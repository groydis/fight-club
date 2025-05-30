<template>
  <div
    class="backdrop-blur-lg bg-gray-800/60 p-8 rounded-2xl shadow-2xl border border-gray-700/60 max-w-md w-full"
  >
    <h2 class="text-2xl font-bold text-center text-white mb-6">
      {{ mode === 'signup' ? 'Create an Account' : 'Welcome Back' }}
    </h2>
    <client-only>
    <form class="space-y-5" @submit.prevent="handleSubmit">
      <div>
        <label class="block text-sm text-gray-400 mb-1">Email</label>
        <input
          v-model="email"
          type="email"
          required
          placeholder="you@example.com"
          class="w-full px-4 py-2 rounded-md bg-gray-900/60 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
      </div>

      <div>
        <label class="block text-sm text-gray-400 mb-1">Password</label>
        <input
          v-model="password"
          type="password"
          required
          placeholder="••••••••"
          class="w-full px-4 py-2 rounded-md bg-gray-900/60 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
      </div>

      <button
        type="submit"
        class="w-full py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition"
      >
        {{ mode === 'signup' ? 'Sign Up' : 'Log In' }}
      </button>
    </form>
    </client-only>
    <p
      class="mt-4 text-sm text-center text-blue-400 hover:underline cursor-pointer"
      @click="toggleMode"
    >
      {{ mode === 'signup'
        ? 'Already have an account? Log In'
        : 'New here? Create an account' }}
    </p>

    <p v-if="errorMsg" class="text-red-400 text-center text-sm mt-4">
      {{ errorMsg }}
    </p>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const email = ref('')
const password = ref('')
const errorMsg = ref('')
const mode = ref<'signup' | 'login'>('login')

function toggleMode() {
  mode.value = mode.value === 'login' ? 'signup' : 'login'
  errorMsg.value = ''
}

const client = useSupabaseClient()

onMounted(() => {
  if (!import.meta.client) return
  console.log("✅ Supabase client loaded in browser")
})

const handleSubmit = async () => {
  if (!import.meta.client) return

  errorMsg.value = ''

  try {
    const { data, error } = mode.value === 'signup'
      ? await client.auth.signUp({
          email: email.value,
          password: password.value
        })
      : await client.auth.signInWithPassword({
          email: email.value,
          password: password.value
        })

    if (error) throw error

    console.log(`✅ ${mode.value === 'signup' ? 'Signed up' : 'Signed in'}:`, data)

    // Redirect to dashboard
    await router.push('/dashboard')
  } catch (err: any) {
    console.error("🔥 Unexpected error:", err)
    errorMsg.value = err.message || 'Something went wrong'
  }
}
</script>
