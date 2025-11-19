<script setup>
import { reactive, ref } from 'vue'
import * as z from 'zod'

const isOpen = ref(false)

const schema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    quantity: z.number().min(1, 'Quantity must be at least 1'),
    size: z.string().min(1, 'Size is required'),
    colour: z.string().min(1, 'Colour is required'),
    material: z.string().min(1, 'Material is required'),
    condition: z.string().min(1, 'Condition is required'),
    gender: z.string().min(1, 'Gender is required'),
})

const state = reactive({
    title: '',
    description: '',
    quantity: 1,
    size: '',
    colour: '',
    material: '',
    condition: '',
    gender: '',
})

const toast = useToast()

function closeModal() {
    isOpen.value = false
}

async function onSubmit(event) {
    toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
    console.log(event.data)
    closeModal()
}

const images = ref([
  'https://picsum.photos/468/468?random=1',
  'https://picsum.photos/468/468?random=2',
  'https://picsum.photos/468/468?random=3',
  'https://picsum.photos/468/468?random=4',
  'https://picsum.photos/468/468?random=5',
  'https://picsum.photos/468/468?random=6',
])

const fileInput = ref(null)

function handleImageUpload(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      // Insert before the last item (the add button)
      images.value.splice(images.value.length - 1, 0, e.target.result)
      toast.add({ title: 'Image added', color: 'success' })
    }
    reader.readAsDataURL(file)
  }
}

function triggerFileUpload() {
  fileInput.value.click()
}

images.value.push('ADD_BUTTON')

</script>

<template>
    <UModal 
    v-model="isOpen"
    title="Add a donation">
        <UButton label="Open" color="neutral" variant="subtle" @click="isOpen = true"/>

        <template #body>
            <input 
                ref="fileInput" 
                type="file" 
                accept="image/*" 
                class="hidden" 
                @change="handleImageUpload"
            />
            
            <UCarousel arrows dots v-slot="{ item }" :items="images" class="w-full max-w-xs mx-auto mb-4">
                <div v-if="item === 'ADD_BUTTON'" 
                     class="w-full h-80 flex items-center justify-center bg-elevated rounded-lg cursor-pointer hover:bg-accented transition"
                     @click="triggerFileUpload">
                    <div class="text-center">
                        <UIcon name="i-lucide-plus" class="w-12 h-12 mx-auto mb-2 text-muted" />
                        <p class="text-muted">Add Photo</p>
                    </div>
                </div>
                <div v-else class="w-80 h-80 flex items-center justify-center overflow-hidden rounded-lg">
                    <img :src="item" class="w-full h-full object-cover rounded-lg" />
                </div>
            </UCarousel>
            <UForm :schema="schema" :state="state" class="space-y-3" @submit="onSubmit">
                <UFormField label="Title" name="title">
                    <UInput v-model="state.title" class="w-full" />
                </UFormField>

                <UFormField label="Description" name="description">
                    <UTextarea v-model="state.description" rows="2" class="w-full" />
                </UFormField>

                <div class="flex gap-2">
                    <UFormField label="Quantity" name="quantity">
                        <UInput v-model.number="state.quantity" type="number" min="1" class="w-full" />
                    </UFormField>

                    <UFormField label="Size" name="size" class="flex-1">
                        <USelect 
                            v-model="state.size" 
                            :items="['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL']"
                            placeholder="Select"
                            class="w-24"
                        />
                    </UFormField>
                </div>

                <div class="flex gap-2">
                    <UFormField label="Colour" name="colour">
                        <USelect 
                            v-model="state.colour" 
                            :items="['Black', 'White', 'Grey', 'Navy', 'Blue', 'Red', 'Green', 'Yellow', 'Pink', 'Purple', 'Brown', 'Beige', 'Multi-color']"
                            placeholder="Select"
                            class="min-w-32"
                        />
                    </UFormField>

                    <UFormField label="Material" name="material" class="flex-1">
                        <USelect 
                            v-model="state.material"
                            :items="['Cotton', 'Polyester', 'Wool', 'Linen', 'Silk', 'Denim', 'Leather', 'Synthetic', 'Mixed']"
                            placeholder="Select"
                            class="min-w-48"
                        />
                    </UFormField>
                </div>

                <div class="flex gap-2">
                    <UFormField label="Condition" name="condition">
                        <USelect 
                            v-model="state.condition" 
                            :items="['New', 'Like New', 'Good', 'Fair', 'Worn']"
                            placeholder="Select"
                            class="min-w-32"
                        />
                    </UFormField>

                    <UFormField label="Gender" name="gender" class="flex-1">
                        <USelect 
                            v-model="state.gender" 
                            :items="['Unisex', 'Men', 'Women', 'Boys', 'Girls']"
                            placeholder="Select"
                            class="min-w-24"
                        />
                    </UFormField>
                </div>
                    <UButton icon="lucide:check" type="submit" color="primary" class="float-right">
                        Confirm
                    </UButton>
            </UForm>
        </template>
    </UModal>
</template>