<script setup>
import { useRouter } from "vue-router";

const toast = useToast();
const router = useRouter();

async function logout() {
  const token = localStorage.getItem("token");
  if (!token) return;

  await fetch("/api/auth/logout", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  localStorage.removeItem("token");
  toast.add({ title: "Goodbye!", description: "You have been logged out." });
  console.log("LOGOUT CALLED");
  router.push("/login");
}
</script>

<template>
  <USlideover title="" close-icon="i-lucide-arrow-right">
    <UButton icon="line-md:menu" color="neutral" variant="ghost" />

    <template #body>
      <div class="flex flex-col gap-0">
      <div
        class="flex items-center gap-4 animate-slide-in"
        style="animation-delay: 0s"
      >
        <UButton to="/" class="text-xl w-full py-2 text-toned gap-2" variant="ghost" color="neutral">
          <UIcon name="line-md:heart" class="size-8" />
          My Donations
        </UButton>
      </div>
        <div
          class="flex items-center gap-4 animate-slide-in"
          style="animation-delay: 0.2s"
        >
          <UButton to="/account" class="text-xl w-full py-2 text-toned gap-2" variant="ghost" color="neutral">
            <UIcon name="line-md:account" class="size-8" />
            Account
          </UButton>
        </div>
        <div
          class="flex items-center gap-4 animate-slide-in"
          style="animation-delay: 0.4s"
        >
        <UButton to="/rewards" class="text-xl w-full py-2 text-toned gap-2" variant="ghost" color="neutral">
            <UIcon name="line-md:star" class="size-8" />
            Rewards & Badges
          </UButton>
        </div>
        <div
          class="flex items-center gap-4 animate-slide-in"
          style="animation-delay: 0.6s"
        >
          <UButton variant="subtle" color="neutral"
          class="text-xl w-full py-2 cursor-pointer gap-2" 
          @click="logout">
          <UIcon name="line-md:log-out" class="size-8" />
            Log Out
          </UButton>
        </div>
      </div>
    </template>
  </USlideover>
</template>
