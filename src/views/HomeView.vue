<script setup>
import Sidebar from '../Components/Sidebar.vue';
import BarChart from '../Components/BarChart.vue';
import DonationList from '../Components/DonationList.vue';
</script>

<template>
  <main>
    <h1>Hello</h1>
    <sidebar />
    <DonationList />
    <BarChart />
  </main>
    
</template>

<style scoped>
main {
  padding: 1rem;
  text-align: center;
  color: default;
}
</style>
