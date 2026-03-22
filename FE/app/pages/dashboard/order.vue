<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import {
  CheckCircle2,
  Clock3,
  Package,
  RefreshCcw,
  Trash2,
} from "lucide-vue-next";
import Sidebar from "~/components/sidebar.vue";
import NavAdmin from "~/components/navadmin.vue";
import { useOrder } from "~/composable/useOrder";
import type { AdminOrderStatus, Order } from "~/types/api";

definePageMeta({ layout: "dashboard" });

const config = useRuntimeConfig();
const {
  listAdminOrders,
  acceptOrder,
  completeOrder,
  deleteCompletedOrderByAdmin,
} = useOrder();

const activeMenu = "order";
const activeTab = ref<AdminOrderStatus>("PENDING");
const orders = ref<Order[]>([]);
const isLoading = ref(false);
const actionOrderId = ref("");
const errorMessage = ref("");

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);

const formatDate = (value: string) => {
  return new Date(value).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const filteredOrders = computed(() =>
  orders.value.filter((order) => order.status === activeTab.value),
);

const countByStatus = (status: AdminOrderStatus) =>
  orders.value.filter((order) => order.status === status).length;

const fetchOrders = async () => {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    const response = await listAdminOrders();
    orders.value = response.orders;
  } catch (error: any) {
    errorMessage.value = error?.message || "Gagal memuat data order";
  } finally {
    isLoading.value = false;
  }
};

const onAccept = async (orderId: string) => {
  actionOrderId.value = orderId;
  try {
    const response = await acceptOrder(orderId);
    orders.value = orders.value.map((item) =>
      item.id === orderId ? response.order : item,
    );
  } catch (error: any) {
    errorMessage.value = error?.message || "Gagal menerima pesanan";
  } finally {
    actionOrderId.value = "";
  }
};

const onComplete = async (orderId: string) => {
  actionOrderId.value = orderId;
  try {
    const response = await completeOrder(orderId);
    orders.value = orders.value.map((item) =>
      item.id === orderId ? response.order : item,
    );
  } catch (error: any) {
    errorMessage.value = error?.message || "Gagal menyelesaikan pesanan";
  } finally {
    actionOrderId.value = "";
  }
};

const onDeleteCompleted = async (orderId: string) => {
  actionOrderId.value = orderId;
  try {
    await deleteCompletedOrderByAdmin(orderId);
    orders.value = orders.value.filter((item) => item.id !== orderId);
  } catch (error: any) {
    errorMessage.value = error?.message || "Gagal menghapus pesanan";
  } finally {
    actionOrderId.value = "";
  }
};

onMounted(fetchOrders);
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <Sidebar :activeMenu="activeMenu" />

    <main class="flex min-w-0 flex-1 flex-col overflow-hidden">
      <NavAdmin searchPlaceholder="Cari kode order atau customer" />

      <div class="flex-1 overflow-y-auto p-8">
        <div class="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 class="text-2xl font-black tracking-tight">Manajemen Order</h2>
            <p class="text-sm text-slate-500">
              Status admin: pending, proses, selesai
            </p>
          </div>
          <button
            class="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold transition hover:border-primary hover:text-primary dark:border-slate-700"
            @click="fetchOrders"
          >
            <RefreshCcw :size="16" />
            Refresh
          </button>
        </div>

        <div class="mb-6 flex gap-3 overflow-x-auto">
          <button
            class="rounded-full px-4 py-2 text-sm font-bold transition"
            :class="
              activeTab === 'PENDING'
                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300'
            "
            @click="activeTab = 'PENDING'"
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
            @click="activeTab = 'PROCESS'"
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
            @click="activeTab = 'COMPLETED'"
          >
            Selesai ({{ countByStatus("COMPLETED") }})
          </button>
        </div>

        <div
          v-if="errorMessage"
          class="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300"
        >
          {{ errorMessage }}
        </div>

        <div v-if="isLoading" class="py-14 text-center text-slate-500">
          Memuat order...
        </div>

        <div
          v-else-if="filteredOrders.length === 0"
          class="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500 dark:border-slate-700"
        >
          Tidak ada order pada status ini.
        </div>

        <div v-else class="space-y-4">
          <article
            v-for="order in filteredOrders"
            :key="order.id"
            class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div
              class="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-start"
            >
              <div>
                <p
                  class="text-xs font-bold uppercase tracking-wide text-slate-400"
                >
                  {{ order.code }}
                </p>
                <h4 class="text-lg font-black">{{ order.user.name }}</h4>
                <p class="text-sm text-slate-500">{{ order.user.email }}</p>
                <p class="mt-1 text-xs text-slate-400">
                  {{ formatDate(order.createdAt) }}
                </p>
              </div>

              <div class="text-right">
                <p class="text-xs font-semibold uppercase text-slate-400">
                  Total
                </p>
                <p class="text-xl font-black text-primary">
                  {{ formatPrice(order.totalAmount) }}
                </p>
                <p class="text-xs text-slate-400">
                  {{ order.items.length }} item • {{ order.payment }}
                </p>
              </div>
            </div>

            <div class="mb-4 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60">
              <p
                class="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400"
              >
                Items
              </p>
              <div class="space-y-2">
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
                    <p
                      class="truncate text-sm text-slate-700 dark:text-slate-200"
                    >
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
              </div>

              <div
                v-if="order.note"
                class="mt-3 rounded-lg bg-white px-3 py-2 text-xs text-slate-600 dark:bg-slate-900 dark:text-slate-300"
              >
                Catatan: {{ order.note }}
              </div>
            </div>

            <div class="flex items-center justify-end gap-2">
              <button
                v-if="order.status === 'PENDING'"
                class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-slate-900 transition hover:brightness-105 disabled:opacity-60"
                :disabled="actionOrderId === order.id"
                @click="onAccept(order.id)"
              >
                <Clock3 :size="16" />
                Terima
              </button>

              <button
                v-if="order.status === 'PROCESS'"
                class="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-600 disabled:opacity-60"
                :disabled="actionOrderId === order.id"
                @click="onComplete(order.id)"
              >
                <CheckCircle2 :size="16" />
                Selesaikan
              </button>

              <span
                v-if="order.status === 'COMPLETED'"
                class="inline-flex items-center gap-2 rounded-lg bg-emerald-100 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
              >
                <Package :size="14" />
                Selesai
              </span>

              <button
                v-if="order.status === 'COMPLETED'"
                class="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-red-600 transition hover:bg-red-50 disabled:opacity-60 dark:border-red-900/40 dark:hover:bg-red-900/20"
                :disabled="actionOrderId === order.id"
                @click="onDeleteCompleted(order.id)"
              >
                <Trash2 :size="14" />
                Hapus Permanen
              </button>
            </div>
          </article>
        </div>
      </div>
    </main>
  </div>
</template>
