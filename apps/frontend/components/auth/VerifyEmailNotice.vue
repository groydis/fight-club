<template>
  <div class="space-y-6 text-center">
    <h2 class="text-2xl font-bold text-white uppercase tracking-wider">
      Check Your Inbox
    </h2>

    <p class="text-zinc-400">
      You’ve got mail — probably. Hit the link we sent to verify your identity.
    </p>

    <p class="text-zinc-600 text-sm italic">
      Not there? Slam refresh. Dig through spam. Or just wait and question your life choices.
    </p>

    <NuxtLink
      to="/auth?view=login"
      class="inline-block mt-6 px-6 py-2 bg-red-700 hover:bg-red-600 text-white font-bold rounded-md shadow transition-all tracking-wide uppercase"
    >
      Back to Login
    </NuxtLink>
  </div>
</template>
