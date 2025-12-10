<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { z } from "zod";

const toast = useToast();

const updateProfileSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(100, "Username must be less than 100 characters"),
    email: z.email("Invalid email address"),
    avatar: z.string().min(1, "Please select an avatar"),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword && data.newPassword.length > 0) {
      if (data.newPassword.length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "New password must be at least 8 characters",
          path: ["newPassword"],
        });
      }

      if (data.newPassword !== data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "New passwords do not match",
          path: ["confirmPassword"],
        });
      }

      if (!data.currentPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Current password is required to set a new one",
          path: ["currentPassword"],
        });
      }
    }
  });

const state = reactive({
  username: "",
  email: "",
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const presetAvatars = [
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Felix",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Aneka",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Shadow",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Precious",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=George",
];

const loading = ref(false);
const selectedAvatar = ref<string>("");
const isGoogleUser = ref(false);

async function fetchUserInfo(): Promise<void> {
  loading.value = true;
  try {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/fetch-userinfo", {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err?.error || res.statusText);
    }

    const json = await res.json();
    const userFromApi = Array.isArray(json.users) ? json.users[0] : null;

    if (userFromApi) {
      state.email = userFromApi.email ?? "";
      state.username = userFromApi.username ?? "";
      selectedAvatar.value = userFromApi.profileURL ?? "";
      isGoogleUser.value = !userFromApi.password;
    }
  } catch (e: any) {
    toast.add({
      title: "Error",
      description: e?.message ?? "Failed to fetch User Info",
      color: "red",
    });
  } finally {
    loading.value = false;
  }
}

async function deleteProfile() {
  if (!confirm("Are you sure? This cannot be undone.")) return;

  loading.value = true;
  try {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/delete-user", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      toast.add({ title: "Account deleted", color: "green" });
      window.location.href = "/register";
    } else {
      throw new Error("Failed to delete account");
    }
  } catch (e: any) {
    toast.add({
      title: "Error",
      description: e.message || "Failed to delete profile",
      color: "red",
    });
  } finally {
    loading.value = false;
  }
}

async function saveChanges() {
  const formValues = {
    ...state,
    avatar: selectedAvatar.value,
  };

  const result = updateProfileSchema.safeParse(formValues);

  if (!result.success) {
    toast.add({
      title: "Validation Error",
      description: result.error.issues[0].message,
      color: "red",
    });
    return;
  }

  loading.value = true;

  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authorization token found");

    const payload = {
      username: state.username,
      email: state.email,
      profileURL: selectedAvatar.value,
      currentPassword: state.currentPassword,
      newPassword: state.newPassword,
    };

    const res = await fetch("/api/update-userinfo", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to update profile");
    }

    toast.add({
      title: "Success",
      description: "Profile updated successfully!",
      color: "green",
    });

    state.currentPassword = "";
    state.newPassword = "";
    state.confirmPassword = "";
  } catch (e: any) {
    toast.add({
      title: "Save Failed",
      description: e.message || "An error occurred while saving.",
      color: "red",
    });
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchUserInfo();
});
</script>

<template>
  <div class="pt-4 flex flex-col items-center gap-6">
    <div></div>
    <div>
      <div class="pt-4">
        <h2 class="text-2xl mb-4">Change Account Details</h2>

        <div class="flex flex-wrap gap-4 justify-center">
          <UAvatar
            v-for="url in presetAvatars"
            :key="url"
            :src="url"
            size="lg"
            class="cursor-pointer transition-all duration-200 hover:scale-110 ring-2 ring-offset-2 dark:ring-offset-gray-900"
            :class="
              selectedAvatar === url
                ? 'ring-primary-500 scale-110'
                : 'ring-transparent opacity-70 hover:opacity-100'
            "
            @click="selectedAvatar = url"
          />
        </div>

        <form
          @submit.prevent="saveChanges"
          class="flex flex-col gap-6 max-w-md mx-auto px-2 pt-4"
        >
          <UInput
            v-model="state.username"
            label="Username"
            placeholder="Enter your username"
          />
          <div v-if="!isGoogleUser" class="flex flex-col gap-6">
            <UInput
              v-model="state.email"
              type="email"
              label="Email"
              placeholder="Enter your email"
            />

            <UInput
              v-model="state.currentPassword"
              type="password"
              label="Current Password"
              placeholder="Enter your current password"
            />
            <UInput
              v-model="state.newPassword"
              type="password"
              label="New Password"
              placeholder="Enter your new password"
            />
            <UInput
              v-model="state.confirmPassword"
              type="password"
              label="Confirm New Password"
              placeholder="Confirm your new password"
            />
          </div>
          <div>
            <UButton
              type="submit"
              color="primary"
              variant="solid"
              size="xl"
              :loading="loading"
            >
              Save Changes
            </UButton>
            <UButton
              type="button"
              color="error"
              variant="solid"
              size="xl"
              :loading="loading"
              @click="deleteProfile"
              class="ml-4"
            >
              Delete Profile
            </UButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
