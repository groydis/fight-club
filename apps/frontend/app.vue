<!-- app.vue — keep this as simple as possible! -->
<template>
  <!-- This tells Nuxt: “Wrap every page in the selected layout” -->
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
const userStore = useUserStore()
onMounted(() => {
  userStore.fetchUser()
})
</script>
