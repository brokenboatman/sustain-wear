<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <UApp>
  <nav>
    <RouterLink to="/">Home</RouterLink>
    <div>
      <p>© 2024 SustainWear. All rights reserved.</p>
    </div>
  </nav>
  <RouterView />
  </UApp>
</template>

<style scoped></style>
