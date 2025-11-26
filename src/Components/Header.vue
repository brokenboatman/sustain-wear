<script setup lang="ts">
import Sidebar from '../Components/Sidebar.vue';
import type { DropdownMenuItem } from '@nuxt/ui';
import { ref, computed } from 'vue';

const status = ref('online')
const show = computed(() => status.value !== 'offline')

const items = <DropdownMenuItem[][]>([
  [
    {
      label: 'Notifications:',
      icon: 'lucide:inbox',
      type: 'label'
    }
  ],
  [
    {
      label: 'New Rewards Available!',
      href: '/rewards',
      icon: 'lucide:crown',
      variant: 'ghost',
      color: 'primary',
      class: 'truncate-text-none'
    }
  ],
  [
    {
      label: 'Your Donation is on the Way!',
      href: '/rewards',
      icon: 'lucide:truck',
      variant: 'ghost',
      color: 'info',
    }
  ],
  [
    {
      label: 'Your Donation has been Received!',
      href: '/rewards',
      icon: 'lucide:check',
      variant: 'ghost',
      color: 'info',
    }
  ]
])
</script>

<!-- maybe if you are feeling brave we could make it so the text on the notifications scrolls so you get to see it all if outside container size -->

<template>
    <header class="border-b border-default mb-4">
        <div class="flex align-center justify-between p-4">
            <div class="flex items-center">
            <img src="@/assets/favicon.ico" alt="SustainWear Logo" class="h-8 w-8 mr-2 animate-slide-in"/>
            <h1 class="text-default text-2xl animate-slide-in font-brand">SustainWear</h1>
            </div>
            <div class="flex items-center justify-end">
                <UDropdownMenu
                    :items="items"
                    :ui="{
                    content: 'w-60'
                    }"
                >
                    <UChip inset size="xl">
                        <UButton icon="line-md:bell" color="neutral" variant="ghost" class=" cursor-pointer" size="xl" />
                    </UChip>
                </UDropdownMenu>
                <Sidebar />
            </div>
        </div>
    </header>
</template>