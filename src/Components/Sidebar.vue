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
        <UButton
          variant = "link"
          class = "text-2xl"
          @onClick = logout()
        >
        Log out
      </UButton>
    </template>
  </USlideover>
</template>

<script>

async function logout() {
  const token = localStorage.getItem("token");
  if (!token) return;

  await fetch("http://localhost:3000/api/auth/logout", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  localStorage.removeItem("token");
  toast.add({ title: "Goodbye!", description: "You have been logged out." });
  router.push("/login");
}

</script>
