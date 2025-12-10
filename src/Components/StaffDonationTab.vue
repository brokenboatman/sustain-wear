<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";
import { ref, computed } from "vue";
import { onMounted } from "vue";

type Donation = {
  donationId: number;
  imageRef: string;
  name: string;
  description?: string;
  status: "On its way" | "In transit" | "Received at Charity" | "Accepted";
};

const loading = ref(false);
const error = ref<string | null>(null);

async function fetchDonations(): Promise<void> {
  loading.value = true;
  error.value = null;
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/staff-donations`, {
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
      donationId: d.donationId,
      imageRef: d.photoUrl ?? "",
      name: d.title ?? "Unknown Item",
      status: d.status.status,
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
    donationId: 1,
    imageRef: "[image ref here]",
    name: "T-Shirt",
    status: "In transit",
  },
  {
    donationId: 2,
    imageRef: "[image ref here]",
    name: "Beige trousers",
    status: "Received at Charity",
  },
  {
    donationId: 3,
    imageRef: "[image ref here]",
    name: "Floral dress",
    status: "On its way",
  },
]);

const pendingDonations = computed(() =>
  data.value.filter((d) => d.status !== "Accepted")
);

const acceptedDonations = computed(() =>
  data.value.filter((d) => d.status === "Accepted")
)

const pendingCount = computed(() => 
  data.value.filter((d) => d.status !== "Accepted").length
)

const acceptedCount = computed(() =>
  data.value.filter((d) => d.status === "Accepted").length
)

const totalCount = computed(() =>
  data.value.length
)

const items = ref<TabsItem[]>([
  {
    label: "Pending Donations",
    icon: "lucide:truck",
    content: "This is the pending donations.",
    slot: "pending" as const,
  },
  {
    label: "Accepted Donations",
    icon: "lucide:package-check",
    content: "This is the accepted donations.",
    slot: "accepted" as const,
  },
]);
</script>

<template>
  <div class="flex justify-between">
    <div class="background-muted">
      Pending Donations:
      {{ pendingCount }}
    </div>
    <div>
      Accepted Donations:
      {{ acceptedCount }}
    </div>
    <div>
      Total Donations:
      {{ totalCount }}
    </div>
  </div>
  <UTabs :items="items" class="w-full" color="neutral" size="xl">
    <template #pending>
      <StaffPendingDonations
        :donations="pendingDonations"
        :loading="loading"
        :error="error"
      />
    </template>
    <template #accepted>
      <StaffAcceptedDonations
        :donations="acceptedDonations"
        :loading="loading"
        :error="error"
      />
    </template>
  </UTabs>
</template>