<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <!-- <img src="/logo.png" alt="Logo" class="w-40 h-auto mb-6" > -->
    <h1 class="text-3xl font-bold mb-4">Welcome to the Dashboard</h1>

    <button
      class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      @click="logout"
    >
      Logout
    </button>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()
const router = useRouter()

const logout = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Error signing out:', error.message)
    return
  }
  router.push('/auth')
}
</script>
