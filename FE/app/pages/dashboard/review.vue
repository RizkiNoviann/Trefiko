<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { Star, Trash2 } from "lucide-vue-next";
import { useReview } from "~/composable/useReview";
import type { Review } from "~/types/api";
import Sidebar from "~/components/sidebar.vue";
import NavAdmin from "~/components/navadmin.vue";

definePageMeta({ layout: "dashboard" });

const activeMenu = "review";
const { listAdminReviews, deleteReviewByAdmin } = useReview();

const isLoading = ref(false);
const errorMessage = ref("");
const reviews = ref<Review[]>([]);
const deletingReviewId = ref("");

const averageRating = computed(() => {
  if (reviews.value.length === 0) {
    return 0;
  }

  const total = reviews.value.reduce((sum, review) => sum + review.rating, 0);
  return total / reviews.value.length;
});

const getInitials = (name: string) => {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
};

const formatDate = (value: string) => {
  const parts = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).formatToParts(new Date(value));

  const day = parts.find((part) => part.type === "day")?.value ?? "";
  const month =
    parts.find((part) => part.type === "month")?.value.toLowerCase() ?? "";
  const year = parts.find((part) => part.type === "year")?.value ?? "";

  return `${day} ${month} ${year}`.trim();
};

const fetchReviews = async () => {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    const response = await listAdminReviews();
    reviews.value = response.reviews;
  } catch (error: any) {
    errorMessage.value = error?.message || "Gagal memuat review";
  } finally {
    isLoading.value = false;
  }
};

const removeReview = async (id: string) => {
  deletingReviewId.value = id;
  errorMessage.value = "";

  try {
    await deleteReviewByAdmin(id);
    reviews.value = reviews.value.filter((review) => review.id !== id);
  } catch (error: any) {
    errorMessage.value = error?.message || "Gagal menghapus review";
  } finally {
    deletingReviewId.value = "";
  }
};

onMounted(fetchReviews);
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <Sidebar :activeMenu="activeMenu" />

    <main class="flex min-w-0 flex-1 flex-col overflow-hidden">
      <NavAdmin
        searchPlaceholder="Cari ulasan..."
        userName="Admin"
        userRole="Pengelola Kafe"
      />

      <div class="flex-1 overflow-y-auto px-10 py-8">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div
            class="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
          >
            <p class="mb-1 text-sm font-medium text-slate-500">Total Ulasan</p>
            <h3 class="text-3xl font-black text-slate-900 dark:text-slate-100">
              {{ reviews.length }}
            </h3>
          </div>
          <div
            class="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
          >
            <p class="mb-1 text-sm font-medium text-slate-500">
              Rata-rata Rating
            </p>
            <div class="flex items-center gap-3">
              <h3
                class="text-3xl font-black text-slate-900 dark:text-slate-100"
              >
                {{ averageRating.toFixed(1) }}
              </h3>
              <div class="flex items-center gap-0.5 text-yellow-400">
                <Star
                  v-for="i in 5"
                  :key="i"
                  class="h-4 w-4"
                  :class="
                    i <= Math.round(averageRating)
                      ? 'fill-current'
                      : 'text-slate-300 dark:text-slate-700'
                  "
                />
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="errorMessage"
          class="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300"
        >
          {{ errorMessage }}
        </div>

        <div v-if="isLoading" class="mt-8 text-sm text-slate-500">
          Memuat review...
        </div>

        <div
          v-else-if="reviews.length === 0"
          class="mt-8 text-sm text-slate-500"
        >
          Belum ada review dari user.
        </div>

        <div v-else class="mt-8 flex flex-col gap-4">
          <div
            v-for="review in reviews"
            :key="review.id"
            class="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="flex items-center gap-4">
                <div
                  class="flex size-12 items-center justify-center rounded-full bg-primary/10 font-bold text-primary"
                >
                  {{ getInitials(review.user.name) }}
                </div>
                <div>
                  <h4 class="font-bold text-slate-900 dark:text-slate-100">
                    {{ review.user.name }}
                  </h4>
                  <p class="text-xs text-slate-500">
                    {{ formatDate(review.createdAt) }}
                  </p>
                  <p class="text-xs text-slate-400">
                    Order {{ review.order?.code || "-" }}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-0.5 text-yellow-400">
                <Star
                  v-for="i in 5"
                  :key="i"
                  class="h-4 w-4"
                  :class="
                    i <= review.rating
                      ? 'fill-current'
                      : 'text-slate-300 dark:text-slate-700'
                  "
                />
              </div>
            </div>

            <p
              class="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300"
            >
              {{ review.comment }}
            </p>

            <div
              class="mt-4 flex justify-end border-t border-slate-100 pt-3 dark:border-slate-800"
            >
              <button
                class="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                :disabled="deletingReviewId === review.id"
                @click="removeReview(review.id)"
              >
                <Trash2 class="h-4 w-4" />
                {{
                  deletingReviewId === review.id
                    ? "Menghapus..."
                    : "Hapus Review"
                }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
