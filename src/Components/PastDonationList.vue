<script setup lang="ts">
import { ref } from 'vue'

type Donation = {
  id: string
  imageRef: string
  name: string
  date: string
}

const data = ref<Donation[]>([
  {
    id: '001',
    imageRef: "[image ref here]",
    name: "T-Shirt",
    date: "14/11/2025"
  },
  {
    id: '002',
    imageRef: "[image ref here]",
    name: "Beige trousers",
    date: "16/11/2025"
  },
  {
    id: '003',
    imageRef: "[image ref here]",
    name: "Floral dress",
    date: "24/11/2025"
  }
])
</script>

<!-- We could remove the imageRef data and just use the ID if our images have a link containing the ID -->

<template>
  <div class="flex-1 flex-direction-column text-default">
    <div v-for="donation in data" :key="donation.id" class="flex items-center justify-between h-20 border border-muted bg-elevated mb-2 p-2 rounded-lg gap-x-1">
      <!-- comment code below is for when images are added -->
      <!-- <img :src="donation.imageRef" /> -->
      <p class="text-left w-3/10">{{ donation.imageRef }}</p>
      <p class="text-left w-3/10 font-bold">{{ donation.name }}</p>
      <p class="text-left w-4/10">Date Donated: {{ donation.date }}</p>
    </div>
  </div>
</template>