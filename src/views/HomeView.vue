<script setup>
import Sidebar from '../components/Sidebar.vue';
import BarChart from '../components/BarChart.vue';
import DonationTab from '../components/DonationTab.vue';
import Header from "@/components/Header.vue";
import NewDonationDialog from "./NewDonationDialog.vue";
</script>

<template>
  <main>
    <DonationList />
    <DonationTab />
    <BarChart />
    <NewDonationDialog />
    <BarChart />
  </main>
</template>

<style scoped>
main {
  text-align: center;
  color: default;
}
</style>
