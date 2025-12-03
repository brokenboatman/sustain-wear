<script setup lang="ts">
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

async function fetchDonation(donationId: number): Promise<Donation | null> {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`/api/fetch-donation?donationId=${donationId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err?.error || res.statusText);
    }

    const json = await res.json();
    const d = json.donation;

    if (!d) return null;

    return {
      donationId: String(d.donationId),
      imageRef: d.items?.[0]?.photoUrl ?? "",
      name: d.items?.[0]?.description ?? "Unknown Item",
      status: d.status?.status ?? "Unknown",
    } as Donation;
  } catch (e: any) {
    console.error(e);
    throw e;
  }
}

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
      donationId: String(d.donationId),
      imageRef: d.photoUrl ?? "",
      name: d.title ?? "Unknown Item",
    })) as Donation[];
  } catch (e: any) {
    console.error(e);
    error.value = e?.message ?? "Failed to fetch donations";
  } finally {
    loading.value = false;
  }
}

async function handleEditDonation(donationId: number): Promise<void> {
  try {
    const donation = await fetchDonation(donationId);
    if (donation) {
      console.log("Editing donation:", donation);
    } else {
      console.warn("Donation not found for editing:", donationId);
    }
  } catch (e) {
    console.error("Error fetching donation for editing:", e);
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
          <UButton 
          label="Edit" 
          size="lg" 
          color="primary" 
          icon="i-lucide-edit" 
          @click="handleEditDonation(parseInt(donation.donationId))"
           />
        </div>
        
      </div>
    </div>
  </div>
</template>