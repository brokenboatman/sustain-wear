<script setup>
import Sidebar from '../components/Sidebar.vue';
import BarChart from '../components/BarChart.vue';
import DonationList from '../components/DonationList.vue';
import Header from "@/components/Header.vue";
import NewDonationDialog from "./NewDonationDialog.vue";
</script>

<template>
  <Header />
  <main>
    <DonationList />
    <BarChart />
    <NewDonationDialog />
  </main>
</template>

<style scoped>
main {
  text-align: center;
  color: default;
}
</style>
