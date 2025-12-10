<script setup>
import { Suspense, ref } from "vue";
import BarChart from "../components/BarChart.vue";
import DonationTab from "../components/DonationTab.vue";
import NewDonationDialog from "../components/NewDonationDialog.vue";

const barChart = ref(null)

function onDonationAdded(){
  console.log("reloading chart")
  barChart.value?.reloadChart();
}
</script>

<template>
  <main class="px-4 md:px-8 lg:px-16 flex flex-col gap-2 mb-6">
    <div class="w-full flex justify-center">
      <div class="w-full sm:max-w-[720px] gap-0 flex flex-col">
        <DonationTab />
        <Suspense>
          <NewDonationDialog @donation-added="onDonationAdded" />

          <template #fallback>
            <div class="text-center p-4">
              <p>Loading donation options...</p>
              <UProgress animation="horizontal" />
            </div>
          </template>
        </Suspense>
      </div>
    </div>
    <div class="w-full flex justify-center">
      <div class="w-full sm:max-w-[720px]">
        <BarChart ref="barChart" />
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
