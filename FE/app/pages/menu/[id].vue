<script setup lang="ts">
import { ref, computed } from "vue";
import { ArrowLeft, Minus, Plus, ShoppingCart } from "lucide-vue-next";
import { useMenu } from "~/composable/useMenu";
import { useCart } from "~/composable/useCart";
import { useAuth } from "~/composable/useAuth";
import type { MenuItem } from "~/types/api";

const config = useRuntimeConfig();
const route = useRoute();
const { getMenu } = useMenu();
const { addToCart, decreaseQty, cartItems } = useCart();
const { isAuthenticated } = useAuth();

const temperature = ref<"hot" | "iced">("hot");
const isLoading = ref(false);
const menu = ref<MenuItem | null>(null);

const menuId = computed(() => String(route.params.id || ""));
const showTemperature = computed(() => {
  const category = menu.value?.category;
  return category === "COFFEE" || category === "NON_COFFEE";
});

const fetchDetail = async () => {
  if (!menuId.value) return;
  isLoading.value = true;
  try {
    const response = await getMenu(menuId.value);
    menu.value = response.menu;
  } finally {
    isLoading.value = false;
  }
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);

const getItemQtyInCart = computed(() => {
  if (!menu.value) return 0;
  return (
    cartItems.value.find((i) => i.menu.id === menu.value!.id)?.quantity ?? 0
  );
});

const handleIncreaseQty = () => {
  if (!menu.value) return;

  addToCart(
    menu.value,
    1,
    showTemperature.value ? temperature.value : undefined,
  );
};

const handleDecreaseQty = () => {
  if (!menu.value) return;
  decreaseQty(menu.value.id);
};

await fetchDetail();

useSeoMeta({
  title: menu.value?.title
    ? `${menu.value.title} | Cafe Trefiko`
    : "Detail Menu | Cafe Trefiko",
});
</script>

<template>
  <div class="px-4 py-5 md:px-20">
    <div class="mx-auto flex w-full max-w-300 flex-col">
      <NuxtLink
        to="/menu"
        class="mb-4 inline-flex items-center gap-2 rounded-full p-2 text-sm font-semibold text-slate-800 transition hover:bg-primary/10 dark:text-slate-100"
      >
        <ArrowLeft :size="18" />
        Kembali ke Menu
      </NuxtLink>

      <div v-if="isLoading" class="py-20 text-center text-slate-500">
        Memuat detail menu...
      </div>

      <div v-else-if="!menu" class="py-20 text-center text-slate-500">
        Menu tidak ditemukan.
      </div>

      <div v-else>
        <img
          :src="`${config.public.apiBaseUrl}${menu.image}`"
          :alt="menu.title"
          class="h-70 w-full rounded-3xl object-cover shadow-xl md:h-105"
        />

        <div class="mt-6">
          <div class="flex items-start justify-between gap-4">
            <h1
              class="text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100"
            >
              {{ menu.title }}
            </h1>
            <!-- In-cart badge -->
            <div
              v-if="getItemQtyInCart > 0"
              class="mt-1.5 inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1.5 text-xs font-black text-primary"
            >
              <ShoppingCart :size="12" />
              {{ getItemQtyInCart }}x di keranjang
            </div>
          </div>
          <p class="mt-2 text-3xl font-black text-primary">
            {{ formatPrice(menu.price) }}
          </p>
        </div>

        <div
          class="mt-6 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/60"
        >
          <h2 class="mb-2 text-xl font-bold">Deskripsi</h2>
          <p class="leading-relaxed text-slate-600 dark:text-slate-400">
            {{ menu.description }}
          </p>
        </div>

        <div class="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <!-- Quantity -->
          <div>
            <h3 class="mb-3 text-lg font-bold">Jumlah</h3>
            <div
              class="inline-flex items-center gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-2"
            >
              <button
                class="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-900 hover:bg-primary/10 dark:bg-slate-700 dark:text-slate-100"
                @click="handleDecreaseQty"
                :disabled="getItemQtyInCart === 0"
              >
                <Minus :size="18" />
              </button>
              <span class="px-4 text-xl font-black">{{
                getItemQtyInCart
              }}</span>
              <button
                class="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-slate-900"
                @click="handleIncreaseQty"
              >
                <Plus :size="18" />
              </button>
            </div>
          </div>

          <!-- Temperature -->
          <div v-if="showTemperature">
            <h3 class="mb-3 text-lg font-bold">Suhu</h3>
            <div class="flex gap-3">
              <button
                class="flex-1 rounded-xl border-2 px-4 py-3 text-sm font-bold transition"
                :class="
                  temperature === 'hot'
                    ? 'border-primary bg-primary/10'
                    : 'border-slate-200'
                "
                @click="temperature = 'hot'"
              >
                Panas
              </button>
              <button
                class="flex-1 rounded-xl border-2 px-4 py-3 text-sm font-bold transition"
                :class="
                  temperature === 'iced'
                    ? 'border-primary bg-primary/10'
                    : 'border-slate-200'
                "
                @click="temperature = 'iced'"
              >
                Dingin
              </button>
            </div>
          </div>
        </div>

        <!-- Action buttons -->
        <div v-if="isAuthenticated" class="mt-8 pb-28">
          <!-- Buy Now -->
          <NuxtLink
            :to="`/menu/checkout/${menu.id}`"
            class="flex h-14 items-center justify-center rounded-xl bg-primary text-base font-black text-slate-900 transition hover:brightness-105 active:scale-[0.98]"
          >
            Beli Sekarang
          </NuxtLink>
        </div>

        <NuxtLink
          v-else
          to="/auth/login"
          class="mt-8 inline-flex h-14 items-center justify-center rounded-xl bg-primary/15 px-6 text-base font-bold text-slate-900 transition hover:bg-primary/25 dark:text-slate-100"
        >
          Masuk untuk pesan
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
