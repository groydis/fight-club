<template>
  <div
    class="backdrop-blur-lg bg-gray-800/60 p-8 rounded-2xl shadow-2xl border border-gray-700/60 transition duration-300"
  >
    <h2 class="text-3xl font-extrabold text-center text-white mb-6 tracking-tight">
      {{ mode === 'signup' ? 'Create an Account' : 'Welcome Back' }}
    </h2>

    <form class="space-y-5" @submit.prevent="handleSubmit">
      <div>
        <label class="block text-sm text-gray-400 mb-1">Email</label>
        <input
          v-model="email"
          type="email"
          placeholder="you@example.com"
          class="w-full px-4 py-2 rounded-md bg-gray-900/60 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
      </div>

      <div>
        <label class="block text-sm text-gray-400 mb-1">Password</label>
        <input
          v-model="password"
          type="password"
          placeholder="••••••••"
          class="w-full px-4 py-2 rounded-md bg-gray-900/60 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
      </div>

      <button
        type="submit"
        class="w-full py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow transition"
      >
        {{ mode === 'signup' ? 'Sign Up' : 'Log In' }}
      </button>
    </form>

    <p
      class="mt-6 text-sm text-center text-blue-400 hover:underline cursor-pointer transition"
      @click="toggleMode"
    >
      {{ mode === 'signup' ? 'Already have an account? Log In' : 'New here? Create an account' }}
    </p>

    <p v-if="errorMsg" class="text-red-400 text-center text-sm mt-4">
      {{ errorMsg }}
    </p>
  </div>
</template>

<script setup lang="ts">
const { $supabase } = useNuxtApp()

const email = ref('')
const password = ref('')
const mode = ref<'login' | 'signup'>('login')
const errorMsg = ref('')

function toggleMode() {
  mode.value = mode.value === 'login' ? 'signup' : 'login'
  errorMsg.value = ''
}

async function handleSubmit() {
  errorMsg.value = ''
  const fn = mode.value === 'signup'
    ? $supabase.auth.signUp
    : $supabase.auth.signInWithPassword

  const { data, error } = await fn({ email: email.value, password: password.value })

  if (error) {
    errorMsg.value = error.message
  } else {
    console.log('✅ Auth success:', data)
  }
}
</script>
