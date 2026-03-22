<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { ArrowRight, PackageSearch, Trash2 } from "lucide-vue-next";
import { useOrder } from "~/composable/useOrder";
import type { Order } from "~/types/api";

useSeoMeta({
  title: "Pesanan Saya | Cafe Trefiko",
});

const config = useRuntimeConfig();
const { listMyOrders, hideMyCompletedOrder } = useOrder();

const isLoading = ref(false);
const errorMessage = ref("");
const orders = ref<Order[]>([]);
const expandedOrders = ref<Set<string>>(new Set());
const deletingOrderId = ref("");

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

const processOrders = computed(() =>
  orders.value.filter((order) => order.userStatus === "PROCESS"),
);
const doneOrders = computed(() =>
  orders.value.filter((order) => order.userStatus === "COMPLETED"),
);

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

const onHideCompletedOrder = async (orderId: string) => {
  deletingOrderId.value = orderId;
  errorMessage.value = "";

  try {
    await hideMyCompletedOrder(orderId);
    orders.value = orders.value.filter((order) => order.id !== orderId);
    expandedOrders.value.delete(orderId);
  } catch (error: any) {
    errorMessage.value = error?.message || "Gagal menghapus riwayat";
  } finally {
    deletingOrderId.value = "";
  }
};

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
            Status user: proses dan selesai
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
        <p class="text-lg font-semibold">Belum ada pesanan yang diproses</p>
      </div>

      <div v-else class="space-y-8">
        <section>
          <div class="mb-3 flex items-center justify-between">
            <h3 class="text-lg font-black">
              Sedang Diproses ({{ processOrders.length }})
            </h3>
          </div>
          <div class="space-y-3">
            <div
              v-for="order in processOrders"
              :key="order.id"
              class="rounded-xl border border-amber-200/50 bg-white p-4 shadow-sm dark:border-amber-900/40 dark:bg-slate-900/60"
            >
              <button
                class="flex w-full items-start justify-between gap-4 text-left"
                @click="toggleOrder(order.id)"
              >
                <div>
                  <p
                    class="text-xs font-bold uppercase tracking-wide text-amber-500"
                  >
                    Proses
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
        </section>

        <section>
          <div class="mb-3 flex items-center justify-between">
            <h3 class="text-lg font-black">
              Selesai ({{ doneOrders.length }})
            </h3>
          </div>
          <div class="space-y-3">
            <div
              v-for="order in doneOrders"
              :key="order.id"
              class="rounded-xl border border-emerald-200/50 bg-white p-4 shadow-sm dark:border-emerald-900/40 dark:bg-slate-900/60"
            >
              <button
                class="flex w-full items-start justify-between gap-4 text-left"
                @click="toggleOrder(order.id)"
              >
                <div>
                  <p
                    class="text-xs font-bold uppercase tracking-wide text-emerald-500"
                  >
                    Selesai
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

              <div
                class="mt-4 flex justify-end border-t border-slate-100 pt-3 dark:border-slate-800"
              >
                <button
                  class="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-60 dark:border-red-900/40 dark:hover:bg-red-900/20"
                  :disabled="deletingOrderId === order.id"
                  @click="onHideCompletedOrder(order.id)"
                >
                  <Trash2 :size="14" />
                  {{
                    deletingOrderId === order.id
                      ? "Menghapus..."
                      : "Hapus Riwayat"
                  }}
                </button>
              </div>

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
        </section>
      </div>
    </div>
  </div>
</template>
