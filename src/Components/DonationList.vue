<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import { ref } from 'vue'

const UBadge = resolveComponent('UBadge')

type Donation = {
  id: string
  imageRef: string
  name: string
  status: 'In transit' | 'Arrived at final depot' | 'On its way'
}

const data = ref<Donation[]>([
  {
    id: '001',
    imageRef: "[image ref here]",
    name: "T-Shirt",
    status: 'In transit',
  },
  {
    id: '002',
    imageRef: "[image ref here]",
    name: "Beige trousers",
    status: 'Arrived at final depot',
  },
  {
    id: '003',
    imageRef: "[image ref here]",
    name: "Floral dress",
    status: 'On its way',
  }
])

const columns: TableColumn<Donation>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => `#${row.getValue('id')}`,
    meta: {
      class: {
        th: 'text-left font-bold',
        td: 'text-left text-s'
      }
    },
  },
  {
    accessorKey: 'imageRef',
    header: 'Image',
    cell: ({ row }) => `${row.getValue('imageRef')}`,
    meta: {
      class: {
        th: 'text-left font-bold',
        td: 'text-left text-s'
      }
    },
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => `${row.getValue('name')}`,
    meta: {
      class: {
        th: 'text-left font-bold',
        td: 'text-left text-s'
      }
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {

      return h(UBadge, { class: 'capitalize', variant: 'subtle' }, () =>
        row.getValue('status')
      )
    },
    meta: {
      class: {
        th: 'text-right font-bold',
        td: 'text-right'
      }
    },
  }
]
</script>

<template>
  <UTable :data="data" :columns="columns" class="flex-1, color-default" />
</template>

