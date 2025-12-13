<script setup lang="ts">
  import StaffDonationTab from '@/components/StaffDonationTab.vue';
</script>

<template>
  <main class="px-4 md:px-8 lg:px-16 flex flex-col gap-2 mb-6">
    <div class="w-full flex justify-center">
      <div class="w-full sm:max-w-[720px] gap-0 flex flex-col">
        <StaffDonationTab />
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  text-align: center;
  color: default;
}
</style>