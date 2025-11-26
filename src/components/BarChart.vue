<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
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

type CO2Saving = {
  donationId: string
  co2: number
  date: string
}

const loading = ref(false)
const error = ref<string | null>(null)

const chartData = ref({
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
      data: Array(12).fill(0),
      backgroundColor: "#00c15f",
    },
  ],
});

const chartOptions = ref({
  responsive: true,
});

async function fetchDonations(): Promise<void> {

  loading.value = true
  error.value = null

  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`http://localhost:3000/api/fetch-donations/`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }))
      throw new Error(err?.error || res.statusText)
    }

    const json = await res.json()
    const donationsFromApi = Array.isArray(json.donations) ? json.donations : []

    const monthlySavings = Array(12).fill(0);
    donationsFromApi.forEach((donation: CO2Saving) => {
      const month = new Date(donation.date).getMonth();
      monthlySavings[month] += donation.co2;
    });

    // updates chart data
    chartData.value = {
      ...chartData.value,
      datasets: [
        {
          ...chartData.value.datasets[0],
          data: monthlySavings,
        },
      ],
    };

    console.log("chart data:", chartData.value.datasets[0].data);

  } catch (e: any) {
    console.error(e)
    error.value = e?.message ?? 'Failed to fetch donations'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDonations()
})

const currentMonthSaving = computed(() => {
  const currentMonth = new Date().getMonth();
  return chartData.value.datasets[0].data[currentMonth];
});

const totalYearSaving = computed(() => {
  return chartData.value.datasets[0].data.reduce((a, b) => a + b, 0);
});

const currentMonthInTrees = computed(() => {
  const kg = currentMonthSaving.value;
  return (kg / 21.77).toFixed(2);
});

const totalYearInTrees = computed(() => {
  const totalKg = totalYearSaving.value;
  return (totalKg / 21.77).toFixed(2);
});

</script>

<template>
  <div class="text-neutral font-bold w-full sm:max-w-[720px] p-10 rounded-lg border-muted border text-left">
    <h3 class="text-default font-bold text-2xl mb-4">Your impact</h3>
    <p>This month you've saved <b>{{ currentMonthSaving }} kg</b> of CO<sub>2</sub>.</p>
    <p>That's equivalent to planting <b>{{ currentMonthInTrees }} trees</b> this month!</p>
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

<style>
.bar {
  text-align: center;
  font-weight: 700;
  font-size: 25px;
}
</style>
