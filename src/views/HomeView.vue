<script setup>
import Sidebar from '../Components/Sidebar.vue';
import BarChart from '../components/BarChart.vue';
import DonationTab from '../components/DonationTab.vue';
import Header from "@/components/Header.vue";
import NewDonationDialog from "./NewDonationDialog.vue";
</script>

<template>
  <main class="px-4 md:px-8 lg:px-16 flex flex-col gap-2 mb-6">
    <div class="w-full  flex justify-center">
      <p>TODO: A home page is redundant, my donations has been moved to its own route. 
        This page may become a redirect for the various user roles, or it could be removed in future iterations.
      </p>
    </div>
  </main>
</template>

<style scoped>
main {
  text-align: center;
  color: default;
}
</style>
