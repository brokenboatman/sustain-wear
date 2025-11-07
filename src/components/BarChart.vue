<template>
  <Bar
    id="my-chart-id"
    :options="chartOptions"
    :data="chartData"
    class="bar"
  />
</template>

<script>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

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
            label: 'CO2 Savings',
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
    }
</style>