<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import {
  Clock3,
  CupSoda,
  MessageSquareText,
  RefreshCcw,
  ShoppingBag,
  Timer,
} from "lucide-vue-next";
import Sidebar from "~/components/sidebar.vue";
import NavAdmin from "~/components/navadmin.vue";
import { useMenu } from "~/composable/useMenu";
import { useOrder } from "~/composable/useOrder";
import { useReview } from "~/composable/useReview";
import type { Order, Review } from "~/types/api";

definePageMeta({ layout: "dashboard" });

const activeMenu = "dashboard";
const isLoading = ref(false);
const errorMessage = ref("");

const orders = ref<Order[]>([]);
const reviews = ref<Review[]>([]);
const totalMenus = ref(0);

const { listAdminOrders } = useOrder();
const { listAdminReviews } = useReview();
const { listMenus } = useMenu();

const pendingCount = computed(
  () => orders.value.filter((order) => order.status === "PENDING").length,
);
const processCount = computed(
  () => orders.value.filter((order) => order.status === "PROCESS").length,
);
const completedCount = computed(
  () => orders.value.filter((order) => order.status === "COMPLETED").length,
);

const averageRating = computed(() => {
  if (!reviews.value.length) {
    return 0;
  }

  const total = reviews.value.reduce((sum, review) => sum + review.rating, 0);
  return total / reviews.value.length;
});

const latestOrders = computed(() => orders.value.slice(0, 5));

const mapOrderStatusLabel = (status: string) => {
  if (status === "PENDING") {
    return "Pending";
  }

  if (status === "PROCESS") {
    return "Diproses";
  }

  return "Selesai";
};

const formatDate = (value: string) => {
  return new Date(value).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const fetchDashboardData = async () => {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    const [ordersResponse, reviewsResponse, menusResponse] = await Promise.all([
      listAdminOrders(),
      listAdminReviews(),
      listMenus(),
    ]);

    orders.value = ordersResponse.orders;
    reviews.value = reviewsResponse.reviews;
    totalMenus.value = menusResponse.menus.length;
  } catch (error: any) {
    errorMessage.value = error?.message || "Gagal memuat data dashboard";
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchDashboardData);
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <Sidebar :activeMenu="activeMenu" />

    <main class="flex min-w-0 flex-1 flex-col overflow-hidden">
      <NavAdmin />

      <div class="flex-1 overflow-y-auto p-8">
        <div class="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 class="text-2xl font-black tracking-tight">Dasbor Admin</h2>
            <p class="text-sm text-slate-500">
              Ringkasan data sesuai fitur yang aktif
            </p>
          </div>
          <button
            class="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold transition hover:border-primary hover:text-primary dark:border-slate-700"
            @click="fetchDashboardData"
          >
            <RefreshCcw :size="16" />
            Muat Ulang
          </button>
        </div>

        <div
          v-if="errorMessage"
          class="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300"
        >
          {{ errorMessage }}
        </div>

        <div v-if="isLoading" class="py-14 text-center text-slate-500">
          Memuat dashboard...
        </div>

        <template v-else>
          <section class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <article
              class="rounded-xl border border-amber-200/50 bg-white p-5 shadow-sm dark:border-amber-900/40 dark:bg-slate-900"
            >
              <div
                class="mb-2 inline-flex rounded-lg bg-amber-100 p-2 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300"
              >
                <Clock3 :size="18" />
              </div>
              <p class="text-sm text-slate-500">Pesanan Pending</p>
              <p class="text-3xl font-black">{{ pendingCount }}</p>
            </article>

            <article
              class="rounded-xl border border-blue-200/50 bg-white p-5 shadow-sm dark:border-blue-900/40 dark:bg-slate-900"
            >
              <div
                class="mb-2 inline-flex rounded-lg bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300"
              >
                <Timer :size="18" />
              </div>
              <p class="text-sm text-slate-500">Pesanan Diproses</p>
              <p class="text-3xl font-black">{{ processCount }}</p>
            </article>

            <article
              class="rounded-xl border border-emerald-200/50 bg-white p-5 shadow-sm dark:border-emerald-900/40 dark:bg-slate-900"
            >
              <div
                class="mb-2 inline-flex rounded-lg bg-emerald-100 p-2 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300"
              >
                <ShoppingBag :size="18" />
              </div>
              <p class="text-sm text-slate-500">Pesanan Selesai</p>
              <p class="text-3xl font-black">{{ completedCount }}</p>
            </article>

            <article
              class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div
                class="mb-2 inline-flex rounded-lg bg-primary/20 p-2 text-primary"
              >
                <CupSoda :size="18" />
              </div>
              <p class="text-sm text-slate-500">Total Menu</p>
              <p class="text-3xl font-black">{{ totalMenus }}</p>
            </article>

            <article
              class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div
                class="mb-2 inline-flex rounded-lg bg-primary/20 p-2 text-primary"
              >
                <MessageSquareText :size="18" />
              </div>
              <p class="text-sm text-slate-500">Total Ulasan</p>
              <p class="text-3xl font-black">{{ reviews.length }}</p>
            </article>

            <article
              class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div
                class="mb-2 inline-flex rounded-lg bg-primary/20 p-2 text-primary"
              >
                <MessageSquareText :size="18" />
              </div>
              <p class="text-sm text-slate-500">Rata-Rata Rating</p>
              <p class="text-3xl font-black">{{ averageRating.toFixed(1) }}</p>
            </article>
          </section>

          <section
            class="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <h3 class="mb-4 text-lg font-black">Pesanan Terbaru</h3>

            <div
              v-if="latestOrders.length === 0"
              class="text-sm text-slate-500"
            >
              Belum ada order.
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="order in latestOrders"
                :key="order.id"
                class="flex items-center justify-between rounded-lg border border-slate-100 px-4 py-3 dark:border-slate-800"
              >
                <div>
                  <p class="text-sm font-bold">{{ order.code }}</p>
                  <p class="text-xs text-slate-500">
                    {{ order.user.name }} • {{ formatDate(order.createdAt) }}
                  </p>
                </div>
                <span
                  class="rounded-full px-2.5 py-1 text-xs font-bold"
                  :class="
                    order.status === 'PENDING'
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                      : order.status === 'PROCESS'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                  "
                >
                  {{ mapOrderStatusLabel(order.status) }}
                </span>
              </div>
            </div>
          </section>
        </template>
      </div>
    </main>
  </div>
</template>
