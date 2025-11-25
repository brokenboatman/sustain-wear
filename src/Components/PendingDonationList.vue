<!-- We could remove the imageRef data and just use the ID if our images have a link containing the ID -->
<script setup lang="ts">
type Donation = {
  donationId: string
  imageRef: string
  name: string
  status: 'On its way' | 'In transit' | 'Received at Charity' | 'Accepted'
}

const props = defineProps<{
  donations: Donation[]
  loading: boolean
  error: string | null
}>()
</script>

<template>
  <div class="flex-1 flex-direction-column text-default">
    <div v-if="loading" class="text-center p-4">Loading...</div>
    <div v-else-if="error" class="text-red-500 text-center p-4">{{ error }}</div>
    <div v-else class="overflow-y-auto max-h-80 border border-muted p-2 rounded-lg mb-2">
      <div v-if="donations.length === 0" class="text-center p-4 text-muted">
        No pending donations
      </div>
      <div v-for="donation in donations" :key="donation.donationId" class="flex items-center justify-between h-20 border border-muted bg-elevated mb-2 p-2 rounded-lg gap-x-1">
        <!-- comment code below is for when images are added -->
        <!-- <img :src="donation.imageRef" /> -->
        <p class="text-left w-3/10">{{ donation.imageRef }}</p>
        <p class="text-left w-3/10 font-bold">{{ donation.name }}</p>
        <div class="text-left flex items-center gap-x-2 w-4/10">
          <UIcon class="size-5" v-if="donation.status === 'In transit'" name="lucide:truck" />
          <UIcon class="size-5" v-if="donation.status === 'Received at Charity'" name="lucide:warehouse" />
          <UIcon class="size-5" v-if="donation.status === 'On its way'" name="lucide:package" />
          <p>{{ donation.status }}</p>
        </div>
      </div>
    </div>
  </div>
</template>