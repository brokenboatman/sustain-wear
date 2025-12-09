<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { TimelineItem } from "@nuxt/ui";

// --- State ---
const donations = ref(0);
const loading = ref(true);

// --- Logic for Milestones (Computed) ---
const userMilestones = computed(() => {
  const d = donations.value;
  if (d >= 100) return 5;
  if (d >= 50) return 4;
  if (d >= 20) return 3;
  if (d >= 10) return 2;
  if (d >= 5) return 1;
  if (d >= 1) return 0;
  return -1; // No milestones yet
});

const color = computed(() => {
  return userMilestones.value === 5 ? "primary" : "info";
});

// --- Data Fetching ---
onMounted(async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch("/api/fetch-donationcount", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const data = await res.json();
      donations.value = data.stats.totalDonations;
    }
  } catch (e) {
    console.error("Error fetching donation stats:", e);
  } finally {
    loading.value = false;
  }
});

// --- Static Content ---
const items = <TimelineItem[]>[
  {
    title: "Donate Your First Item",
    description:
      "You've taken your first step toward making a real difference. Every donation starts a journey of positive change!",
    icon: "lucide:hand-heart",
  },
  {
    title: "Donate 5 Items",
    description:
      "You're building momentum! Five donations means five opportunities to create meaningful impact in your community.",
    icon: "lucide:star",
  },
  {
    title: "Donate 10 Items",
    description:
      "You're a dedicated contributor! Double digits show your commitment to sustainable giving and helping those in need.",
    icon: "lucide:star",
  },
  {
    title: "Donate 20 Items",
    description:
      "You're a champion of change! Twenty donations demonstrates exceptional generosity and transforms lives. Thank you for your continued support!",
    icon: "lucide:star",
  },
  {
    title: "Donate 50 Items",
    description:
      "You're a sustainability superstar! Fifty donations show you're truly invested in creating a lasting legacy of generosity and environmental stewardship.",
    icon: "lucide:star",
  },
  {
    title: "Donate 100 Items",
    description:
      "You're a beacon of hope and change! One hundred donations is extraordinary—you've become a pillar of our community and an inspiration to others. Your impact is immeasurable!",
    icon: "lucide:party-popper",
  },
];

const cards = [
  {
    title: "First Donation Badge",
    description: "Awarded for making your first donation.",
    requiredDonations: 1,
    variant: "soft",
    image: {
      light: "/images/badges/badgefirst.png",
      dark: "/images/badges/badgefirst.png",
    },
  },
  {
    title: "Five Donations Badge",
    description: "Awarded for donating 5 items.",
    requiredDonations: 5,
    variant: "soft",
    image: {
      light: "/images/badges/badgefive.png",
      dark: "/images/badges/badgefive.png",
    },
  },
  {
    title: "Ten Donations Badge",
    description: "Awarded for donating 10 items.",
    requiredDonations: 10,
    variant: "soft",
    image: {
      light: "/images/badges/badgeten.png",
      dark: "/images/badges/badgeten.png",
    },
  },
  {
    title: "Twenty Donations Badge",
    description: "Awarded for donating 20 items.",
    requiredDonations: 20,
    variant: "soft",
    image: {
      light: "/images/badges/badgetwenty.png",
      dark: "/images/badges/badgetwenty.png",
    },
  },
  {
    title: "Fifty Donations Badge",
    description: "Awarded for donating 50 items.",
    requiredDonations: 50,
    variant: "soft",
    image: {
      light: "/images/badges/badgefifty.png",
      dark: "/images/badges/badgefifty.png",
    },
  },
  {
    title: "Hundred Donations Badge",
    description: "Awarded for donating 100 items.",
    requiredDonations: 100,
    variant: "soft",
    image: {
      light: "/images/badges/badgehundred.png",
      dark: "/images/badges/badgehundred.png",
    },
  },
];
</script>

<template>
  <div class="pb-10 px-6 animate-slide-in">
    <h1 class="text-4xl font-bold text-center my-8">Your Rewards</h1>
    <p class="text-center text-lg max-w-2xl mx-auto">
      As a token of our appreciation for your generosity, we've designed a
      rewards system to celebrate your milestones in donating items. Each time
      you reach a new donation milestone, you'll unlock exciting rewards that
      reflect your commitment to making a positive impact. Keep donating and
      watch your rewards grow!
    </p>

    <div class="text-center mt-4">
      <span class="text-2xl font-bold text-primary-600">{{ donations }}</span>
      <span class="text-gray-500 ml-2">Total Donations</span>
    </div>
  </div>

  <USeparator icon="lucide:map" class="pb-6" />

  <div class="flex justify-center py-10 animate-slide-in">
    <UTimeline
      :color="color"
      size="xl"
      orientation="vertical"
      :default-value="userMilestones"
      :items="items"
      :ui="{
        item: 'even:flex-row-reverse even:-translate-x-[calc(100%-40px)] even:text-right',
      }"
      class="w-70 float-right mx-15 translate-x-[calc(50%-1rem)]"
    />
  </div>

  <USeparator icon="lucide:medal" />

  <div class="px-5 py-15 animate-slide-in">
    <UPageGrid>
      <template v-for="(card, index) in cards" :key="index">
        <UPageCard
          v-if="donations >= card.requiredDonations"
          v-bind="card"
          class="flex flex-col items-center justify-center text-center gap-4 p-6 transition-all duration-500"
        >
          <div class="flex flex-col items-center justify-center">
            <img
              v-if="card.image"
              :src="card.image.light"
              :alt="card.title"
              height="200"
              width="200"
            />
          </div>
        </UPageCard>
      </template>
    </UPageGrid>
  </div>
</template>
