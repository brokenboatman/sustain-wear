<script setup lang="ts">
import { Donation } from "@prisma/client";
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

const props = defineProps<{ donationId?: number }>();

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
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .max(255, "Description must be less than 255 characters"),
  // preprocessing to set value to 0 if input is null
  quantity: z.preprocess(
    (val) => (val === "" ? 0 : val),
    z
      .number()
      .min(1, "Quantity must be at least 1")
      .max(99, "Quantity too large")
  ),
  // Validate that the ID is provided
  category: z.preprocess(
    (val) => (val === null ? 0 : val),
    z.number().min(1, "Category is required")
  ),
  size: z.preprocess(
    (val) => (val === null ? 0 : val),
    z.number().min(1, "Size is required")
  ),
  colour: z.preprocess(
    (val) => (val === null ? 0 : val),
    z.number().min(1, "Colour is required")
  ),
  material: z.preprocess(
    (val) => (val === null ? 0 : val),
    z.number().min(1, "Material is required")
  ),
  condition: z.preprocess(
    (val) => (val === null ? 0 : val),
    z.number().min(1, "Condition is required")
  ),
  gender: z.preprocess(
    (val) => (val === null ? 0 : val),
    z.number().min(1, "Gender is required")
  ),
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
  images.value = [];
}

async function fetchDonation(donationId: number): Promise<Donation | null> {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`/api/fetch-donation?donationId=${donationId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err?.error || res.statusText);
    }

    const json = await res.json();
    const d = json.donation;

    if (!d) return null;

    return d as Donation;
  } catch (e: any) {
    console.error(e);
    throw e;
  }
}

async function handleFetchDonation(donationId: number): Promise<void> {
  loadOptions();
  try {
    const donation = await fetchDonation(donationId);
    if (donation) {
      state.title = donation.title || "";
      state.description = donation.description || "";
      state.quantity = donation.quantity || 1;
      state.category = donation.categoryId || null;
      state.gender = donation.genderId || null;
      state.size = donation.sizeId || null;
      state.colour = donation.colourId || null;
      state.material = donation.materialId || null;
      state.condition = donation.conditionId || null;
      
      images.value = [];
      if (donation.photoUrl) {
        images.value.push(donation.photoUrl);
      }

      images.value.push("ADD_BUTTON");

      isOpen.value = true;
    } else {
      console.warn("Donation not found for editing:", donationId);
    }
  } catch (e) {
    console.error("Error fetching donation for editing:", e);
  }
}

async function updateDonation(donationId: number, formData: any) {
  const token = localStorage.getItem("token");
  
  const imagesToUpload = images.value.filter(img => img !== "ADD_BUTTON");

  const payload = {
    photoUrl: imagesToUpload[0] || null,
    title: formData.title,
    description: formData.description,
    quantity: formData.quantity,
    categoryId: formData.category,
    genderId: formData.gender,
    sizeId: formData.size,
    colourId: formData.colour,
    materialId: formData.material,
    conditionId: formData.condition,
  };

  try {
    const res = await fetch(`/api/update-donation?donationId=${donationId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.error || "Failed to update donation");
    }

    toast.add({
      title: "Success:",
      description: "Donation updated successfully.",
      color: "success",
    });
    
    closeModal();
  } catch (e: any) {
    toast.add({
      title: "Error:",
      description: e.message,
      color: "error",
    });
  }
}

async function handleUpdateDonation(donationId: number, formData: any) {
  try {
    await updateDonation(donationId, formData);
  } catch (e) {
    console.error("Error updating donation:", e);
  }
}

async function onSubmit({ data: formData }) {
  if (props.donationId != null) {
    await handleUpdateDonation(props.donationId, formData);
  }
}

const isDragging = ref(false);

const images = ref([]);

function processImageFile(file) {
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = (e) => {
      images.value.splice(images.value.length - 1, 0, e.target?.result as string);
      toast.add({ title: "Image added", color: "success" });
    };
    reader.readAsDataURL(file);
  } else {
    toast.add({ title: "Please select an image file", color: "error" });
  }
}

function handleImageUpload(event) {
  const file = event.target.files[0];
  processImageFile(file);
}

function handleDragOver(event) {
  event.preventDefault();
  isDragging.value = true;
}

function handleDragLeave(event) {
  event.preventDefault();
  isDragging.value = false;
}

function handleDrop(event) {
  event.preventDefault();
  isDragging.value = false;

  const files = event.dataTransfer.files;
  if (files.length > 0) {
    processImageFile(files[0]);
  }
}

function triggerFileUpload() {
  fileInput.value.click();
}

function removeImage(index) {
  images.value.splice(index, 1);
  toast.add({
    title: "Image removed",
    color: "success",
  });
}

</script>

<template>
  <UButton
    color="neutral"
    variant="solid"
    size="xl"
    @click="handleFetchDonation(props.donationId!)"
    class="w-[100px] justify-center"
  >
    <UIcon name="i-lucide-edit" class="w-6 h-6" />
    Edit
  </UButton>

  <UModal v-model:open="isOpen" title="Add a Donation">
    <template #body>
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
          v-slot="{ item, index }"
          :items="images"
          class="w-full max-w-xs mx-auto"
        >
          <div
            v-if="item === 'ADD_BUTTON'"
            :class="[
              'w-full h-80 flex items-center justify-center rounded-lg cursor-pointer transition',
              isDragging
                ? 'bg-primary/20 border-2 border-primary border-dashed'
                : 'bg-elevated hover:bg-accented/60',
            ]"
            @dragover.prevent="handleDragOver"
            @dragleave.prevent="handleDragLeave"
            @drop.prevent="handleDrop"
            @click="triggerFileUpload"
          >
            <div class="text-center">
              <UIcon
                name="i-lucide-plus"
                class="w-12 h-12 mx-auto mb-2 text-muted"
              />
              <p class="text-sm text-toned">
                {{ isDragging ? "Drop here" : "Add Photo" }}
              </p>
              <p class="text-xs text-muted">Click or drag & drop</p>
            </div>
          </div>
          <div
            v-else
            class="relative w-full flex flex-col items-center justify-center overflow-hidden rounded-lg"
          >
            <div
              class="absolute right-2 top-2 bg-elevated/50 text-default rounded-full p-2 border border-muted/25 cursor-pointer hover:bg-error hover:text-inverted transition"
              @click="removeImage(index)"
            >
              <UIcon name="i-lucide-trash" class="w-6 h-6" />
            </div>
            <img :src="item" class="w-80 h-80 object-cover rounded-lg" />
          </div>
        </UCarousel>

        <UForm
          :schema="schema"
          :state="state"
          class="space-y-3"
          @submit="onSubmit"
        >
          <UFormField label="Title" name="title" required>
            <UInput v-model="state.title" class="w-full" />
          </UFormField>

          <UFormField label="Description" name="description">
            <UTextarea v-model="state.description" :rows="2" class="w-full" />
          </UFormField>

          <div class="flex flex-col md:flex-row gap-2">
            <UFormField label="Quantity" name="quantity" class="flex-0" required>
              <UInput
                v-model.number="state.quantity"
                type="number"
                min="1"
                class="w-full min-w-20"
              />
            </UFormField>

            <UFormField label="Category" name="category" required>
              <USelect
                v-model="state.category"
                :items="categoryOptions"
                :loading="pending"
                placeholder="Select Category"
                option-attribute="label"
                value-attribute="value"
                class="w-full min-w-[120px]"
              />
            </UFormField>
            <UFormField label="Gender" name="gender" required>
              <USelect
                v-model="state.gender"
                :items="genderOptions"
                :loading="pending"
                placeholder="Select Gender"
                option-attribute="label"
                value-attribute="value"
                class="w-full min-w-[100px]"
              />
            </UFormField>
          </div>

          <div class="flex flex-col md:flex-row gap-2">
            <UFormField label="Size" name="size" class="flex-0" required>
              <USelect
                v-model="state.size"
                :items="sizeOptions"
                :loading="pending"
                placeholder="Select Size"
                option-attribute="label"
                value-attribute="value"
                class="w-full min-w-[60px]"
              />
            </UFormField>

            <UFormField label="Colour" name="colour" required>
              <USelect
                v-model="state.colour"
                :items="colourOptions"
                :loading="pending"
                placeholder="Select Colour"
                option-attribute="label"
                value-attribute="value"
                class="w-full min-w-[120px]"
              />
            </UFormField>
            <UFormField label="Material" name="material" required>
              <USelect
                v-model="state.material"
                :items="materialOptions"
                :loading="pending"
                placeholder="Select Material"
                option-attribute="label"
                value-attribute="value"
                class="w-full min-w-[120px]"
              />
            </UFormField>
          </div>

          <div class="flex flex-col md:flex-row gap-2">
            <UFormField label="Condition" name="condition" required>
              <USelect
                v-model="state.condition"
                :items="conditionOptions"
                :loading="pending"
                placeholder="Select Condition"
                option-attribute="label"
                value-attribute="value"
                class="w-full min-w-[130px]"
              />
            </UFormField>
          </div>

          <div class="flex justify-end pt-2">
            <UButton
              icon="i-lucide-check"
              type="submit"
              color="primary"
              :loading="pending"
              :disabled="pending"
            >
              Update Details
            </UButton>
          </div>
        </UForm>
      </div>
    </template>
  </UModal>
</template>
