<script setup>
import { reactive, ref, computed } from "vue";
import * as z from "zod";

//Call the data
const { data: options, pending } = await useFetch("/api/donation-options");

//Options helpers to just the name instead but might change to get the ID later
const categoryOptions = computed(
  () => options.value?.categories.map((c) => c.category) || []
);
const colourOptions = computed(
  () => options.value?.colours.map((c) => c.colour) || []
);
const materialOptions = computed(
  () => options.value?.materials.map((m) => m.material) || []
);
const conditionOptions = computed(
  () => options.value?.conditions.map((c) => c.condition) || []
);
const genderOptions = computed(
  () => options.value?.genders.map((g) => g.gender) || []
);
const sizeOptions = computed(
  () => options.value?.sizes.map((s) => s.size) || []
);

const isOpen = ref(false);
const toast = useToast();
const fileInput = ref(null);

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  size: z.string().min(1, "Size is required"),
  colour: z.string().min(1, "Colour is required"),
  material: z.string().min(1, "Material is required"),
  condition: z.string().min(1, "Condition is required"),
  gender: z.string().min(1, "Gender is required"),
});

const state = reactive({
  title: "",
  description: "",
  quantity: 1,
  category: "",
  size: "",
  colour: "",
  material: "",
  condition: "",
  gender: "",
});

function closeModal() {
  isOpen.value = false;
}

async function onSubmit(event) {
  toast.add({
    title: "Success",
    description: "The form has been submitted.",
    color: "success",
  });
  console.log(event.data);
  closeModal();
}

const images = ref([
  "https://picsum.photos/468/468?random=1",
  "https://picsum.photos/468/468?random=2",
  "https://picsum.photos/468/468?random=3",
  "https://picsum.photos/468/468?random=4",
  "https://picsum.photos/468/468?random=5",
  "https://picsum.photos/468/468?random=6",
]);

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      // Insert before the last item (the add button)
      images.value.splice(images.value.length - 1, 0, e.target.result);
      toast.add({ title: "Image added", color: "success" });
    };
    reader.readAsDataURL(file);
  }
}

function triggerFileUpload() {
  fileInput.value.click();
}

images.value.push("ADD_BUTTON");
</script>

<template>
  <UModal v-model="isOpen" title="Add a donation">
    <div class="w-full flex justify-end">
      <UButton
        color="neutral"
        variant="solid"
        size="xl"
        @click="isOpen = true"
        class="w-full justify-center mb-4"
      >
        <UIcon name="i-lucide-plus" class="w-6 h-6" />
        New donation
      </UButton>
    </div>

    <template #body>
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleImageUpload"
      />

      <UCarousel
        arrows
        dots
        v-slot="{ item }"
        :items="images"
        class="w-full max-w-xs mx-auto mb-4"
      >
        <div
          v-if="item === 'ADD_BUTTON'"
          class="w-full h-80 flex items-center justify-center bg-elevated rounded-lg cursor-pointer hover:bg-accented transition"
          @click="triggerFileUpload"
        >
          <div class="text-center">
            <UIcon
              name="i-lucide-plus"
              class="w-12 h-12 mx-auto mb-2 text-muted"
            />
            <p class="text-muted">Add Photo</p>
          </div>
        </div>
        <div
          v-else
          class="w-80 h-80 flex items-center justify-center overflow-hidden rounded-lg"
        >
          <img :src="item" class="w-full h-full object-cover rounded-lg" />
        </div>
      </UCarousel>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-3"
        @submit="onSubmit"
      >
        <UFormField label="Title" name="title">
          <UInput v-model="state.title" class="w-full" />
        </UFormField>

        <UFormField label="Description" name="description">
          <UTextarea v-model="state.description" rows="2" class="w-full" />
        </UFormField>

        <div class="flex gap-2">
          <UFormField label="Quantity" name="quantity">
            <UInput
              v-model.number="state.quantity"
              type="number"
              min="1"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Category" name="category" class="flex-1">
            <USelect
              v-model="state.category"
              :items="categoryOptions"
              :loading="pending"
              placeholder="Select"
              class="w-48"
            />
          </UFormField>
          <UFormField label="Size" name="size" class="flex-1">
            <USelect
              v-model="state.size"
              :items="sizeOptions"
              :loading="pending"
              placeholder="Select"
              class="w-24"
            />
          </UFormField>
        </div>

        <div class="flex gap-2">
          <UFormField label="Colour" name="colour">
            <USelect
              v-model="state.colour"
              :items="colourOptions"
              :loading="pending"
              placeholder="Select"
              class="min-w-32"
            />
          </UFormField>

          <UFormField label="Material" name="material" class="flex-1">
            <USelect
              v-model="state.material"
              :items="materialOptions"
              :loading="pending"
              placeholder="Select"
              class="min-w-48"
            />
          </UFormField>
        </div>

        <div class="flex gap-2">
          <UFormField label="Condition" name="condition">
            <USelect
              v-model="state.condition"
              :items="conditionOptions"
              :loading="pending"
              placeholder="Select"
              class="min-w-32"
            />
          </UFormField>

          <UFormField label="Gender" name="gender" class="flex-1">
            <USelect
              v-model="state.gender"
              :items="genderOptions"
              :loading="pending"
              placeholder="Select"
              class="min-w-24"
            />
          </UFormField>
        </div>
        <UButton
          icon="lucide:check"
          type="submit"
          color="primary"
          class="float-right"
        >
          Confirm
        </UButton>
      </UForm>
    </template>
  </UModal>
</template>
