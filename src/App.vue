<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <UApp>
    <RouterLink to="/register" />
    <RouterLink to="/login" />
    <RouterLink to="/account" />
    <RouterView />
  </UApp>
</template>

<style scoped></style>
