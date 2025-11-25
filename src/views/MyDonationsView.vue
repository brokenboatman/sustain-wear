<script setup>
import Sidebar from '../components/Sidebar.vue';
import BarChart from '../components/BarChart.vue';
import DonationTab from '../components/DonationTab.vue';
import Header from "@/components/Header.vue";
import NewDonationDialog from "./NewDonationDialog.vue";
</script>

<template>
  <main class="px-4 md:px-8 lg:px-16 flex flex-col gap-2 mb-6">
    <div class="w-full  flex justify-center">
      <div class="w-full sm:max-w-[720px] gap-0 flex flex-col">
        <DonationTab />
        <DonationList />
        <NewDonationDialog />
      </div>
    </div>
    <div class="w-full flex justify-center">
      <div class="w-full sm:max-w-[720px]">
        <BarChart />
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  text-align: center;
  color: default;
}
</style>
