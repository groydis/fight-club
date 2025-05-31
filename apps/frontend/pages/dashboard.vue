<template>
  <div class="min-h-screen bg-zinc-950 text-gray-100 px-6 py-10">
    <div class="max-w-4xl mx-auto space-y-12">

      <header class="border-b border-zinc-800 pb-6">
        <h1 class="text-4xl font-extrabold tracking-widest text-white drop-shadow-lg">
          Fight Club: Control Panel
        </h1>
        <p class="text-sm text-zinc-500 mt-2 italic">Your mess. Your rules. Your fighters.</p>
      </header>

      <section class="grid gap-8 md:grid-cols-2">
        <!-- Fighters Panel -->
        <div class="bg-zinc-900 p-6 rounded-xl shadow-2xl border border-zinc-800 hover:border-red-700 transition">
          <h2 class="text-2xl font-semibold mb-3 text-red-500 tracking-wide">Your Fighters</h2>
          <ul class="space-y-2 text-sm text-gray-300 font-mono">
            <li>💀 <span class="font-bold">BloodFist</span> — 3W / 1L</li>
            <li>💥 <span class="font-bold">KillaJade</span> — 5W / 0L</li>
            <li>🤖 <span class="font-bold">RustViper</span> — 0W / 3L</li>
          </ul>
          <button class="mt-5 w-full bg-red-700 hover:bg-red-600 text-white py-2 rounded-md font-bold uppercase tracking-wide transition">
            Manage Fighters
          </button>
        </div>

        <!-- Matches Panel -->
        <div class="bg-zinc-900 p-6 rounded-xl shadow-2xl border border-zinc-800 hover:border-red-700 transition">
          <h2 class="text-2xl font-semibold mb-3 text-red-500 tracking-wide">Upcoming Matches</h2>
          <ul class="space-y-2 text-sm text-gray-300 font-mono">
            <li>🕒 <span class="font-bold">BloodFist vs HellClaw</span> — in 2 days</li>
            <li>🕒 <span class="font-bold">KillaJade vs NeonGhost</span> — in 4 days</li>
          </ul>
          <button class="mt-5 w-full bg-red-700 hover:bg-red-600 text-white py-2 rounded-md font-bold uppercase tracking-wide transition">
            View Schedule
          </button>
        </div>
      </section>

      <footer class="text-center mt-12">
        <NuxtLink
          to="/auth?view=login"
          class="text-xs text-gray-500 underline hover:text-red-500 transition tracking-wide"
        >
          Log out and disappear
        </NuxtLink>
      </footer>

    </div>
  </div>
</template>
