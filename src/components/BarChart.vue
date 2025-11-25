<!-- Good luck trying to change any styling in this :) -->

<template>
  <div class="text-neutral font-bold w-full sm:max-w-[720px] p-10 rounded-lg border-muted border text-left">
    <h3 class="text-default font-bold text-2xl mb-4">Your impact</h3>
    <p>This month you've saved <b>{{ currentMonthSaving }} kg</b> of CO<sub>2</sub>.</p>
    <p>That's equivalent to planting <b>{{ totalYearInTrees }} trees</b> this year!</p>
    <p>This year you've saved <b>{{ totalYearSaving }} kg</b> of CO<sub>2</sub>.</p>
    <p>That's equivalent to planting <b>{{ totalYearInTrees }} trees</b> this year!</p>
    <Bar
      id="my-chart-id"
      :options="chartOptions"
      :data="chartData"
      class="bar"
    />
  </div>
</template>

<script>
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(Title, Tooltip, BarElement, CategoryScale, LinearScale);

export default {
  name: "BarChart",
  components: { Bar },
  computed: {
    chartData() {
      return; /* mutable chart data */
    },
    chartOptions() {
      return; /* mutable chart options */
    },
    currentMonthSaving() {
      const currentMonth = new Date().getMonth();
      return this.chartData.datasets[0].data[currentMonth];
    },
    totalYearSaving() {
      return this.chartData.datasets[0].data.reduce((a, b) => a + b, 0);
    },
    averageMonthSaving() {
      const total = this.totalYearSaving;
      return (total / 12).toFixed(2);
    },
    currentMonthInTrees() {
      const kg = this.currentMonthSaving;
      return (kg / 21.77).toFixed(2);
    },
    totalYearInTrees() {
      const totalKg = this.totalYearSaving;
      return (totalKg / 21.77).toFixed(2);
    },
    averageMonthInTrees() {
      const avgKg = this.averageMonthSaving;
      return (avgKg / 21.77).toFixed(2);
    }
  },
  data() {
    return {
      chartData: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        datasets: [
          {
            label: "CO2 Saving (kg)",
            data: [40, 20, 12, 35, 50, 14, 26, 52, 41, 35, 7, 22],
            backgroundColor: "#00c15f",
          },
        ],
      },
      chartOptions: {
        responsive: true,
      },
    };
  },
};
</script>

<style>
.bar {
  text-align: center;
  font-weight: 700;
  font-size: 25px;
}
</style>
