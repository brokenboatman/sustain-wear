<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import type { SelectItem } from "@nuxt/ui";

ChartJS.register(Title, Tooltip, BarElement, CategoryScale, LinearScale);

type CO2Saving = {
  donationId: string;
  co2: number | null;
  date: string;
};

const items = ref<SelectItem[]>([]);
const currentYear = new Date().getFullYear();
const value = ref(currentYear);
const loading = ref(false);
const error = ref<string | null>(null);

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
  loading.value = true;
  error.value = null;

  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`server/routes/fetch-donations.js`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err?.error || res.statusText);
    }

    const json = await res.json();
    const donationsFromApi = Array.isArray(json.donations)
      ? json.donations
      : [];

    const years = Array();
    const monthlySavings = Array(12).fill(0);

    donationsFromApi.forEach((donation: CO2Saving) => {
      if (!donation.date) return;

      const year = new Date(donation.date).getFullYear();
      if (!years.includes(year)) {
        years.push(year);
      }

      if (year === value.value) {
        const month = new Date(donation.date).getMonth();
        monthlySavings[month] += Number(donation.co2 || 0);
      }
    });

    chartData.value = {
      ...chartData.value,
      datasets: [
        {
          ...chartData.value.datasets[0],
          data: monthlySavings,
        },
      ],
    };

    if (!years.includes(currentYear)) {
      years.push(currentYear);
    }
    years.sort((a, b) => b - a);
    items.value = years;
  } catch (e: any) {
    console.error(e);
    error.value = e?.message ?? "Failed to fetch donations";
  } finally {
    loading.value = false;
  }
}

// reloads bar chart
defineExpose({
  reloadChart: fetchDonations,
});

onMounted(() => {
  fetchDonations();
});

// changes the chart data when year is changed
watch(value, (newYear, oldYear) => {
  fetchDonations();
});

const currentMonthSaving = computed(() => {
  const currentMonth = new Date().getMonth();
  const val = chartData.value.datasets[0].data[currentMonth];
  // Fix to 1 decimal place (e.g., "9.1")
  return Number(val.toFixed(1));
});

const totalYearSaving = computed(() => {
  const val = chartData.value.datasets[0].data.reduce((a, b) => a + b, 0);
  // Fix to 1 decimal place
  return Number(val.toFixed(1));
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
  <div
    class="text-neutral font-bold w-full sm:max-w-[720px] p-10 rounded-lg border-muted border text-left"
  >
    <h3 class="text-default font-bold text-2xl mb-2">Your impact</h3>
    <USelect v-model="value" :items="items" class="w-20 mb-2" />

    <div v-if="totalYearSaving !== 0">
      <div v-if="value === currentYear && currentMonthSaving !== 0">
        <p>
          This month you've saved <b>{{ currentMonthSaving }} kg</b> of
          CO<sub>2</sub>.
        </p>
        <p>
          That's equivalent to planting <b>{{ currentMonthInTrees }} trees!</b>
        </p>
      </div>

      <div>
        <p>
          This year you've saved <b>{{ totalYearSaving }} kg</b> of
          CO<sub>2</sub>.
        </p>
        <p>
          That's equivalent to planting <b>{{ totalYearInTrees }} trees!</b>
        </p>
      </div>
    </div>

    <div v-else>
      <p>You've not made any donations this year, time to get started!</p>
    </div>

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
  margin-top: 4px;
  text-align: center;
  font-weight: 700;
  font-size: 25px;
}
</style>
