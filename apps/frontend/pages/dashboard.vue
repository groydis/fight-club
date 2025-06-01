<template>
  <div class="min-h-screen bg-zinc-950 text-gray-100 px-6 py-10">
    <div class="max-w-2xl mx-auto space-y-12">

      <header class="border-b border-zinc-800 pb-6">
        <h1 class="text-4xl font-extrabold tracking-widest text-white drop-shadow-lg">
          Fight Club: Control Panel
        </h1>
        <p class="text-sm text-zinc-500 mt-2 italic">
          Your mess. Your rules. Your fighters.
        </p>
      </header>

      <section class="space-y-6">
        <button
          class="w-full bg-red-700 hover:bg-red-600 text-white py-3 rounded-md font-bold uppercase tracking-wide transition"
          @click="navigateTo('/fighters/create')"
        >
          Create Fighter
        </button>
      </section>

      <footer class="text-center mt-12">
        <button
          class="text-xs text-gray-500 underline hover:text-red-500 transition tracking-wide"
          @click="logout"
        >
          Log out and disappear
        </button>
      </footer>

    </div>
  </div>
</template>

<script setup lang="ts">
const { auth } = useSupabaseClient()

async function logout() {
  await auth.signOut()
  await navigateTo('/')
}

const supabase = useSupabaseClient()
const { data: session } = await supabase.auth.getSession()

if (!session?.session?.access_token) {
  throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
}
</script>
