<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent, AuthFormField, Form } from "@nuxt/ui";
import { useRouter } from "vue-router";

const toast = useToast();
const router = useRouter();

const fields: AuthFormField[] = [
  {
    name: "email",
    type: "email",
    label: "Email",
    placeholder: "Enter your email",
    required: true,
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
    required: true,
  },
  {
    name: "remember",
    label: "Remember me",
    type: "checkbox",
  },
];

const providers = [
  {
    label: "Google",
    icon: "i-mdi-google",
    onClick: () => {
      window.location.href = "http://localhost:5173/api/auth/google";
    },
  },
];

const links = [
  {
    label: "Don't have an account?",
    to: "/register",
  }
]

const schema = z.object({
  email: z.email("Invalid email"),
  password: z
    .string("Password is required")
    .min(8, "Must be at least 8 characters"),
});

type Schema = z.output<typeof schema>;

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: payload.data.email,
        password: payload.data.password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.add({
        title: "Login Failed",
        description: data.error,
        color: "red",
      });
      return;
    }

    localStorage.setItem("token", data.token);
    toast.add({
      title: "Success",
      description: "Account logged in successfully",
      color: "green",
    });
    router.push("/");
  } catch (err) {
    toast.add({ title: "Error", description: "Something went wrong" });
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        :schema="schema"
        title="Login"
        description="Enter your credentials to access your account."
        icon="i-lucide-user"
        :fields="fields"
        :providers="providers"
        :links="links" :submit="{ label: 'Log In' }"
        @submit="onSubmit"
      />
    </UPageCard>
  </div>
</template>
