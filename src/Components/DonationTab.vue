<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'
import { ref } from 'vue'
import PendingDonationList from './PendingDonationList.vue'
import PastDonationList from './PastDonationList.vue'

const items = ref<TabsItem[]>([
  {
    label: 'Pending Donations',
    icon: 'lucide:truck',
    content: 'This is the pending donations.',
    slot: 'pending' as const
  },
  {
    label: 'Past Donations',
    icon: 'lucide:package-check',
    content: 'This is the past donations.',
    slot: 'past' as const
  }
])
</script>

<template>
  <UTabs :items="items" class="w-full">
    <template #pending>
        <PendingDonationList />
    </template>
    <template #past="{ item }">
        <PastDonationList />
    </template>
  </UTabs>
</template>