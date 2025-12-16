<script setup lang="ts">

const toast = useToast();

type Donation = {
  donationId: number;
  imageRef: string;
  name: string;
  status: "On its way" | "In transit" | "Received at Charity" | "Accepted";
};

const props = defineProps<{
  donations: Donation[];
  loading: boolean;
  error: string | null;
}>();

// updates donation status to accepted (4)
async function updateDonation(donationId: number, newStatus: number) {
  const token = localStorage.getItem("token");

  try {

    const res = await fetch(`/api/update-donation?donationId=${donationId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ statusId: newStatus }),
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.error || "Failed to update donation");
    }

    toast.add({
      title: "Success:",
      description: "Donation accepted successfully.",
      color: "success",
    });

    // moves the pending donation to the accepted donations list without having to reload the donation list
    const updatedDonation = props.donations.find((donation) => donation.donationId === donationId);
    if(updatedDonation) {
        updatedDonation.status = "Accepted";
    }
    
  } catch (e: any) {
    toast.add({
      title: "Error:",
      description: e.message,
      color: "error",
    });
  }
}
</script>

<template>
  <div class="flex-1 flex-direction-column text-default overflow-y-auto">
    <div v-if="loading" class="text-center p-4">Loading...</div>
    <div v-else-if="error" class="text-red-500 text-center p-4">
      {{ error }}
    </div>
    <div
      v-else
      class="flex flex-col gap-y-2 border border-muted p-2 rounded-xl mb-2"
    >
      <div v-if="donations.length === 0" class="text-center p-4 text-muted">
        No pending donations
      </div>
      <div
        v-for="donation in donations"
        :key="donation.donationId"
        class="flex items-center justify-between h-20 border border-muted bg-elevated p-2 rounded-lg"
      >
         <div class="text-left flex items-center gap-x-2 w-6/10">
           <img v-if="donation.imageRef" :src="donation.imageRef" class="w-16 h-16 object-cover rounded-lg" />
           <p class="text-left w-full font-bold px-2">{{ donation.name }}</p>
         </div>
        <div class="text-left flex items-center w-4/10 gap-x-4 justify-end">
          <UButton icon="lucide:check" color="success" class="text-lg cursor-pointer" @click="updateDonation(donation.donationId, 4)">Accept</UButton>
          <EditDonationDialog :donationId="donation.donationId" />
        </div>
        
      </div>
    </div>
  </div>
</template>