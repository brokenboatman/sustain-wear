<script setup>
import Sidebar from '../components/Sidebar.vue';
</script>

<template>
    <header class="border-b border-default mb-4">
        <div class="flex align-center justify-between p-6">
            <div class="flex items-center">
            <img src="@/assets/logo.png" alt="SustainWear Logo" class="h-8 w-8 mr-2 animate-slide-in" />
            <h1 class="text-default text-2xl animate-slide-in font-brand">SustainWear</h1>
            </div>
            <div class="flex items-end justify-end">
            <UButton icon="line-md:bell" color="neutral" variant="ghost" />
            <sidebar />
            </div>
        </div>
    </header>
</template>