<script setup lang="ts">
const items = [
  {
    label: 'Account Details',
    icon: 'i-lucide-user',
    slot: 'accountDetails'
  },
  {
    label: 'Change Details',
    icon: 'lucide:circle-plus',
    slot: 'changeDetails'
  }
]

const state = ({
  name: 'John Doe',
  username: 'johndoe',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})
</script>

<template>
  <UTabs color="neutral" :items="items">
    <template #accountDetails>
        <div class="pt-4 flex flex-col items-center gap-6">
            <div>
                <UUser
                    name="John Doe"
                    description="Software Engineer"
                    size="3xl"
                    :avatar="{
                    src: 'https://i.pravatar.cc/150?u=john-doe',
                    icon: 'i-lucide-image'
                    }"
                />
            </div>
            <div>
                
            </div>
        </div>
    </template>
    <!-- splitting up the two tabs -->
    <template #changeDetails>
      <div class="pt-4">
        <h2 class="text-2xl mb-4">Change Account Details</h2>
        <form class="flex flex-col gap-6 max-w-md mx-auto px-2">
          <UInput v-model="state.name" label="Name" placeholder="Enter your name" />
          <UInput v-model="state.username" label="Username" placeholder="Enter your username" />
          <UInput v-model="state.currentPassword" type="password" label="Current Password" placeholder="Enter your current password" />
          <UInput v-model="state.newPassword" type="password" label="New Password" placeholder="Enter your new password" />
          <UInput v-model="state.confirmPassword" type="password" label="Confirm New Password" placeholder="Confirm your new password" />
          <div>
              <UButton color="primary" variant="solid" size="xl">Save Changes</UButton>
          </div>
        </form>
      </div>
    </template>
  </UTabs>
</template>

