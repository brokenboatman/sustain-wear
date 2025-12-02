<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";
import { ref, computed } from "vue";
import { onMounted } from "vue";

type Donation = {
  donationId: string;
  imageRef: string;
  name: string;
  status: "On its way" | "In transit" | "Received at Charity" | "Accepted";
};


const loading = ref(false);
const error = ref<string | null>(null);

async function fetchDonations(): Promise<void> {
  loading.value = true;
  error.value = null;
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/staff-fetch-donations`, {
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

    data.value = donationsFromApi.map((d: any) => ({
      donationId: String(d.donationId),
      imageRef: d.photoUrl ?? "",
      name: d.title ?? "Unknown Item",
      status: d.status?.status ?? "On its way",
    })) as Donation[];
  } catch (e: any) {
    console.error(e);
    error.value = e?.message ?? "Failed to fetch donations";
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchDonations();
});

const data = ref<Donation[]>([
  {
    donationId: "001",
    imageRef: "[image ref here]",
    name: "T-Shirt",
    status: "In transit",
  },
  {
    donationId: "002",
    imageRef: "[image ref here]",
    name: "Beige trousers",
    status: "Received at Charity",
  },
  {
    donationId: "003",
    imageRef: "[image ref here]",
    name: "Floral dress",
    status: "On its way",
  },
]);

const pendingDonations = computed(() =>
  data.value.filter((d) => d.status !== "Accepted")
);

const pastDonations = computed(() =>
  data.value.filter((d) => d.status === "Accepted")
);

const items = ref<TabsItem[]>([
  {
    label: "Pending Donations",
    icon: "lucide:truck",
    content: "This is the pending donations.",
    slot: "pending" as const,
  },
  {
    label: "Past Donations",
    icon: "lucide:package-check",
    content: "This is the past donations.",
    slot: "past" as const,
  },
]);
</script>

<template>
  <div class="flex-1 flex-direction-column text-default">
    <div v-if="loading" class="text-center p-4">Loading...</div>
    <div v-else-if="error" class="text-red-500 text-center p-4">
      {{ error }}
    </div>
    <div
      v-else
      class="flex flex-col gap-y-2 border border-muted p-2 rounded-xl mb-2"
    >
      <div v-if="pendingDonations.length === 0" class="text-center p-4 text-muted">
        No pending donations
      </div>
      <div
        v-for="donation in pendingDonations"
        :key="donation.donationId"
        class="flex items-center justify-between h-20 border border-muted bg-elevated p-2 rounded-lg"
      >
         <div class="text-left flex items-center gap-x-2 w-6/10">
           <img v-if="donation.imageRef" :src="donation.imageRef" class="w-16 h-16 object-cover rounded-lg" />
           <p class="text-left w-full font-bold px-2">{{ donation.name }}</p>
         </div>
        <div class="text-left flex items-center gap-x-2 w-4/10">
          <UIcon
            class="size-5"
            v-if="donation.status === 'In transit'"
            name="lucide:truck"
          />
          <UIcon
            class="size-5"
            v-if="donation.status === 'Received at Charity'"
            name="lucide:warehouse"
          />
          <UIcon
            class="size-5"
            v-if="donation.status === 'On its way'"
            name="lucide:package"
          />
          <p>{{ donation.status }}</p>
        </div>
        
      </div>
    </div>
  </div>
</template>