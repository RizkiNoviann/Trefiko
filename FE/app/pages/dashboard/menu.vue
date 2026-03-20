<script setup lang="ts">
import { Edit3, Loader2, Plus, Star, Trash2, Upload, X } from "lucide-vue-next";
import NavAdmin from "~/components/navadmin.vue";
import Sidebar from "~/components/sidebar.vue";
import { useMenu } from "~/composable/useMenu";
import type { MenuCategory, MenuItem, MenuPayload } from "~/types/api";

definePageMeta({ layout: "dashboard" });

const runtimeConfig = useRuntimeConfig();
const activeMenu = "menu";
const { listMenus, createMenu, updateMenu, deleteMenu, uploadMenuImage } =
  useMenu();

const menus = ref<MenuItem[]>([]);
const isLoading = ref(false);
const isSubmitting = ref(false);
const formError = ref("");

const isModalOpen = ref(false);
const editingId = ref<string | null>(null);
const selectedImageFile = ref<File | null>(null);
const imagePreview = ref("");

const categoryOptions: Array<{ label: string; value: MenuCategory }> = [
  { label: "Coffee", value: "COFFEE" },
  { label: "Non Coffee", value: "NON_COFFEE" },
  { label: "Snack", value: "SNACK" },
];

const statusOptions = [
  { label: "Active", value: true },
  { label: "Hidden", value: false },
];

const form = ref<MenuPayload>({
  image: "",
  title: "",
  description: "",
  category: "COFFEE",
  price: 0,
  status: true,
  favorite: false,
});

const visibleMenus = computed(() => menus.value.filter((item) => item.status));

const toImageUrl = (imagePath: string) => {
  if (!imagePath) {
    return "";
  }

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  return `${runtimeConfig.public.apiBaseUrl}${imagePath}`;
};

const resetForm = () => {
  form.value = {
    image: "",
    title: "",
    description: "",
    category: "COFFEE",
    price: 0,
    status: true,
    favorite: false,
  };
  selectedImageFile.value = null;
  imagePreview.value = "";
  editingId.value = null;
  formError.value = "";
};

const fetchMenus = async () => {
  isLoading.value = true;

  try {
    const response = await listMenus();
    menus.value = response.menus;
  } catch (error: any) {
    formError.value = error?.message || "Gagal memuat menu";
  } finally {
    isLoading.value = false;
  }
};

const openCreateModal = () => {
  resetForm();
  isModalOpen.value = true;
};

const openEditModal = (menu: MenuItem) => {
  form.value = {
    image: menu.image,
    title: menu.title,
    description: menu.description,
    category: menu.category,
    price: menu.price,
    status: menu.status,
    favorite: menu.favorite,
  };
  selectedImageFile.value = null;
  imagePreview.value = toImageUrl(menu.image);
  editingId.value = menu.id;
  formError.value = "";
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  resetForm();
};

const onImageChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0] || null;

  if (!file) {
    return;
  }

  if (!file.type.startsWith("image/")) {
    formError.value = "File harus berupa image";
    selectedImageFile.value = null;
    imagePreview.value = "";
    return;
  }

  selectedImageFile.value = file;
  imagePreview.value = URL.createObjectURL(file);
  formError.value = "";
};

const submitForm = async () => {
  isSubmitting.value = true;
  formError.value = "";

  try {
    let imagePath = form.value.image;

    if (selectedImageFile.value) {
      const uploadResponse = await uploadMenuImage(selectedImageFile.value);
      imagePath = uploadResponse.image;
    }

    if (!imagePath) {
      throw new Error("Silakan pilih image terlebih dahulu");
    }

    const payload: MenuPayload = {
      ...form.value,
      image: imagePath,
      price: Number(form.value.price),
    };

    if (editingId.value) {
      await updateMenu(editingId.value, payload);
    } else {
      await createMenu(payload);
    }

    await fetchMenus();
    closeModal();
  } catch (error: any) {
    formError.value = error?.message || "Gagal menyimpan menu";
  } finally {
    isSubmitting.value = false;
  }
};

const removeItem = async (id: string) => {
  const confirmed = window.confirm("Hapus menu ini?");
  if (!confirmed) {
    return;
  }

  try {
    await deleteMenu(id);
    await fetchMenus();
  } catch (error: any) {
    formError.value = error?.message || "Gagal menghapus menu";
  }
};

const formatCategory = (category: MenuCategory) => {
  if (category === "NON_COFFEE") {
    return "Non Coffee";
  }

  if (category === "COFFEE") {
    return "Coffee";
  }

  return "Snack";
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
};

onMounted(fetchMenus);
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <Sidebar :activeMenu="activeMenu" />

    <main class="flex-1 flex flex-col overflow-hidden">
      <NavAdmin
        searchPlaceholder="Search menu..."
        userName="Admin Trefiko"
        userRole="Administrator"
      />

      <div class="flex-1 overflow-y-auto p-8 w-full">
        <div class="mb-6 flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-black text-slate-900 dark:text-slate-100">
              Menu Management
            </h1>
            <p class="text-sm text-slate-600 dark:text-slate-400">
              Kelola data menu dan favorit.
            </p>
          </div>
          <button
            class="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-bold text-slate-900 hover:brightness-105"
            @click="openCreateModal"
          >
            <Plus class="h-4 w-4" />
            Add Menu
          </button>
        </div>

        <p
          v-if="formError"
          class="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300"
        >
          {{ formError }}
        </p>

        <div v-if="isLoading" class="flex items-center gap-2 text-slate-500">
          <Loader2 class="h-4 w-4 animate-spin" />
          Loading menu...
        </div>

        <div
          v-else
          class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div class="overflow-x-auto">
            <table class="w-full min-w-215 text-left text-sm">
              <thead
                class="bg-slate-50 text-xs uppercase tracking-wide text-slate-600 dark:bg-slate-800/60 dark:text-slate-300"
              >
                <tr>
                  <th class="px-4 py-3">Image</th>
                  <th class="px-4 py-3">Title</th>
                  <th class="px-4 py-3">Description</th>
                  <th class="px-4 py-3">Category</th>
                  <th class="px-4 py-3">Price</th>
                  <th class="px-4 py-3">Status</th>
                  <th class="px-4 py-3">Favorite</th>
                  <th class="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody class="text-slate-700 dark:text-slate-200">
                <tr
                  v-for="item in menus"
                  :key="item.id"
                  class="border-t border-slate-100 align-top odd:bg-white even:bg-slate-50/60 dark:border-slate-800 dark:odd:bg-slate-900 dark:even:bg-slate-900/70"
                >
                  <td class="px-4 py-3">
                    <img
                      :src="toImageUrl(item.image)"
                      :alt="item.title"
                      class="h-12 w-12 rounded-lg border border-slate-200 object-cover dark:border-slate-700"
                    />
                  </td>
                  <td class="px-4 py-3 font-semibold">{{ item.title }}</td>
                  <td class="px-4 py-3 text-slate-600 dark:text-slate-400">
                    <p class="line-clamp-2 max-w-xs">{{ item.description }}</p>
                  </td>
                  <td class="px-4 py-3">{{ formatCategory(item.category) }}</td>
                  <td class="px-4 py-3 font-semibold">
                    {{ formatPrice(item.price) }}
                  </td>
                  <td class="px-4 py-3">
                    <span
                      class="rounded-full px-2.5 py-1 text-xs font-bold"
                      :class="
                        item.status
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                          : 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-300'
                      "
                    >
                      {{ item.status ? "Active" : "Hidden" }}
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <Star
                      class="h-4 w-4"
                      :class="
                        item.favorite
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300 dark:text-slate-600'
                      "
                    />
                  </td>
                  <td class="px-4 py-3">
                    <div class="flex items-center justify-end gap-2">
                      <button
                        class="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-300"
                        @click="openEditModal(item)"
                      >
                        <Edit3 class="h-4 w-4" />
                      </button>
                      <button
                        class="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-red-400 hover:text-red-500 dark:border-slate-700 dark:text-slate-300"
                        @click="removeItem(item.id)"
                      >
                        <Trash2 class="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="menus.length === 0">
                  <td colspan="8" class="px-4 py-8 text-center text-slate-500">
                    Belum ada menu.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <p class="mt-4 text-xs text-slate-600 dark:text-slate-400">
          Menu aktif: {{ visibleMenus.length }} dari {{ menus.length }}
        </p>
      </div>
    </main>

    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 overflow-y-auto"
      @click.self="closeModal"
    >
      <div
        class="w-full max-w-2xl overflow-hidden max-h-[90vh] rounded-2xl border flex flex-col border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      >
        <div
          class="flex items-start justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-700"
        >
          <div>
            <h2 class="text-xl font-black text-slate-900 dark:text-slate-100">
              {{ editingId ? "Edit Menu" : "Tambah Menu" }}
            </h2>
            <p class="text-sm text-slate-600 dark:text-slate-400">
              Upload image, isi title, description, category, price, status, dan
              favorit.
            </p>
          </div>
          <button
            class="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800"
            @click="closeModal"
          >
            <X class="h-4 w-4" />
          </button>
        </div>

        <form
          class="grid grid-cols-1 gap-4 p-6 md:grid-cols-2 overflow-y-auto"
          @submit.prevent="submitForm"
        >
          <label class="md:col-span-2">
            <span
              class="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-200"
              >Image</span
            >
            <div
              class="rounded-xl border border-dashed border-slate-300 p-4 dark:border-slate-600"
            >
              <label
                class="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-primary hover:text-primary dark:border-slate-600 dark:text-slate-200"
              >
                <Upload class="h-4 w-4" />
                Pilih Gambar
                <input
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="onImageChange"
                />
              </label>
              <p class="mt-2 text-xs text-slate-500">
                Maksimal 5MB. Format gambar apa pun.
              </p>
              <img
                v-if="imagePreview"
                :src="imagePreview"
                alt="Preview"
                class="mt-3 h-24 w-24 rounded-lg border border-slate-200 object-cover dark:border-slate-700"
              />
            </div>
          </label>

          <label class="md:col-span-2">
            <span
              class="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-200"
              >Title</span
            >
            <input
              v-model="form.title"
              required
              type="text"
              class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none focus:border-primary dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            />
          </label>

          <label class="md:col-span-2">
            <span
              class="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-200"
              >Description</span
            >
            <textarea
              v-model="form.description"
              required
              rows="3"
              class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none focus:border-primary dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            />
          </label>

          <label>
            <span
              class="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-200"
              >Category</span
            >
            <select
              v-model="form.category"
              class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none focus:border-primary dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            >
              <option
                v-for="option in categoryOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </label>

          <label>
            <span
              class="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-200"
              >Price</span
            >
            <input
              v-model.number="form.price"
              required
              min="0"
              step="500"
              type="number"
              class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none focus:border-primary dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            />
          </label>

          <label>
            <span
              class="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-200"
              >Status</span
            >
            <select
              v-model="form.status"
              class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-800 outline-none focus:border-primary dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            >
              <option
                v-for="option in statusOptions"
                :key="String(option.value)"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </label>

          <label
            class="flex items-center gap-2 pt-7 text-slate-800 dark:text-slate-100"
          >
            <input
              v-model="form.favorite"
              type="checkbox"
              class="h-4 w-4 rounded border-slate-300 text-primary"
            />
            <span class="text-sm font-semibold">Menu Favorit</span>
          </label>

          <div class="mt-2 flex items-center justify-end gap-2 md:col-span-2">
            <button
              type="button"
              class="rounded-xl border border-slate-300 px-4 py-2 font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200"
              @click="closeModal"
            >
              Batal
            </button>
            <button
              type="submit"
              class="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 font-bold text-slate-900"
              :disabled="isSubmitting"
            >
              <Loader2 v-if="isSubmitting" class="h-4 w-4 animate-spin" />
              {{
                isSubmitting
                  ? "Menyimpan..."
                  : editingId
                    ? "Update Menu"
                    : "Tambah Menu"
              }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
