<script setup lang="ts">
import Sidebar from "../components/Sidebar.vue";
import { ref, computed, onMounted, onUnmounted } from "vue";

interface NotificationItem {
  id: string;
  label: string;
  icon?: string;
  to?: string;
  disabled?: boolean;
  class?: string;
  click?: Function;
  // Custom fields
  type?: string;
  details?: string;
  createdAt?: string;
}

const notifications = ref<NotificationItem[]>([]);
const isLoading = ref(true);

const items = computed(() => {
  const emptyItem: NotificationItem = {
    id: "empty",
    label: "No new notifications",
    icon: "lucide:bell-off",
    disabled: true,
    class: "cursor-default text-gray-400",
  };

  const notificationList =
    notifications.value.length > 0 ? notifications.value : [emptyItem];

  const labelItem: NotificationItem = {
    id: "label",
    label: "Notifications:",
    icon: "lucide:inbox",
    type: "label",
    disabled: true,
  };

  return [[labelItem], notificationList];
});

const hasNotifications = computed(() => notifications.value.length > 0);

const expandedId = ref<string | null>(null);

const toggleExpanded = (item: any) => {
  if (item.type === "label" || item.id === "empty") return;
  expandedId.value = expandedId.value === item.id ? null : item.id;
};

const markAsRead = async (item: NotificationItem) => {
  notifications.value = notifications.value.filter((n) => n.id !== item.id);

  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    await fetch(`/api/update-notification/${item.id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
  }
};
let pollingInterval = null;

const loadNotifications = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch("/api/fetch-notifications", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const data = await res.json();

      notifications.value = data.notifications.map(
        (n: any): NotificationItem => ({
          id: n.notificationId.toString(),
          label: "New Notification",
          details: n.message,
          to: "/rewards",
          icon: "lucide:info",
          createdAt: n.createdAt,
        })
      );
    }
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadNotifications();

  pollingInterval = setInterval(() => {
    loadNotifications();
  }, 5000);
});

onUnmounted(() => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
  }
});
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
        :items="items as any" 
        :ui="{ content: 'w-screen max-w-[calc(100vw-2rem)] sm:w-96' }"
        :content="{
          collisionPadding: 16
        }"
        >
          <div class="relative">
            <UButton
              icon="line-md:bell"
              color="neutral"
              variant="ghost"
              class="cursor-pointer"
              size="xl"
            />

            <UChip
              v-if="hasNotifications"
              :text="notifications.length"
              inset
              size="xl"
              class="absolute -top 4 -right 4"
            />
          </div>

          <template #item="{ item }">
            <div
              v-if="item.type === 'label'"
              class="px-3 py-1 text-lg font-semibold text-gray-500 uppercase cursor-default"
            >
              <span class="flex items-center gap-2">
                <UIcon v-if="item.icon" :name="item.icon" class="h-6 w-6" />
                <span>{{ item.label }}</span>
              </span>
            </div>

            <div v-else class="w-full">
              <div
                v-if="item.id === 'empty'"
                class="px-3 py-4 text-center text-gray-500"
              >
                {{ item.label }}
              </div>

              <button
                v-else
                type="button"
                class="flex items-center cursor-pointer gap-2 w-full text-left rounded-md px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                @click.stop.prevent="toggleExpanded(item)"
              >
                <UIcon
                  v-if="item.icon"
                  :name="item.icon"
                  class="h-10 w-10 shrink-0 text-primary-500"
                />

                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-1 justify-between">
                    <span class="text-lg truncate font-medium">
                      {{ item.label }}
                    </span>
                    <span v-if="item.createdAt" class="text-xs text-gray-400">
                      {{ new Date(item.createdAt).toLocaleDateString() }}
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
                  name="i-heroicons-chevron-down-20-solid"
                  :class="[
                    'h-8 w-8',
                    'transition-transform',
                    expandedId === item.id ? 'rotate-180' : '',
                  ]"
                />
              </button>

              <transition name="fade">
                <div
                  v-if="expandedId === item.id"
                  class="mt-2 ml-14 text-lg text-gray-600 dark:text-gray-300 pr-2 space-y-2 pb-2"
                >
                  <p class="whitespace-pre-line">
                    {{ item.details }}
                  </p>

                  <div v-if="item.to" class="pt-1">
                    <UButton
                      :to="item.to"
                      size="md"
                      color="primary"
                      variant="soft"
                      class="w-full justify-center"
                      @click="markAsRead(item)"
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
