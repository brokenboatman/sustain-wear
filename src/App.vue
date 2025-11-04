<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>
    <div>
      <p>© 2024 SustainWear. All rights reserved.</p>
    </div>
  </nav>
  <RouterView />
</template>

<style scoped></style>
