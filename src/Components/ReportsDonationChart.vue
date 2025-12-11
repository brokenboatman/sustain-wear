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

type DonationItem = {
  donationId: string;
  statusId?: number | null;
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
      label: "Donations Received",
      data: Array(12).fill(0),
      backgroundColor: "#0066cc",
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
    const monthlyCounts = new Array(12).fill(0);

    donationsFromApi.forEach((donation: DonationItem) => {
      if (!donation?.date) return;
      const d = new Date(donation.date);
      if (isNaN(d.getTime())) return;

      const y = d.getFullYear();
      if (!years.includes(y)) years.push(y);

      if (y === value.value) {
        const m = d.getMonth();
        monthlyCounts[m] += 1;
      }
    });

    chartData.value = {
      ...chartData.value,
      datasets: [
        {
          ...chartData.value.datasets[0],
          data: monthlyCounts,
        },
      ],
    };

    if (!years.includes(currentYear)) years.push(currentYear);
    years.sort((a, b) => b - a);
    items.value = (years.map((y) => ({ label: String(y), value: y })) as unknown) as SelectItem[];

    // try to force chart update
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

function exportImage() {
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

const donationAmountMonth = computed(() => {
  const currentMonth = new Date().getMonth();
  const val = chartData.value.datasets[0].data[currentMonth];
  // Fix to 1 decimal place (e.g., "9.1")
  return Number(val.toFixed(1));
});

const pendingDonations = computed(() => {
  return donationsRaw.value?.donations.filter(
    (donation: DonationItem) => donation.statusId === 3
  ).length || 0;
});

const acceptedDonations = computed(() => {
  return donationsRaw.value?.donations.filter(
    (donation: DonationItem) => donation.statusId === 4
  ).length || 0;
});

</script>

<template>
  <div
    class="text-neutral font-bold w-full sm:max-w-[720px] p-10 rounded-lg border-muted border text-left"
  >
    <h3 class="text-default font-bold text-2xl mb-2">Donations Recieved</h3>
    <p class="text-sm text-muted-foreground mb-3">Shows all the donations that the charity has recieved over the past year.</p>
    <USelect v-model="value" :items="items" class="w-24 mb-2" />

    <div v-if="loading" class="mb-2 text-sm">Loading donations…</div>
    <div v-if="error" class="mb-2 text-sm text-red-600">Error loading donations: {{ error }}</div>
    <div v-if="!loading && !error" class="mb-2 text-xs text-muted-foreground">Years available: {{ items.length }}</div>

    <div v-if="donationAmountMonth !== 0">
      <div v-if="value === currentYear && donationAmountMonth !== 0">
        <p>
          This month the charity recived {{ donationAmountMonth }} donations.
        </p>
        <p>
          Number of accepted donations :  <strong>{{ acceptedDonations }}</strong>
        </p>
        <p>
          Number of pending donations :  <strong>{{ pendingDonations }}</strong>
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
