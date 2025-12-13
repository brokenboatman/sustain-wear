<script setup lang="ts">
import { ref } from "vue";
import ViewDonationDialog from "./ViewDonationDialog.vue";

type Donation = {
  donationId: string;
  imageRef: string;
  name: string;
  status: "On its way" | "In transit" | "Received at Charity" | "Accepted";
};

defineProps<{
  donations: Donation[];
  loading: boolean;
  error: string | null;
}>();

const selectedDonationId = ref<string | null>(null);
const isViewOpen = ref(false);

function openViewModal(id: string) {
  selectedDonationId.value = id;
  isViewOpen.value = true;
}
</script>

<template>
  <div
    class="flex-1 flex-direction-column text-default max-h-100 overflow-y-auto"
  >
    <div v-if="loading" class="text-center p-4">Loading...</div>
    <div v-else-if="error" class="text-red-500 text-center p-4">
      {{ error }}
    </div>
    <div
      v-else
      class="flex flex-col gap-y-2 border border-muted p-2 rounded-xl mb-2"
    >
      <div v-if="donations.length === 0" class="text-center p-4 text-muted">
        No past donations
      </div>
      <div
        v-for="donation in donations"
        :key="donation.donationId"
        @click="openViewModal(donation.donationId)"
        class="flex items-center justify-between h-20 border border-muted bg-elevated p-2 rounded-lg gap-x-1 cursor-pointer hover:bg-gray-50/10 transition-colors"
      >
        <div class="text-left flex items-center gap-x-2 w-6/10">
          <img
            v-if="donation.imageRef"
            :src="donation.imageRef"
            class="w-16 h-16 object-cover rounded-lg"
          />
          <p class="text-left w-full font-bold px-2">{{ donation.name }}</p>
        </div>
        <p class="text-left w-4/10">Status: {{ donation.status }}</p>
      </div>
    </div>

    <ViewDonationDialog
      v-model:open="isViewOpen"
      :donationId="selectedDonationId"
    />
  </div>
</template>
