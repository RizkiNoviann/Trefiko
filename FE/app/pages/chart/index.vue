<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import {
  ArrowRight,
  CheckCircle2,
  Hourglass,
  PackageSearch,
  Timer,
} from "lucide-vue-next";
import { useOrder } from "~/composable/useOrder";
import type { Order, UserOrderStatus } from "~/types/api";

useSeoMeta({
  title: "Pesanan Saya | Cafe Trefiko",
});

const config = useRuntimeConfig();
const route = useRoute();
const { listMyOrders } = useOrder();

const isLoading = ref(false);
const errorMessage = ref("");
const orders = ref<Order[]>([]);
const expandedOrders = ref<Set<string>>(new Set());
const activeTab = ref<UserOrderStatus>("PENDING");

const resolveStatusFromQuery = (
  statusQuery: string | string[] | undefined,
): UserOrderStatus => {
  const raw = Array.isArray(statusQuery) ? statusQuery[0] : statusQuery;
  const normalized = (raw || "").toUpperCase();

  if (normalized === "PROCESS" || normalized === "COMPLETED") {
    return normalized;
  }

  return "PENDING";
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);

const formatDate = (value: string) => {
  return new Date(value).toLocaleString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const filteredOrders = computed(() =>
  orders.value.filter((order) => order.userStatus === activeTab.value),
);

const countByStatus = (status: UserOrderStatus) =>
  orders.value.filter((order) => order.userStatus === status).length;

const statusTitle = computed(() => {
  if (activeTab.value === "PENDING") {
    return "Pending";
  }

  if (activeTab.value === "PROCESS") {
    return "Proses";
  }

  return "Selesai";
});

const statusDescription = computed(() => {
  if (activeTab.value === "PENDING") {
    return "Pesanan menunggu konfirmasi admin.";
  }

  if (activeTab.value === "PROCESS") {
    return "Pesanan sedang diproses oleh admin.";
  }

  return "Pesanan sudah selesai.";
});

const statusCardClass = computed(() => {
  if (activeTab.value === "PENDING") {
    return "border-amber-200/60 dark:border-amber-900/40";
  }

  if (activeTab.value === "PROCESS") {
    return "border-blue-200/60 dark:border-blue-900/40";
  }

  return "border-emerald-200/60 dark:border-emerald-900/40";
});

const statusBadgeClass = computed(() => {
  if (activeTab.value === "PENDING") {
    return "text-amber-600";
  }

  if (activeTab.value === "PROCESS") {
    return "text-blue-600";
  }

  return "text-emerald-600";
});

const selectTab = (status: UserOrderStatus) => {
  activeTab.value = status;
};

const toggleOrder = (orderId: string) => {
  if (expandedOrders.value.has(orderId)) {
    expandedOrders.value.delete(orderId);
    return;
  }

  expandedOrders.value.add(orderId);
};

const isExpanded = (orderId: string) => expandedOrders.value.has(orderId);

const fetchOrders = async () => {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    const response = await listMyOrders();
    orders.value = response.orders;
  } catch (error: any) {
    errorMessage.value = error?.message || "Gagal memuat pesanan";
  } finally {
    isLoading.value = false;
  }
};

watch(
  () => route.query.status,
  (status) => {
    activeTab.value = resolveStatusFromQuery(status);
  },
  { immediate: true },
);

onMounted(fetchOrders);
</script>

<template>
  <div class="mx-auto w-full max-w-4xl px-6 py-12">
    <div class="flex flex-col gap-8">
      <div
        class="flex items-end justify-between border-b border-primary/10 pb-6"
      >
        <div>
          <h2 class="text-4xl font-black tracking-tight">Pesanan Saya</h2>
          <p
            class="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400"
          >
            Menampilkan semua status pesanan: pending, proses, dan selesai
          </p>
        </div>
        <NuxtLink
          to="/menu"
          class="flex items-center gap-2 text-sm font-semibold text-primary transition-all hover:underline"
        >
          Pesan Lagi
          <ArrowRight :size="15" />
        </NuxtLink>
      </div>

      <div v-if="isLoading" class="py-10 text-center text-slate-500">
        Memuat pesanan...
      </div>

      <div
        v-else-if="errorMessage"
        class="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300"
      >
        {{ errorMessage }}
      </div>

      <div
        v-else-if="orders.length === 0"
        class="flex flex-col items-center justify-center gap-4 py-20 text-slate-400"
      >
        <PackageSearch :size="48" class="text-primary/30" />
        <p class="text-lg font-semibold">Belum ada pesanan</p>
      </div>

      <div v-else class="space-y-4">
        <div class="mb-1 flex gap-3 overflow-x-auto">
          <button
            class="rounded-full px-4 py-2 text-sm font-bold transition"
            :class="
              activeTab === 'PENDING'
                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300'
            "
            @click="selectTab('PENDING')"
          >
            Pending ({{ countByStatus("PENDING") }})
          </button>
          <button
            class="rounded-full px-4 py-2 text-sm font-bold transition"
            :class="
              activeTab === 'PROCESS'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300'
            "
            @click="selectTab('PROCESS')"
          >
            Proses ({{ countByStatus("PROCESS") }})
          </button>
          <button
            class="rounded-full px-4 py-2 text-sm font-bold transition"
            :class="
              activeTab === 'COMPLETED'
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300'
            "
            @click="selectTab('COMPLETED')"
          >
            Selesai ({{ countByStatus("COMPLETED") }})
          </button>
        </div>

        <div
          v-if="filteredOrders.length === 0"
          class="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500 dark:border-slate-700"
        >
          Tidak ada pesanan pada kategori ini.
        </div>

        <div
          v-for="order in filteredOrders"
          :key="order.id"
          class="rounded-xl border bg-white p-4 shadow-sm dark:bg-slate-900/60"
          :class="statusCardClass"
        >
          <button
            class="flex w-full items-start justify-between gap-4 text-left"
            @click="toggleOrder(order.id)"
          >
            <div>
              <p
                class="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide"
                :class="statusBadgeClass"
              >
                <Hourglass v-if="activeTab === 'PENDING'" :size="14" />
                <Timer v-else-if="activeTab === 'PROCESS'" :size="14" />
                <CheckCircle2 v-else :size="14" />
                {{ statusTitle }}
              </p>
              <p class="text-base font-black">{{ order.code }}</p>
              <p class="text-xs text-slate-500">
                {{ formatDate(order.createdAt) }}
              </p>
            </div>
            <div class="text-right">
              <p class="text-sm font-semibold">
                {{ formatPrice(order.totalAmount) }}
              </p>
              <p class="text-xs text-slate-500">
                {{ order.items.length }} item
              </p>
            </div>
          </button>

          <p class="mt-3 text-xs text-slate-500 dark:text-slate-400">
            {{ statusDescription }}
          </p>

          <div
            v-if="isExpanded(order.id)"
            class="mt-4 space-y-2 border-t border-slate-100 pt-4 dark:border-slate-800"
          >
            <div
              v-for="item in order.items"
              :key="item.id"
              class="flex items-center justify-between gap-3"
            >
              <div class="flex min-w-0 items-center gap-3">
                <img
                  :src="`${config.public.apiBaseUrl}${item.menu.image}`"
                  :alt="item.menu.title"
                  class="h-11 w-11 rounded-lg object-cover"
                />
                <p class="truncate text-sm">
                  {{ item.quantity }}x {{ item.menu.title }}
                  <span v-if="item.temperature" class="text-slate-400"
                    >({{ item.temperature }})</span
                  >
                </p>
              </div>
              <p class="text-sm font-semibold">
                {{ formatPrice(item.lineTotal) }}
              </p>
            </div>
            <div
              v-if="order.note"
              class="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            >
              Catatan: {{ order.note }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
