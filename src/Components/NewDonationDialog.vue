<script setup>
import { reactive, ref, computed, onMounted } from "vue";
import * as z from "zod";

const options = ref(null);
const pending = ref(true);
const toast = useToast();

async function loadOptions() {
  pending.value = true;
  try {
    const res = await fetch("/api/donation-options");

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    options.value = data;
  } catch (error) {
    console.error("Failed to load donation options:", error);
    toast.add({
      title: "Error Loading Options",
      description: "Failed to fetch form options from the server.",
      color: "error",
    });
  } finally {
    pending.value = false;
  }
}

onMounted(() => {
  loadOptions();
});

const categoryOptions = computed(
  () =>
    options.value?.categories.map((c) => ({
      label: c.category,
      value: c.categoryId,
    })) || []
);
const colourOptions = computed(
  () =>
    options.value?.colours.map((c) => ({
      label: c.colour,
      value: c.colourId,
    })) || []
);
const materialOptions = computed(
  () =>
    options.value?.materials.map((m) => ({
      label: m.material,
      value: m.materialId,
    })) || []
);
const conditionOptions = computed(
  () =>
    options.value?.conditions.map((c) => ({
      label: c.condition,
      value: c.conditionId,
    })) || []
);
const genderOptions = computed(
  () =>
    options.value?.genders.map((g) => ({
      label: g.gender,
      value: g.genderId,
    })) || []
);
const sizeOptions = computed(
  () =>
    options.value?.sizes.map((s) => ({ label: s.size, value: s.sizeId })) || []
);

const isOpen = ref(false);
const fileInput = ref(null);

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  // Validate that the ID is provided
  category: z.number().min(1, "Category is required"),
  size: z.number().min(1, "Size is required"),
  colour: z.number().min(1, "Colour is required"),
  material: z.number().min(1, "Material is required"),
  condition: z.number().min(1, "Condition is required"),
  gender: z.number().min(1, "Gender is required"),
});

const state = reactive({
  title: "",
  description: "",
  quantity: 1,
  category: null,
  size: null,
  colour: null,
  material: null,
  condition: null,
  gender: null,
});

function closeModal() {
  isOpen.value = false;
  Object.assign(state, {
    title: "",
    description: "",
    quantity: 1,
    category: null,
    size: null,
    colour: null,
    material: null,
    condition: null,
    gender: null,
  });
}

async function onSubmit({ data: formData }) {
  const imageRefs = images.value.filter((img) => img !== "ADD_BUTTON");

  const payload = {
    ...formData,
    images: imageRefs,
  };

  try {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/add-donation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.statusMessage || "Failed to add donation");
    }

    toast.add({
      title: "Success! 🎉",
      description: json.statusMessage || "Donation created successfully.",
      color: "success",
    });
  } catch (e) {
    console.error("Submission Error:", e);
    toast.add({
      title: "Error 😕",
      description: e.message,
      color: "error",
    });
  } finally {
    closeModal();
  }
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

  <UModal v-model="isOpen">
    <template #header="{ close }">
      <div class="flex items-center justify-between">
        <h3 id="donation-title" class="text-xl font-semibold">
          Add a Donation
        </h3>
        <UButton
          icon="i-heroicons-x-mark-20-solid"
          color="gray"
          variant="ghost"
          aria-label="Close"
          @click="closeModal"
        />
      </div>
    </template>

    <template #default>
      <p id="donation-description" class="sr-only">
        Use this form to add details, photos, and categories for the item you
        wish to donate.
      </p>

      <div class="p-4 space-y-4">
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
          class="w-full max-w-xs mx-auto"
        >
          <div
            v-if="item === 'ADD_BUTTON'"
            class="w-full h-80 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            @click="triggerFileUpload"
          >
            <div class="text-center">
              <UIcon
                name="i-lucide-plus"
                class="w-12 h-12 mx-auto mb-2 text-gray-500"
              />
              <p class="text-sm text-gray-600 dark:text-gray-400">Add Photo</p>
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
            <UTextarea v-model="state.description" :rows="2" class="w-full" />
          </UFormField>

          <div class="grid grid-cols-3 gap-2">
            <UFormField label="Quantity" name="quantity" class="col-span-1">
              <UInput
                v-model.number="state.quantity"
                type="number"
                min="1"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Category" name="category" class="col-span-2">
              <USelect
                v-model="state.category"
                :items="categoryOptions"
                :loading="pending"
                placeholder="Select Category"
                option-attribute="label"
                value-attribute="value"
                class="w-full"
              />
            </UFormField>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <UFormField label="Size" name="size">
              <USelect
                v-model="state.size"
                :items="sizeOptions"
                :loading="pending"
                placeholder="Select Size"
                option-attribute="label"
                value-attribute="value"
              />
            </UFormField>

            <UFormField label="Colour" name="colour">
              <USelect
                v-model="state.colour"
                :items="colourOptions"
                :loading="pending"
                placeholder="Select Colour"
                option-attribute="label"
                value-attribute="value"
              />
            </UFormField>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <UFormField label="Material" name="material">
              <USelect
                v-model="state.material"
                :items="materialOptions"
                :loading="pending"
                placeholder="Select Material"
                option-attribute="label"
                value-attribute="value"
              />
            </UFormField>

            <UFormField label="Condition" name="condition">
              <USelect
                v-model="state.condition"
                :items="conditionOptions"
                :loading="pending"
                placeholder="Select Condition"
                option-attribute="label"
                value-attribute="value"
              />
            </UFormField>
          </div>

          <UFormField label="Gender" name="gender">
            <USelect
              v-model="state.gender"
              :items="genderOptions"
              :loading="pending"
              placeholder="Select Gender"
              option-attribute="label"
              value-attribute="value"
              class="w-full"
            />
          </UFormField>

          <div class="flex justify-end pt-2">
            <UButton
              icon="i-lucide-check"
              type="submit"
              color="primary"
              :loading="pending"
              :disabled="pending"
            >
              Confirm Donation
            </UButton>
          </div>
        </UForm>
      </div>
    </template>
  </UModal>
</template>
