<script setup lang="ts">

import { reactive, ref, computed } from "vue";
import { h, onMounted, resolveComponent } from "vue";
import type { TableColumn } from '@nuxt/ui'

import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const UBadge = resolveComponent('UBadge')

const loading = ref(false);
const error = ref<string | null>(null);

type User = {
  isAddButton?: boolean;
  isNew?: boolean;
  isEdited?: boolean;
  isMarkedDeleted?: boolean;
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

const pendingUsersToUpdate = ref<User[] | null>(null);
const pendingUsersToCreate = ref<User[] | null>(null);
const pendingUsersToDelete = ref<number[]>([]);

const nextUserId = computed(() => {
  if (state.users.length === 0) return 1;
  return Math.max(...state.users.map(u => u.userId)) + 1;
});

const columns = [
  {
    id: "userId",
    header: "ID",
  },
  {
    id: "username",
    header: "Username",
  },
  {
    id: 'roleId',
    header: 'Role',
  },
  { id: "email", header: "Email" },
  { id: "password", header: "Password" },
  { id: "delete-add-user" }
];

// placeholder for adding new user
const addUserPlaceholder = {
  isAddButton: true,
  isNew: false,
  isEdited: false,
  isMarkedDeleted: false,
  userId: -1,
  username: '',
  email: '',
  password: '',
  roleId: 0,
  profileURL: ''
};

const tableData = computed(() => {
  return [...state.users, addUserPlaceholder];
});

function createUser() {
  state.users.push({
    isAddButton: false,
    isNew: true,
    isEdited: true,
    isMarkedDeleted: false,
    userId: nextUserId.value,
    username: '',
    email: '',
    password: '',
    roleId: 1,
    profileURL: ''
  });
}

const deleteModalOpen = ref(false);
const userToDelete = ref<number | null>(null);

async function openDeleteModal(userId: number) {
  userToDelete.value = userId;
  deleteModalOpen.value = true;
}

async function deleteUser() {
  const token = localStorage.getItem("token");
  loading.value = true;
  error.value = null;

  try {
    // delete user
    if (userToDelete.value !== null) {
      const resDelete = await fetch(`/api/delete-users`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ userIds: [userToDelete.value] }),
      });

      const jsonDelete = await resDelete.json();

      if (!resDelete.ok) {
        throw new Error(jsonDelete.error || "Failed to delete user");
      }
    }

    toast.add({
      title: "Success:",
      description: "User deleted successfully.",
      color: "success",
    });

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
    deleteModalOpen.value = false;
    userToDelete.value = null;
  }
}

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
  password: z.string().min(8, 'Password must be at least 8 characters long').or(z.literal('')), // no password change if left empty
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

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const usersToUpdate = state.users.filter(user => user.isEdited && !user.isNew).map(user => {
    const updatedUser: any = {
      userId: user.userId,
      username: user.username,
      email: user.email,
      roleId: user.roleId,
    };
    if (user.password && user.password.trim() !== '') {
      updatedUser.password = user.password;
    }
    return updatedUser;
  });

  const usersToCreate = state.users.filter(user => user.isNew).map(user => {
    const newUser: any = {
      username: user.username,
      email: user.email,
      roleId: user.roleId,
    };
    if (user.password && user.password.trim() !== '') {
      newUser.password = user.password;
    }
    return newUser;
  });

  const usersToDelete = state.users.filter(user => user.isMarkedDeleted).map(user => user.userId);

  console.log('Users to update:', usersToUpdate);
  console.log('Users to create:', usersToCreate);
  console.log('Users to delete:', usersToDelete);

  if (usersToUpdate.length === 0 && usersToCreate.length === 0 && usersToDelete.length === 0) {
    toast.add({
      title: "Info:",
      description: "No changes to save.",
      color: "info",
    });
    loading.value = false;
    return;
  }
  pendingUsersToUpdate.value = usersToUpdate;
  pendingUsersToCreate.value = usersToCreate;
  pendingUsersToDelete.value = usersToDelete;
  confirmModalOpen.value = true;
}

async function confirmSubmit() {
  loading.value = true;
  error.value = null;
  confirmModalOpen.value = false;
  try {
    const token = localStorage.getItem("token");

    // update existing users
    if (pendingUsersToUpdate.value.length > 0) {
      const resUpdate = await fetch(`/api/update-users`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ users: pendingUsersToUpdate.value }),
      });

      const jsonUpdate = await resUpdate.json();

      if (!resUpdate.ok) {
        throw new Error(jsonUpdate.error || "Failed to update user info");
      }
    }

    // create new users
    if (pendingUsersToCreate.value.length > 0) {
      const resCreate = await fetch(`/api/create-users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ users: pendingUsersToCreate.value }),
      });

      const jsonCreate = await resCreate.json();

      if (!resCreate.ok) {
        throw new Error(jsonCreate.error || "Failed to create new users");
      }
    }

    // delete users
    if (pendingUsersToDelete.value.length > 0) {
      const resDelete = await fetch(`/api/delete-users`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ userIds: pendingUsersToDelete.value }),
      });

      const jsonDelete = await resDelete.json();

      if (!resDelete.ok) {
        throw new Error(jsonDelete.error || "Failed to delete users");
      }
    }

    toast.add({
      title: "Success:",
      description: "User information updated successfully.",
      color: "success",
    });

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
    pendingUsersToUpdate.value = null;
    pendingUsersToCreate.value = null;
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
          <UTable sticky :loading="loading" loading-color="primary" :data="tableData" :columns="columns"
            class="border border-accented rounded-lg text-left z-0">
            <template #userId-cell="{ row }">
              <div v-if="!row.original?.isAddButton">
                <span v-if="row.original?.isEdited" class="text-error font-bold">*</span>
                <span class="font-bold" :class="row.original?.isNew ? 'text-error' : 'text-default'">{{
                  row.original?.userId }}</span>
              </div>
            </template>
            <template #username-cell="{ row }">
              <div v-if="!row.original?.isAddButton">
                <UFormField :name="'users.' + row.index + '.username'">
                  <UInput v-model="row.original.username" placeholder="Username" class="min-w-[160px] md:w-full" variant="subtle"
                    @input="row.original.isEdited = true" />
                </UFormField>
              </div>
            </template>
            <template #email-cell="{ row }">
              <div v-if="!row.original?.isAddButton">
                <UFormField :name="'users.' + row.index + '.email'">
                  <UInput v-model="row.original.email" placeholder="Email" class="min-w-[200px] md:w-full" variant="subtle"
                    @input="row.original.isEdited = true" />
                </UFormField>
              </div>
            </template>
            <template #roleId-cell="{ row }">
              <div v-if="!row.original?.isAddButton">
                <UFormField :name="'users.' + row.index + '.roleId'">
                  <USelect v-model="row.original.roleId" :items="roleItems" value-attribute="value"
                    option-attribute="label" class="w-full" variant="outline" @change="row.original.isEdited = true" />
                </UFormField>
              </div>
            </template>
            <template #password-cell="{ row }">
              <div v-if="!row.original?.isAddButton">
                <UFormField :name="'users.' + row.index + '.password'">
                  <UInput v-model="row.original.password" type="password" placeholder="Enter new password"
                    class="min-w-[152px] md:w-full" variant="outline" @input="row.original.isEdited = true" />
                </UFormField>
              </div>
            </template>
            <template #delete-add-user-cell="{ row }">
              <div v-if="!row.original?.isAddButton" class="text-right">
                <UButton variant="ghost" size="md"
                  class="justify-center rounded-full p-2 border border-muted text-muted hover:bg-error/75 hover:text-inverted hover:border-error transition-colors duration-200"
                  @click="openDeleteModal(row.original.userId)">
                  <UIcon name="i-lucide-trash" class="w-5 h-5" />
                </UButton>
              </div>
              <div v-else>
                <div class="flex flex-row justify-end">
                  <UButton @click="createUser" class="text-center justify-center" color="neutral" variant="solid"
                    icon="i-lucide-plus">Add User</UButton>
                </div>
              </div>
            </template>
            <template #delete-add-user-header>
              <div class="flex flex-row justify-end">
                <UButton type="submit" class="text-center justify-center" color="success" variant="solid"
                  icon="i-lucide-save">Save</UButton>
              </div>
            </template>
          </UTable>
        </UForm>

      </div>
    </div>
    <UModal v-model:open="confirmModalOpen" title="Confirm Changes" description="Review the changes before saving">
      <template #body>
        <div v-if="pendingUsersToUpdate || pendingUsersToCreate">
          <p>Are you sure you want to save the changes to the selected users?</p>
          <p v-for="user in pendingUsersToUpdate" :key="user.userId" class="mt-2">
            <strong>User ID {{ user.userId }}:</strong> {{ user.username }}
          </p>
          <p v-for="user in pendingUsersToCreate" :key="user.username" class="mt-2">
            <strong>New User:</strong> {{ user.username }}
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
    <UModal v-model:open="deleteModalOpen" title="Confirm Deletion">
      <template #body>
        <p>Are you sure you want to delete this user?</p>
        <br></br>
        <p>This will permanently delete the user and all associated data.</p>
      </template>
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton color="neutral" variant="text" @click="deleteModalOpen = false">Cancel</UButton>
          <UButton color="error" variant="solid" @click="deleteUser">Delete</UButton>
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