<template>
  <USlideover title="" close-icon="i-lucide-arrow-right">
    <UButton label="Open" color="neutral" variant="subtle" />

    <template #body>
        <!-- <Placeholder class="h-full" /> -->
        <ULink to="/" class="text-2xl">My Donations</ULink>
        <br></br><br></br>
        <ULink to="/account" class="text-2xl">Account</ULink>
        <br></br><br></br>
        <ULink to="/settings" class="text-2xl">Settings</ULink>
        <br></br><br></br>
        <ULink to="/rewards" class="text-2xl">Rewards & Badges</ULink>
        <br></br><br></br>
        <ULink to="/" class="text-2xl">Log out</ULink>
    </template>
  </USlideover>
</template>