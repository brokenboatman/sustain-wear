<template>
  <div class="callback-container">
    <h2>Signing you in...</h2>
    <p>Please wait.</p>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

onMounted(() => {
  const token = route.query.token;

  if (token) {
    localStorage.setItem("token", token);
    router.push("/");
  } else {
    console.error("No token provided in callback.");
    router.push("/login?error=auth_failed");
  }
});
</script>

<style scoped>
.callback-container {
  padding: 40px;
  text-align: center;
  font-family: sans-serif;
}
</style>
