<script setup>
  import AccountDetails from '@/components/AccountDetails.vue';
  import Sidebar from '../components/Sidebar.vue';
  import Header from "@/components/Header.vue";

</script>

<template>
  <main>
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