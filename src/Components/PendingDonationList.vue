<script setup lang="ts">
import { ref } from 'vue'

type Donation = {
  id: string
  imageRef: string
  name: string
  status: 'In transit' | 'Arrived at final depot' | 'On its way'
}

const data = ref<Donation[]>([
  {
    id: '001',
    imageRef: "[image ref here]",
    name: "T-Shirt",
    status: 'In transit',
  },
  {
    id: '002',
    imageRef: "[image ref here]",
    name: "Beige trousers",
    status: 'Arrived at final depot',
  },
  {
    id: '003',
    imageRef: "[image ref here]",
    name: "Floral dress",
    status: 'On its way',
  }
])
</script>

<!-- We could remove the imageRef data and just use the ID if our images have a link containing the ID -->

<template>
  <div class="flex-1 flex-direction-column text-default">
    <div class="overflow-y-auto max-h-80 border border-muted p-2 rounded-lg mb-2">
      <div v-for="donation in data" :key="donation.id" class="flex items-center justify-between h-20 border border-muted bg-elevated mb-2 p-2 rounded-lg gap-x-1">
        <!-- comment code below is for when images are added -->
        <!-- <img :src="donation.imageRef" /> -->
        <p class="text-left w-3/10">{{ donation.imageRef }}</p>
        <p class="text-left w-3/10 font-bold">{{ donation.name }}</p>
        <div class="text-left flex items-center gap-x-2 w-4/10">
          <UIcon class="size-5" v-if="donation.status === 'In transit'" name="lucide:truck" />
          <UIcon class="size-5" v-if="donation.status === 'Arrived at final depot'" name="lucide:warehouse" />
          <UIcon class="size-5" v-if="donation.status === 'On its way'" name="lucide:package" />
          <p>{{ donation.status }}</p>
        </div>
      </div>
    </div>
  </div>
</template>