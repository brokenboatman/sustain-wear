<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import { reactive, ref } from "vue";
import axios from "axios";

const toast = useToast();

const state = reactive({
  email: undefined,
});

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const loading = ref(false);

async function onSubmit(event: FormSubmitEvent<z.infer<typeof schema>>) {
  loading.value = true;
  try {
    const response = await axios.post("api/auth/forgot-password", {
      email: event.data.email,
    });

    toast.add({
      title: "Email sent",
      description: response.data.message,
      color: "green",
    });
  } catch (error: any) {
    console.error(error);
    const msg = error.response?.data?.error || "Failed to send email";

    toast.add({
      title: "Error",
      description: msg,
      color: "red",
    });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4">
    <UCard class="w-full max-w-sm shadow-xl">
      <template #header>
        <div class="text-center">
          <h3 class="text-xl font-bold">Forgot Password?</h3>
          <p class="mt-1 text-sm">Enter your email to receive a reset link</p>
        </div>
      </template>

      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField label="Email" name="email">
          <UInput
            v-model="state.email"
            placeholder="you@example.com"
            icon="i-lucide-mail"
            class="w-full"
            size="lg"
          />
        </UFormField>

        <UButton
          type="submit"
          color="neutral"
          variant="solid"
          size="lg"
          block
          :loading="loading"
        >
          Send Reset Link
        </UButton>
      </UForm>

      <template #footer>
        <div class="text-center text-sm">
          <ULink
            to="/login"
            class="text-primary-500 hover:underline font-medium"
          >
            Back to Login
          </ULink>
        </div>
      </template>
    </UCard>
  </div>
</template>
