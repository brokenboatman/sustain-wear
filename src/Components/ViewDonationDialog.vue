<script setup lang="ts">
import { reactive, ref, watch } from "vue";

const props = defineProps<{
  // props definition
  donationId: string | null;
  open: boolean;
}>();

const emit = defineEmits(["update:open"]);

const loading = ref(false);
const toast = useToast();
const images = ref<string[]>([]);

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
  status: "",
});

async function fetchDonation(id: string) {
  if (!id) return;

  loading.value = true;
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/fetch-donation?donationId=${id}`, {
      //call the api with the exact donation id so its more performant
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || res.statusText);
    }

    const json = await res.json();
    const donation = json.donation;

    if (donation) {
      state.title = donation.title || "";
      state.description = donation.description || "";
      state.quantity = donation.quantity || 1;
      state.category =
        donation.category?.category || donation.categoryId || "N/A";
      state.gender = donation.gender?.gender || donation.genderId || "N/A";
      state.size = donation.size?.size || donation.sizeId || "N/A";
      state.colour = donation.colour?.colour || donation.colourId || "N/A";
      state.material =
        donation.material?.material || donation.materialId || "N/A";
      state.condition =
        donation.condition?.condition || donation.conditionId || "N/A";
      state.status = donation.status?.status || "Unknown";

      //use a Set to prevent duplicate images
      const uniqueImages = new Set<string>();

      //add the main photoUrl if it exists
      if (donation.photoUrl) {
        uniqueImages.add(donation.photoUrl);
      }

      if (donation.images && Array.isArray(donation.images)) {
        //check if images exist and arent duoplicated
        donation.images.forEach((img: any) => {
          if (img.url) uniqueImages.add(img.url);
        });
      }

      images.value = Array.from(uniqueImages);
    }
  } catch (e: any) {
    console.error(e);
    toast.add({
      title: "Error Loading Details",
      description: e.message || "An unknown error occurred.",
      color: "error",
    });
  } finally {
    loading.value = false;
  }
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen && props.donationId) {
      fetchDonation(props.donationId);
    } else {
      // Reset state on close
      images.value = [];
      Object.assign(state, {
        title: "",
        description: "",
        quantity: 1,
        category: "",
        size: "",
        colour: "",
        material: "",
        condition: "",
        gender: "",
        status: "",
      });
    }
  }
);

// Handle closing the modal
function close() {
  emit("update:open", false);
}
</script>

<template>
  <UModal :open="open" @update:open="close" title="Donation Details">
    <template #body>
      <p class="sr-only">Detailed view of the selected donation item.</p>

      <div v-if="loading" class="p-8 text-center text-gray-500">
        Loading details...
      </div>

      <div v-else class="p-4 space-y-4">
        <UCarousel
          v-if="images.length > 0"
          arrows
          dots
          v-slot="{ item }"
          :items="images"
          class="w-full max-w-xs mx-auto mb-4"
        >
          <img :src="item" class="w-80 h-80 object-cover rounded-lg mx-auto" />
        </UCarousel>
        <div v-else class="text-center p-4 bg-gray-50 rounded-lg text-gray-500">
          No image available
        </div>

        <div class="space-y-3">
          <UFormField label="Title">
            <UInput v-model="state.title" disabled class="w-full" />
          </UFormField>

          <UFormField label="Description">
            <UTextarea
              v-model="state.description"
              :rows="2"
              disabled
              class="w-full"
              autoresize
            />
          </UFormField>

          <div class="flex gap-2">
            <UFormField label="Status" class="flex-1">
              <UInput
                v-model="state.status"
                disabled
                class="w-full font-bold"
              />
            </UFormField>
            <UFormField label="Quantity" class="w-20">
              <UInput v-model="state.quantity" disabled />
            </UFormField>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <UFormField label="Category"
              ><UInput v-model="state.category" disabled
            /></UFormField>
            <UFormField label="Gender"
              ><UInput v-model="state.gender" disabled
            /></UFormField>
            <UFormField label="Size"
              ><UInput v-model="state.size" disabled
            /></UFormField>
            <UFormField label="Colour"
              ><UInput v-model="state.colour" disabled
            /></UFormField>
            <UFormField label="Material"
              ><UInput v-model="state.material" disabled
            /></UFormField>
            <UFormField label="Condition"
              ><UInput v-model="state.condition" disabled
            /></UFormField>
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>
