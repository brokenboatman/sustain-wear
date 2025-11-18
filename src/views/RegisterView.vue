<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent, AuthFormField } from "@nuxt/ui";
import { useRouter } from "vue-router";

const toast = useToast();
const router = useRouter();

const fields: AuthFormField[] = [
  {
    name: "username",
    label: "Username",
    type: "text",
    placeholder: "Enter your username",
    required: true,
  },
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
    name: "repeat password",
    label: "Repeat Password",
    type: "password",
    placeholder: "Repeat your password",
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
    class: "cursor-pointer",
    onClick: () => {
      window.location.href = "http://localhost:3000/api/auth/google";
    },
  },
];

const links = [
  {
    label: "Already have an account?",
    to: "/login",
  },
];

const schema = z
  .object({
    email: z.email("Invalid email"),
    password: z
      .string("Password is required")
      .min(8, "Must be at least 8 characters"),
    username: z
      .string("Username is required")
      .min(3, "Must be at least 3 characters"),
    "repeat password": z.string("Please repeat your password"),
  })
  .refine((data) => data.password === data["repeat password"], {
    message: "Passwords do not match",
  });

type Schema = z.output<typeof schema>;

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: payload.data.email,
        password: payload.data.password,
        username: payload.data.username,
        roleId: 1,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.add({ title: "Error", description: data.error, color: "red" });
      return;
    }

    toast.add({
      title: "Success",
      description: "Account created!",
      color: "green",
    });
    router.push("/login");
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
        title="Register"
        description="Enter your credentials to access your account."
        icon="i-lucide-user"
        :fields="fields"
        :providers="providers"
        :links="links"
        :submit="{ label: 'Register', class: 'cursor-pointer' }"
        @submit="onSubmit"
      />
      <div class="text-center text-sm text-muted">
        Already have an account?
        <ULink
          to="/login" 
          variant="link" 
          class="font-semibold text-primary ml-1"
        >
          Log in
        </ULink>
      </div>
    </UPageCard>
  </div>
</template>
