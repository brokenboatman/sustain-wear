<script setup>
import Sidebar from '../Components/Sidebar.vue';
import BarChart from '../Components/BarChart.vue';
import DonationList from '../Components/DonationList.vue';
</script>

<template>
  <main>
    <h1>Hello</h1>
    <DonationList />
    
    <header class="border-b border-inverted mb-4 pb-2">
      <div class="flex align-center justify-between p-4">
        <div class="flex items-center">
          <h1 class="text-default text-2xl animate-slide-in font-brand">SustainWear</h1>
        </div>
        <div class="flex items-end justify-end">
          <UButton icon="line-md:bell" color="neutral" variant="ghost" />
          <sidebar />
        </div>
      </div>
    </header>
    <BarChart />
  </main>
</template>

<style scoped>
main {
  text-align: center;
  color: default;
}
</style>
