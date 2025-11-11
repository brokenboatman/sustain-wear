<template>
  <USlideover title="" close-icon="i-lucide-arrow-right">
    <UButton icon="line-md:menu" color="neutral" variant="ghost"/>

    <template #body>
         <div class="flex items-center gap-4 mb-4 animate-slide-in" style="animation-delay: 0s">
            <UIcon name="line-md:heart" class="size-8" />
            <ULink to="/" class="text-2xl">My Donations</ULink>
         </div>
         <div class="flex items-center gap-4 mb-4 animate-slide-in" style="animation-delay: 0.2s">
            <UIcon name="line-md:account" class="size-8" />
            <ULink to="/account" class="text-2xl">Account</ULink>
          </div>
          <div class="flex items-center gap-4 mb-4 animate-slide-in" style="animation-delay: 0.4s">
            <UIcon name="line-md:cog" class="size-8" />
            <ULink to="/settings" class="text-2xl">Settings</ULink>
          </div>
          <div class="flex items-center gap-4 mb-4 animate-slide-in" style="animation-delay: 0.6s">
            <UIcon name="line-md:star" class="size-8" />
            <ULink to="/rewards" class="text-2xl">Rewards & Badges</ULink>
          </div>
          <div class="flex items-center gap-4 mb-4 animate-slide-in" style="animation-delay: 0.8s">
            <UIcon name="line-md:log-out" class="size-8" />
            <ULink to="/" class="text-2xl">Log out</ULink>
          </div>
    </template>
  </USlideover>
</template>