<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

function decodeToken(token) {
  try {
    // JWTs are split into 3 parts by '.', the payload is the second part
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}

async function redirectUserBasedOnRole() {
  const token = localStorage.getItem("token");

  if (!token) {
    router.push("/login");
    return;
  }

  const userData = decodeToken(token);

  if (!userData || !userData.roleId) {
    // If token is invalid or corrupted
    router.push("/login");
    return;
  }

  const roleId = userData.roleId;

  switch (roleId) {
    case 1:
      router.push("/my-donations");
      break;
    case 2:
      router.push("/donations");
      break;
    case 3:
      router.push("/user-management");
      break;
  }
}

onMounted(() => {
  redirectUserBasedOnRole();
});
</script>

<template>
  <main class="px-4 md:px-8 lg:px-16 flex flex-col gap-2 mb-6">
    <div class="w-full flex justify-center">
      <p>Redirecting...</p>
    </div>
  </main>
</template>

<style scoped>
main {
  text-align: center;
  color: default;
}
</style>
