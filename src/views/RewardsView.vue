<script setup lang="ts">
import type { TimelineItem } from '@nuxt/ui'

let donations = 40; // this will be fetched from database and will update accordingly the page depading on how many items the doner has donated

let userMilestones = -1;
let color = 'info';

if (donations >= 1 && donations < 5) {
  userMilestones = 0;
} else if (donations >= 5 && donations < 10) {
  userMilestones = 1;
} else if (donations >= 10 && donations < 20) {
  userMilestones = 2;
} else if (donations >= 20 && donations < 50) {
  userMilestones = 3;
} else if (donations >= 50 && donations < 100) {
  userMilestones = 4;
} else if (donations >= 100) {
  userMilestones = 5;
}

if (userMilestones == 5) {
  color = 'primary';
}


const items = <TimelineItem[]>([
  {
    title: 'Donate Your First Item',
    description: "You've taken your first step toward making a real difference. Every donation starts a journey of positive change!",
    icon: 'lucide:hand-heart'
  },
  {
    title: 'Donate 5 Items',
    description: "You're building momentum! Five donations means five opportunities to create meaningful impact in your community.",
    icon: 'lucide:star'
  },
  {
    title: 'Donate 10 Items',
    description: "You're a dedicated contributor! Double digits show your commitment to sustainable giving and helping those in need.",
    icon: 'lucide:star'
  },
  {
    title: 'Donate 20 Items',
    description: "You're a champion of change! Twenty donations demonstrates exceptional generosity and transforms lives. Thank you for your continued support!",
    icon: 'lucide:star'
  },
  {
    title: 'Donate 50 Items',
    description: "You're a sustainability superstar! Fifty donations show you're truly invested in creating a lasting legacy of generosity and environmental stewardship.",
    icon: 'lucide:star'
  },
  {
    title: 'Donate 100 Items',
    description: "You're a beacon of hope and change! One hundred donations is extraordinary—you've become a pillar of our community and an inspiration to others. Your impact is immeasurable!",
    icon: 'lucide:party-popper'
  }
])


const cards = ([
  {
    title: 'First Donation Badge',
    // icon: 'lucide:hand-heart',
    variant: 'soft',
    image: {
      light: '/images/badges/badgefirst.png',
      dark: '/images/badges/badgefirst.png',
    }
  },
  {
    title: 'Five Donations Badge',
    // icon: 'lucide:star',
    variant: 'soft',
    image: {
      light: '/images/badges/badgefive.png',
      dark: '/images/badges/badgefive.png',
    }
  },
  {
    title: 'Ten Donations Badge',
    // icon: 'lucide:star',
    variant: 'soft',
    image: {
      light: '/images/badges/badgeten.png',
      dark: '/images/badges/badgeten.png',
    }
  },
  {
    title: 'Twenty Donations Badge',
    // icon: 'lucide:star',
    variant: 'soft',
    image: {
      light: '/images/badges/badgetwenty.png',
      dark: '/images/badges/badgetwenty.png',
    }
  },
  {
    title: 'Fifty Donations Badge',
    // icon: 'lucide:star',
    variant: 'soft',
    image: {
      light: '/images/badges/badgefifty.png',
      dark: '/images/badges/badgefifty.png',
    }
  },
  {
    title: 'Hundred Donations Badge',
    // icon: 'lucide:party-popper',
    variant: 'soft',
    image: {
      light: '/images/badges/badgehundred.png',
      dark: '/images/badges/badgehundred.png',
    }
  }
])
</script>

<template>
  <div class="pb-10 px-6 animate-slide-in">
    <h1 class="text-4xl font-bold text-center my-8">Your Rewards</h1>
    <p class="text-center text-lg max-w-2xl mx-auto">
      As a token of our appreciation for your generosity, we've designed a rewards system to celebrate your milestones in donating items. Each time you reach a new donation milestone, you'll unlock exciting rewards that reflect your commitment to making a positive impact. Keep donating and watch your rewards grow!
    </p>
  </div>
  <USeparator icon="lucide:map" class="pb-6"/>
  <div class="flex justify-center py-10 animate-slide-in">
    <UTimeline :color="color" size="xl" orientation="vertical" :default-value="userMilestones" :items="items" :ui="{ item: 'even:flex-row-reverse even:-translate-x-[calc(100%-40px)] even:text-right' }" class="w-70 mx-10 float-right mx-15 translate-x-[calc(50%-1rem)]"/>
  </div>
  <USeparator icon="lucide:medal" />
  <div class="px-5 py-15 animate-slide-in">
    <UPageGrid>
      <UPageCard
        v-for="(card, index) in cards"
        :key="index"
        v-bind="card"
        class="flex flex-col items-center justify-center text-center gap-4 p-6"
      >
        <img v-if="card.image" :src="card.image.light" :alt="card.title" height="200" width="200"/>
      </UPageCard>
    </UPageGrid>
  </div>
</template>

<style scoped>
  
</style>