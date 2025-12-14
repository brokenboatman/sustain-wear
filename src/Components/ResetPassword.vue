<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import { reactive, ref, onMounted } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const toast = useToast();

const token = route.query.token as string;

onMounted(() => {
  if (!token) {
    toast.add({
      title: "Error",
      description: "Invalid reset link.",
      color: "red",
    });
    router.push("/login");
  }
});

const state = reactive({
  password: undefined,
  confirmPassword: undefined,
});

const schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const loading = ref(false);

async function onSubmit(event: FormSubmitEvent<z.infer<typeof schema>>) {
  loading.value = true;
  try {
    await axios.post("api/auth/reset-password", {
      token: token,
      newPassword: event.data.password,
    });

    toast.add({
      title: "Success",
      description: "Password reset! You can now log in.",
      color: "green",
    });

    setTimeout(() => router.push("/login"), 2000);
  } catch (error: any) {
    const msg = error.response?.data?.error || "Failed to reset password";
    toast.add({ title: "Error", description: msg, color: "red" });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div
    class="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 p-4"
  >
    <UCard class="w-full max-w-sm shadow-xl">
      <template #header>
        <h3 class="text-xl font-bold text-center">Set New Password</h3>
      </template>

      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField label="New Password" name="password">
          <UInput
            v-model="state.password"
            type="password"
            placeholder="••••••••"
            icon="i-lucide-lock"
            size="lg"
          />
        </UFormField>

        <UFormField label="Confirm Password" name="confirmPassword">
          <UInput
            v-model="state.confirmPassword"
            type="password"
            placeholder="••••••••"
            icon="i-lucide-lock"
            size="lg"
          />
        </UFormField>

        <UButton type="submit" block size="lg" :loading="loading">
          Reset Password
        </UButton>
      </UForm>
    </UCard>
  </div>
</template>
