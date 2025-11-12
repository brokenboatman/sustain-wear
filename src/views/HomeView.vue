<script setup>
import Sidebar from '../Components/Sidebar.vue';
import BarChart from '../Components/BarChart.vue'
</script>

<template>
  <main>
    <h1>Hello</h1>
    <img src="/src/assets/logo.png" alt="Logo" width="200" />
    <sidebar />
  </main>
    <BarChart />
</template>

<style scoped>
main {
  padding: 2rem;
  text-align: center;
  color: blue;
}
</style>
