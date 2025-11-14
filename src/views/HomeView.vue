<script setup>
import Sidebar from '../components/Sidebar.vue';
import BarChart from '../components/BarChart.vue'

</script>

<template>
  <main>
    <header class="border-b border-white mb-4 pb-2">
        <div class="flex align-center justify-between p-4">
          <div class="flex items-center">
            <img src="../assets/logo.png" alt="SustainWear Logo" class="size-10 mr-2"/>
            <h1 class="text-default font-brand text-2xl animate-slide-in">SustainWear</h1>
          </div>
          <div class="flex items-end justify-end">
            <UButton icon="line-md:bell" color="neutral" variant="ghost"/>
            <Sidebar/>
          </div>
        </div>
    </header>
    <BarChart />
  </main>
</template>

<style scoped>
  main {
    text-align: center;
    color: blue;
  }
</style>
