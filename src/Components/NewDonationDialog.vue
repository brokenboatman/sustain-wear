<script setup>
import { reactive, ref, computed, onMounted } from "vue";
import * as z from "zod";

const options = ref(null);
const pending = ref(true);
const toast = useToast();
const emit = defineEmits(["donation-added"])

const aiSuggestions = ref({
  categoryId: null,
  colourId: null,
  materialId: null,
  genderId: null,
})

async function loadOptions() {
  pending.value = true;
  try {
    const res = await fetch("/api/donation-options");

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    options.value = data;
    await console.log("Loaded donation options:", options.value);
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

async function genSelectOptions() {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/gen-select-options", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({
        description: state.description,
        options: options.value,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to generate select options");
    }

    if (data.selection) {
      aiSuggestions.value = data.selection;
      // Pre-fill select fields with AI suggestions
      state.category = aiSuggestions.value.categoryId || state.category;
      state.colour = aiSuggestions.value.colourId || state.colour;
      state.material = aiSuggestions.value.materialId || state.material;
      state.gender = aiSuggestions.value.genderId || state.gender;
    };

    toast.add({
      title: "AI Suggestions Generated",
      description: "AI has suggested options for your donation.",
      color: "success",
    });

    console.log("Generated select options:", data);
  } catch (e) {
    toast.add({
      title: "Error Generating Options",
      description: e.message || "An error occurred while generating options.",
      color: "error",
    });
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
      class: c.categoryId === aiSuggestions.value.categoryId ? "font-bold border rounded-lg border-2 border-[var(--color-ai)]" : undefined,
      icon: c.categoryId === aiSuggestions.value.categoryId ? "i-lucide-sparkles" : undefined,
    })) || []
);
const colourOptions = computed(
  () =>
    options.value?.colours.map((c) => ({
      label: c.colour,
      value: c.colourId,
      class: c.colourId === aiSuggestions.value.colourId ? "font-bold border rounded-lg border-2 border-[var(--color-ai)]" : undefined,
      icon: c.colourId === aiSuggestions.value.colourId ? "i-lucide-sparkles" : undefined,
    })) || []
);
const materialOptions = computed(
  () =>
    options.value?.materials.map((m) => ({
      label: m.material,
      value: m.materialId,
      class: m.materialId === aiSuggestions.value.materialId ? "font-bold border rounded-lg border-2 border-[var(--color-ai)]" : undefined,
      icon: m.materialId === aiSuggestions.value.materialId ? "i-lucide-sparkles" : undefined,
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
      class: g.genderId === aiSuggestions.value.genderId ? "font-bold border rounded-lg border-2 border-[var(--color-ai)]" : undefined,
      icon: g.genderId === aiSuggestions.value.genderId ? "i-lucide-sparkles" : undefined,
    })) || []
);
const sizeOptions = computed(
  () =>
    options.value?.sizes.map((s) => ({ 
      label: s.size, 
      value: s.sizeId, 
    })) || []
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
}

const genLoading = ref(false);
const submitLoading = ref(false);

async function generateDescription() {
  if (images.value.length === 0 || (images.value.length === 1 && images.value[0] === "ADD_BUTTON")) {
    toast.add({
      title: "No images available",
      description: "Please add at least one image to generate a description.",
      color: "error",
    });
    return;
  }

  genLoading.value = true;

  const imageToDescribe = images.value[0] === "ADD_BUTTON" ? images.value[1] : images.value[0];

  try {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/gen-image-description", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ image: imageToDescribe }),
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.error || "Failed to generate description");
    }
    state.description = json.description;
    toast.add({
      title: "Description Generated",
      description: "A description has been generated based on the image.",
      color: "success",
    });
    genSelectOptions();
  } catch (e) {
    toast.add({
      title: "Error:",
      description: e.message,
      color: "error",
    });
  } finally {
    genLoading.value = false;
  }
}

async function onSubmit({ data: formData }) {
  const imageRefs = images.value.filter((img) => img !== "ADD_BUTTON");
  const payload = { ...formData, images: imageRefs }; // Sends Array

  try {
    submitLoading.value = true;
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
      title: "Success!",
      description: json.statusMessage || "Donation created successfully.",
      color: "success",
    });

    // tells parent element the donation was added
    emit("donation-added")
  } catch (e) {
    toast.add({
      title: "Error:",
      description: e.message,
      color: "error",
    });
  } finally {
    closeModal();
    submitLoading.value = false;
  }
}

const isDragging = ref(false);

const images = ref([]);

function processImageFile(file) {
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = (e) => {
      images.value.splice(images.value.length - 1, 0, e.target.result);
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

const isFullscreenModal = computed(() => window.innerWidth < 640);

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

  <UModal 
  v-model:open="isOpen" 
  title="Add a Donation"
  :fullscreen="isFullscreenModal"
  >
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
          :validate-on="['submit']"
          class="space-y-3"
          @submit="onSubmit"
        >
          <UFormField label="Title" name="title" required>
            <UInput v-model="state.title" class="w-full" />
          </UFormField>
          <UAlert
            title="About AI Assistance"
            description="By clicking the generate button, you're agreeing to let AI analyze your first uploaded image to help fill in the form."
            icon="i-lucide-info"
            color="neutral"
            variant="subtle"
          >
          </UAlert>
          <UFormField label="Description" name="description">
            <UTextarea :loading="genLoading" :disabled="genLoading" v-model="state.description" :rows="2" class="w-full" autoresize />
            <UButton
              v-if="!state.description || state.description.length < 20"
              :disabled="genLoading || images.length === 1"
              size="md"
              color="neutral"
              variant="outline"
              icon="i-lucide-wand-2"
              class="absolute top-2 right-2"
              @click="generateDescription"
            >
              Generate
            </UButton>
          </UFormField>

          <div class="flex flex-col md:flex-row gap-2">
            <UFormField label="Quantity" name="quantity" class="flex-0" required>
              <UInput
                v-model.number="state.quantity"
                type="number"
                min="1"
                max="99"
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
                :ui="{
                  content: 'md:min-w-full md:w-auto',
                  itemLeadingIcon: 'text-[var(--color-ai)]'
                }"

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
                :ui="{
                  content: 'md:min-w-full md:w-auto',
                  itemLeadingIcon: 'text-[var(--color-ai)]'
                }"
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
                :ui="{
                  content: 'md:min-w-full md:w-auto',
                  itemLeadingIcon: 'text-[var(--color-ai)]'
                }"
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
                :ui="{
                  content: 'md:min-w-full md:w-auto',
                  itemLeadingIcon: 'text-[var(--color-ai)]'
                }"
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
              :loading="submitLoading"
              :disabled="submitLoading"
            >
              Confirm Donation
            </UButton>
          </div>
        </UForm>
      </div>
    </template>
  </UModal>
</template>
