<script setup>
  import AccountDetails from '@/components/AccountDetails.vue';
  import Sidebar from '../components/Sidebar.vue';
  import Header from "@/components/Header.vue";

</script>

<template>
  <Header />
  <main>
    <header class="border-b border-inverted mb-4 pb-2">
      <div class="flex align-center justify-between p-4">
        <div class="flex items-center">
          <h1 class="text-default text-2xl animate-slide-in font-brand">SustainWear</h1>
        </div>
        <div class="flex items-end justify-end">
          <UButton icon="line-md:bell" color="neutral" variant="ghost" />
          <sidebar />
        </div>
      </div>
    </header>
    <!-- displaying the account  -->
    <div class="px-4">
      <AccountDetails/>
    </div>
  </main>
</template>

<style scoped>
main {
  text-align: center;
  /* color: blue; */
}
</style>