<script setup lang="ts">
import Sidebar from '../Components/Sidebar.vue'
import type { DropdownMenuItem } from '@nuxt/ui'
import { ref, computed } from 'vue'

type NotificationItem = DropdownMenuItem & {
  id: string
  description?: string
  details?: string
}

const hasNotifications = computed(() =>
  items.flat().some(item => item.type !== 'label')
)

// list of notificatiosn to the user
const items = <NotificationItem[][]>([
  [
    {
      id: 'label',
      label: 'Notifications:',
      icon: 'lucide:inbox',
      type: 'label'
    }
  ],
  [
    {
      id: 'rewards',
      label: 'New Rewards Available!',
      href: '/rewards',
      icon: 'lucide:crown',
      variant: 'ghost',
      color: 'primary',
      class: 'truncate-text-none',
      details:
        'You’ve unlocked new rewards based on your latest donation and purchases. Redeem them in the SustainWear rewards hub to get discounts on future orders and exclusive drops.'
    }
  ],
  [
    {
      id: 'donation-on-the-way',
      label: 'Your Donation is on the Way!',
      href: '/rewards',
      icon: 'lucide:truck',
      variant: 'ghost',
      color: 'info',
      details:
        'Your donation has left our local collection point and is heading to our sorting centre. Once processed, it will be sent to one of our charity partners or recycling facilities.'
    }
  ],
  [
    {
      id: 'donation-received',
      label: 'Your Donation has been Received!',
      href: '/rewards',
      icon: 'lucide:check',
      variant: 'ghost',
      color: 'info',
      details:
        'Your donation has arrived safely. Thanks for helping extend the life of garments and reduce textile waste. You’ve earned extra reward points for this donation.'
    }
  ]
])

// which notification is expanded inside the dropdown
const expandedId = ref<string | null>(null)

const toggleExpanded = (item: NotificationItem) => {
  if (item.type === 'label') return
  expandedId.value = expandedId.value === item.id ? null : item.id
}
</script>

<template>
  <header class="border-b border-default mb-4">
    <div class="flex align-center justify-between p-4">
      <a href="/" class="flex items-center">
          <img
            src="@/assets/favicon.ico"
            alt="SustainWear Logo"
            class="h-8 w-8 mr-2 animate-slide-in"
          />
          <h1 class="text-default text-2xl animate-slide-in font-brand">
            SustainWear
          </h1>
      </a>

      <div class="flex items-center justify-end">
        <UDropdownMenu
          :items="items"
          :ui="{ content: 'w-110' }"
        >
          <!-- Bell -->
           <div class="relative">
             <UButton
               icon="line-md:bell"
               color="neutral"
               variant="ghost"
               class="cursor-pointer"
               size="xl"
             />

             <UChip v-if="hasNotifications" inset size="xl" class="absolute -top 4 -right 4">
             </UChip>
           </div>

          <template #item="{ item }">
            <!-- Label row -->
            <div
              v-if="item.type === 'label'"
              class="px-3 py-1 text-lg font-semibold text-gray-500 uppercase"
            >
              <span class="flex items-center gap-2">
                <UIcon v-if="item.icon" :name="item.icon" class="h-6 w-6" />
                <span>{{ item.label }}</span>
              </span>
            </div>

            <!-- Notifications -->
            <div v-else class="w-full">
              <!-- Making the whole row a button -->
              <button type="button" class="flex items-center cursor-pointer gap-2 w-full text-left rounded-md px-3 py-2"
                @click.stop.prevent="toggleExpanded(item)"
              >
                <UIcon
                  v-if="item.icon"
                  :name="item.icon"
                  class="h-10 w-10 flex-shrink-0"
                />

                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-1">
                    <span class="text-lg truncate">
                      {{ item.label }}
                    </span>
                  </div>
                  <span
                    v-if="item.details"
                    class="text-lg text-gray-500 line-clamp-1"
                  >
                    {{ item.details }}
                  </span>
                </div>
                <UIcon
                  name='i-heroicons-chevron-down-20-solid'
                  :class="[ 'h-8 w-8','transition-transform', expandedId === item.id ? 'rotate-180' : '' ]"
                />
              </button>

              <!-- Expanded content -->
              <transition name="fade">
                <div
                  v-if="expandedId === item.id"
                  class="mt-2 ml-6 text-lg text-gray-600 dark:text-gray-300 pr-1 space-y-2"
                >
                  <p class="whitespace-pre-line">
                    {{ item.details}}
                  </p>

                  <!-- link to page where notification is on -->
                  <div v-if="item.href" class="pt-1 pb-2">
                    <UButton
                      :to="item.href"
                      size="lg"
                      color="primary"
                      variant="soft"
                      class="w-full justify-center"
                      @click.stop
                    >
                      View details
                    </UButton>
                  </div>
                </div>
              </transition>
            </div>
          </template>
        </UDropdownMenu>

        <Sidebar />
      </div>
    </div>
  </header>
</template>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.15s ease, transform 0.15s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    transform: translateY(-2px);
  }
</style>
