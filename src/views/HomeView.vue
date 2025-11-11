<script setup>
import Sidebar from '../components/Sidebar.vue';
import BarChart from '../components/BarChart.vue'

</script>

<template>
  <main>
    <header class="border-b border-white mb-4 pb-2">
        <div class="flex align-center justify-between p-4">
          <div class="flex items-center">
            <h1 class="text-white text-2xl animate-slide-in">SustainWear</h1>
          </div>
          <div class="flex items-end justify-end">
            <UButton icon="line-md:bell" color="neutral" variant="ghost"/>
            <sidebar/>
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
