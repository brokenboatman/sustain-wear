<script setup lang="ts">

  import { reactive, ref } from "vue";
  import { h, onMounted, resolveComponent } from "vue";
  import type { TableColumn } from '@nuxt/ui'

  import * as z from 'zod'
  import type { FormSubmitEvent } from '@nuxt/ui'
import { use } from "passport";

  const UBadge = resolveComponent('UBadge')

  const loading = ref(false);
  const error = ref<string | null>(null);

  type User = {
    userId: number;
    username: string;
    email: string;
    password: string;
    roleId: number;
    profileURL: string;
  };
  const state = reactive<{ users: User[] }>({
    users: []
  })

  const editedUsers = ref<Set<number>>(new Set());

  function trackEdit(userId: number) {
    editedUsers.value.add(userId);
  }

  const columns: TableColumn<User>[] = [
    {
      accessorKey: "userId",
      header: "ID",
      cell: ({row}) => `${row.getValue("userId")}`,
    },
    {
      accessorKey: "username",
      header: "Username",
    },
    {
    accessorKey: 'roleId',
    header: 'Role',
  },
  {accessorKey: "email", header: "Email"},
  {accessorKey: "password", header: "Password"},
  { id: "button" },
];

async function fetchUsers(): Promise<void> {
  loading.value = true;
  error.value = null;
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/fetch-users`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err?.error || res.statusText);
    }

    const json = await res.json();
    // Process the fetched users as needed
    state.users = json.users.map((u: any) => ({
      userId: u.userId,
      username: u.username,
      email: u.email,
      password: '', // Do not fetch passwords for security reasons
      roleId: u.roleId,
      profileURL: u.profileURL || ''
    })).sort((a: User, b: User) => a.userId - b.userId);
    console.log(json.users);
  } catch (e: any) {
    console.error(e);
    error.value = e?.message ?? "Failed to fetch users";
  } finally {
    loading.value = false;
  }
};

// form validation schema

const userSchema = z.object({
  userId: z.number(),
  username: z.string().min(3, 'Username must be at least 3 characters long'),
  email: z.email('Invalid email address'),
  password: z.string().optional().or(z.literal('')), // no password change if left empty
  roleId: z.number().min(1).max(3, 'Role ID must be between 1 and 3'),
  profileURL: z.string().optional()
})
const schema = z.object({
  users: z.array(userSchema)
})

type Schema = z.output<typeof schema>
// handle form submission
const toast = useToast()

const confirmModalOpen = ref(false);
const pendingSubmission = ref<Schema | null>(null);

async function onSubmit(event: FormSubmitEvent<Schema>) {
    const usersToUpdate = event.data.users.filter(user => 
      editedUsers.value.has(user.userId)
    );

    console.log('Users to update:', usersToUpdate);
    if (usersToUpdate.length === 0) {
      toast.add({
        title: "Info:",
        description: "No changes to save.",
        color: "info",
      });
      loading.value = false;
      return;
    }
    pendingSubmission.value = { users: usersToUpdate };
    confirmModalOpen.value = true;
}

async function confirmSubmit() {
  loading.value = true;
  error.value = null;
  confirmModalOpen.value = false;
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/update-users`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ users: pendingSubmission.value?.users }),
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.error || "Failed to update user info");
    }

    toast.add({
      title: "Success:",
      description: "User information updated successfully.",
      color: "success",
    });

    editedUsers.value.clear();
    // refresh user list
    await fetchUsers();
    
  } catch (e: any) {
    toast.add({
      title: "Error:",
      description: e.message,
      color: "error",
    });
  } finally {
    loading.value = false;
    pendingSubmission.value = null;
  }
}

function onError(error: any) {
  console.error('Validation error:', error)
  console.error('Error details:', error.errors) // Add this line to see the actual errors
  toast.add({ 
    title: 'Validation Error', 
    description: 'Please check the form fields for errors.', 
    color: 'error' 
  })
}

const roleItems = ref([
  { label: 'User', value: 1 },
  { label: 'Staff', value: 2 },
  { label: 'Admin', value: 3 }
]);
onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <main class="px-4 md:px-8 lg:px-8 flex flex-col gap-2 mb-6">
    <div class="w-full flex justify-center">
      <div class="w-full  gap-0 flex flex-col">
        <UForm :state="state" :schema="schema" @submit="onSubmit" @error="onError">
          <UTable sticky :loading="loading" loading-color="primary" :data="state.users" :columns="columns" class="border border-accented rounded-lg text-left z-0">
          <template #username-cell="{ row }">
            <UFormField :name="'users.' + row.index + '.username'">
              <UInput 
                v-model="state.users[row.index].username"
                placeholder="Username"
                class="w-full"
                variant="subtle"
                @input="trackEdit(state.users[row.index].userId)"
              />
            </UFormField>
          </template>
          <template #email-cell="{ row }">
            <UFormField :name="'users.' + row.index + '.email'">
                <UInput 
                  v-model="state.users[row.index].email"
                  placeholder="Email" 
                  class="w-full"
                  variant="subtle"
                  @input="trackEdit(state.users[row.index].userId)"
                  />
            </UFormField>
          </template>
          <template #roleId-cell="{ row }">
            <UFormField :name="'users.' + row.index + '.roleId'">
              <USelect 
                v-model="state.users[row.index].roleId" 
                :items="roleItems" 
                value-attribute="value" 
                option-attribute="label" 
                class="w-full" 
                variant="outline"
                @change="trackEdit(state.users[row.index].userId)"
              />
            </UFormField>
          </template>
          <template #password-cell="{ row }">
            <UFormField :name="'users.' + row.index + '.password'">
              <UInput 
                v-model="state.users[row.index].password" 
                type="password" 
                placeholder="Password" 
                class="w-full" 
                variant="outline"
                @input="trackEdit(state.users[row.index].userId)"
              />
            </UFormField>
          </template>
          <template #button-header>
            <div class="flex flex-row justify-end">
              <UButton type="submit" class="text-center justify-center" color="success" variant="solid" icon="i-lucide-save">Save</UButton>
            </div>
          </template>
          </UTable>
        </UForm>
        <div class="flex flex-row justify-end mt-2">
          <UButton @click="fetchUsers" class="w-full text-center justify-center" color="neutral" variant="solid" icon="i-lucide-plus">Add User</UButton>
        </div>
      </div>
    </div>
    <UModal v-model:open="confirmModalOpen" title="Confirm Changes" description="Review the changes before saving">
      <template #body>
        <div v-if="pendingSubmission">
          <p>Are you sure you want to save the changes to the selected users?</p>
          <p v-for="user in pendingSubmission.users" :key="user.userId" class="mt-2">
            <strong>User ID {{ user.userId }}:</strong> {{ user.username }}
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="neutral" variant="text" @click="confirmModalOpen = false">Cancel</UButton>
          <UButton color="primary" variant="solid" @click="confirmSubmit">Confirm</UButton>
        </div>
      </template>
    </UModal>
  </main>
</template>

<style scoped>
main {
  text-align: center;
  color: default;
}
</style>