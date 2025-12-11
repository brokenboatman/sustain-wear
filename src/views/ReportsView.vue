<script lang="ts" setup>
import { ref } from "vue";
import ReportsBarChart from "@/components/ReportsCO2Chart.vue";
import ReportsLineChart from "@/components/ReportsLineChart.vue";
</script>

<template>
  <main class="px-4 md:px-8 lg:px-16 flex flex-col gap-2 mb-6">
    <div class="w-full flex flex-col justify-center align-items center gap-6">
      <div class="flex justify-center w-full">
        <ReportsBarChart/>
      </div>
      <div class="flex justify-center w-full">
        <ReportsLineChart/>
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