<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from "vue";
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
const donationsRaw = ref<any>(null);
const barRef = ref<any>(null);
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
    const res = await fetch(`http://localhost:3000/api/staff-donations/`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    console.debug("staff-donations response status:", res.status);

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err?.error || res.statusText);
    }

    const json = await res.json();
    donationsRaw.value = json;
    const donationsFromApi = Array.isArray(json.donations) ? json.donations : [];

    const years: number[] = [];
    const monthlySavings = new Array(12).fill(0);

    donationsFromApi.forEach((donation: any) => {
      if (!donation?.date) return;
      const d = new Date(donation.date);
      if (isNaN(d.getTime())) return;

      const y = d.getFullYear();
      if (!years.includes(y)) years.push(y);

      if (y === value.value) {
        const m = d.getMonth();
        const co2 = Number(donation.co2 ?? 0) || 0;
        monthlySavings[m] += co2;
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

    if (!years.includes(currentYear)) years.push(currentYear);
    years.sort((a, b) => b - a);
    items.value = (years.map((y) => ({ label: String(y), value: y })) as unknown) as SelectItem[];

    await nextTick();
    try {
      if (barRef.value && barRef.value.chart) barRef.value.chart.update();
    } catch (err) {
      console.warn("chart update failed:", err);
    }
  } catch (e: any) {
    console.error(e);
    error.value = e?.message ?? "Failed to fetch donations";
  } finally {
    loading.value = false;
  }
}

// reloads bar chart and expose export helper
function exportImage() {
  // return base64 image of the chart and the raw data array
  const img = barRef.value?.chart?.toBase64Image?.() ?? null;
  const data = chartData.value.datasets[0].data;
  return { img, data };
}

// reloads bar chart
defineExpose({
  reloadChart: fetchDonations,
  exportImage,
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
    <h3 class="text-default font-bold text-2xl mb-2">Charity CO₂ Impact</h3>
    <p class="text-sm text-muted-foreground mb-3">Shows CO₂ savings from all donations received by the charity. Use the year selector to view different years.</p>
    <USelect v-model="value" :items="items" class="w-24 mb-2" />

    <div v-if="loading" class="mb-2 text-sm">Loading donations…</div>
    <div v-if="error" class="mb-2 text-sm text-red-600">Error loading donations: {{ error }}</div>
    <div v-if="!loading && !error" class="mb-2 text-xs text-muted-foreground">Years available: {{ items.length }}</div>

    <div v-if="totalYearSaving !== 0">
      <div v-if="value === currentYear && currentMonthSaving !== 0">
        <p>
          This month the charity saved <b>{{ currentMonthSaving }} kg</b> of
          CO<sub>2</sub>.
        </p>
        <p>
          That's equivalent to planting <b>{{ currentMonthInTrees }} trees!</b>
        </p>
      </div>

      <div>
        <p>
          This year the charity saved <b>{{ totalYearSaving }} kg</b> of
          CO<sub>2</sub>.
        </p>
        <p>
          That's equivalent to planting <b>{{ totalYearInTrees }} trees!</b>
        </p>
      </div>
    </div>

    <div v-else>
      <p>No donations recorded for the selected year yet.</p>
    </div>

    <Bar
      ref="barRef"
      id="charity-co2-chart"
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
