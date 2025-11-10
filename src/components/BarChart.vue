<template>
  <div class="bar">
    <h2>Your Monthly CO2 Savings (kg)</h2>
    <Bar
      id="my-chart-id"
      :options="chartOptions"
      :data="chartData"
      class="bar"
    />
  </div>
</template>

<script>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, BarElement, CategoryScale, LinearScale)

export default {
  name: 'BarChart',
  components: { Bar },
  computed: {
      chartData() { return /* mutable chart data */ },
      chartOptions() { return /* mutable chart options */ }
    },
  data() {
    return {
      chartData: {
        labels: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
        datasets: [ {
            label: 'CO2 Saving (kg)',
            data: [40, 20, 12, 35, 50, 14, 26, 52, 41, 35, 7, 22],
            backgroundColor: "#00c15f",
            
        } ]
      },
      chartOptions: {
        responsive: true
      }
    }
  }
}
</script>

<style>
    .bar {
        background-color: white;
        color: black;
        text-align: center;
        font-weight: 700;
        font-size: 25px;
    }
</style>