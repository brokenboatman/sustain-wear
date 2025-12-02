<script setup lang="ts">
  import StaffDonationList from '@/components/StaffDonationList.vue';
</script>

<template>
  <main class="px-4 md:px-8 lg:px-16 flex flex-col gap-2 mb-6">
    <div class="w-full  flex flex-col justify-center">
      <p>Donations management page for staff</p>
      <StaffDonationList />
    </div>
  </main>
</template>

<style scoped>
main {
  text-align: center;
  color: default;
}
</style>