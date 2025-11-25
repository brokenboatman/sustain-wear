<script setup lang="ts">
import Sidebar from '../Components/Sidebar.vue';
import type { DropdownMenuItem } from '@nuxt/ui';

const items = <DropdownMenuItem[][]>([
  [
    {
      label: 'Benjamin',
      avatar: {
        src: 'https://github.com/benjamincanac.png'
      },
      type: 'label'
    }
  ],
  [
    {
      label: 'Profile',
      icon: 'i-lucide-user'
    },
    {
      label: 'Billing',
      icon: 'i-lucide-credit-card'
    },
    {
      label: 'Settings',
      icon: 'i-lucide-cog',
      kbds: [',']
    },
    {
      label: 'Keyboard shortcuts',
      icon: 'i-lucide-monitor'
    }
  ],
  [
    {
      label: 'Team',
      icon: 'i-lucide-users'
    },
    {
      label: 'Invite users',
      icon: 'i-lucide-user-plus',
      children: [
        [
          {
            label: 'Email',
            icon: 'i-lucide-mail'
          },
          {
            label: 'Message',
            icon: 'i-lucide-message-square'
          }
        ],
        [
          {
            label: 'More',
            icon: 'i-lucide-circle-plus'
          }
        ]
      ]
    },
    {
      label: 'New team',
      icon: 'i-lucide-plus',
      kbds: ['meta', 'n']
    }
  ],
  [
    {
      label: 'GitHub',
      icon: 'i-simple-icons-github',
      to: 'https://github.com/nuxt/ui',
      target: '_blank'
    },
    {
      label: 'Support',
      icon: 'i-lucide-life-buoy',
      to: '/docs/components/dropdown-menu'
    },
    {
      label: 'API',
      icon: 'i-lucide-cloud',
      disabled: true
    }
  ],
  [
    {
      label: 'Logout',
      icon: 'i-lucide-log-out',
      kbds: ['shift', 'meta', 'q']
    }
  ]
])
</script>

<template>
    <header class="border-b border-default mb-4">
        <div class="flex align-center justify-between p-4">
            <div class="flex items-center">
            <img src="@/assets/favicon.ico" alt="SustainWear Logo" class="h-8 w-8 mr-2 animate-slide-in"/>
            <h1 class="text-default text-2xl animate-slide-in font-brand">SustainWear</h1>
            </div>
            <div class="flex items-center justify-end">
                <UDropdownMenu
                    :items="items"
                    :ui="{
                    content: 'w-48'
                    }"
                >
                    <UChip inset>
                        <UButton icon="line-md:bell" color="neutral" variant="ghost" class=" cursor-pointer" size="xl" />
                    </UChip>
                </UDropdownMenu>
                <Sidebar />
            </div>
        </div>
    </header>
</template>