<template>
  <USlideover title="" close-icon="i-lucide-arrow-right">
    <UButton label="Open" color="neutral" variant="subtle" />

    <template #body>
        <!-- <Placeholder class="h-full" /> -->
        <ULink to="src\views\HomeView.vue" class="text-2xl">My Donations</ULink>
        <br></br><br></br>
        <ULink to="src\views\AccountView.vue" class="text-2xl">Account</ULink>
        <br></br><br></br>
        <ULink to="src\views\SettingsView.vue" class="text-2xl">Settings</ULink>
        <br></br><br></br>
        <ULink to="src\views\RewardsView.vue" class="text-2xl">Rewards & Badges</ULink>
        <br></br><br></br>
        <ULink to="/docs/components/link" class="text-2xl">Log out</ULink>
    </template>
  </USlideover>
</template>