<script setup lang="ts">
  const state = ({
    name: 'John Doe',
    username: 'johndoe',
    email: 'johndoe@johndoe.com',
    currentPassword: 'password',
    newPassword: '',
    confirmPassword: ''
  })
</script>

    <template>
        <div class="pt-4 flex flex-col items-center gap-6">
            <div>
                <UUser
                    name="John Doe"
                    description="Donor"
                    size="3xl"
                    :avatar="{
                    src: 'https://i.pravatar.cc/150?u=john-doe',
                    icon: 'i-lucide-image'
                    }"
                />
                <!-- come back to the line above it needs to be fixed so that we can display more of the users details -->
            </div>
            <div>
              <div class="pt-4">
                <h2 class="text-2xl mb-4">Change Account Details</h2>
                  <form class="flex flex-col gap-6 max-w-md mx-auto px-2">
                    <UInput v-model="state.name" label="Name" placeholder="Enter your name" />
                    <UInput v-model="state.username" label="Username" placeholder="Enter your username" />
                    <UInput v-model="state.email" type="email" label="Email" placeholder="Enter your email" />
                    <UInput v-model="state.currentPassword" type="password" label="Current Password" placeholder="Enter your current password" />
                    <UInput v-model="state.newPassword" type="password" label="New Password" placeholder="Enter your new password" />
                    <UInput v-model="state.confirmPassword" type="password" label="Confirm New Password" placeholder="Confirm your new password" />
                    <div>
                      <UButton color="primary" variant="solid" size="xl">Save Changes</UButton>
                    </div>
                  </form>
                </div>
            </div>
        </div>
    </template>

