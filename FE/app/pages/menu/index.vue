<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Coffee, CupSoda, Heart, Minus, Plus, Sandwich } from "lucide-vue-next";
import { useMenu } from "~/composable/useMenu";
import { useCart } from "~/composable/useCart";
import { useAuth } from "~/composable/useAuth";
import type { MenuCategory, MenuItem } from "~/types/api";

useSeoMeta({
  title: "Menu | Cafe Trefiko",
});

const config = useRuntimeConfig();
const { listMenus } = useMenu();
const { addToCart, decreaseQty, cartItems } = useCart();
const { isAuthenticated } = useAuth();

const menus = ref<MenuItem[]>([]);
const isLoading = ref(false);

const fetchMenus = async () => {
  isLoading.value = true;
  try {
    const response = await listMenus();
    menus.value = response.menus.filter((item) => item.status);
  } finally {
    isLoading.value = false;
  }
};

const activeSection = ref("favorite");
const currentSection = computed(() =>
  sections.value.find((s) => s.id === activeSection.value),
);

const byCategory = (category: MenuCategory) =>
  menus.value.filter((item) => item.category === category);

const favoriteMenus = computed(() =>
  menus.value.filter((item) => item.favorite),
);
const coffeeMenus = computed(() => byCategory("COFFEE"));
const nonCoffeeMenus = computed(() => byCategory("NON_COFFEE"));
const snackMenus = computed(() => byCategory("SNACK"));

const sections = computed(() => [
  { id: "favorite", title: "Favorit", icon: Heart, items: favoriteMenus.value },
  { id: "coffee", title: "Coffee", icon: Coffee, items: coffeeMenus.value },
  {
    id: "non-coffee",
    title: "Non Coffee",
    icon: CupSoda,
    items: nonCoffeeMenus.value,
  },
  { id: "snack", title: "Snack", icon: Sandwich, items: snackMenus.value },
]);

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);

const handleIncreaseQty = (item: MenuItem) => {
  addToCart(item, 1);
};

const handleDecreaseQty = (item: MenuItem) => {
  decreaseQty(item.id);
};

const getItemQty = (itemId: string | number) => {
  return cartItems.value.find((i) => i.menu.id === itemId)?.quantity ?? 0;
};

onMounted(fetchMenus);
</script>

<template>
  <div class="flex flex-col items-center">
    <div class="flex w-full max-w-300 flex-col px-6 py-10 lg:px-20">
      <!-- Page header -->
      <div class="mb-10 flex flex-col gap-3">
        <h1 class="text-4xl font-black tracking-tight lg:text-5xl">
          Menu Kami
        </h1>
        <p class="max-w-2xl text-lg text-slate-600 dark:text-slate-400">
          Pilih menu favorit kamu, mulai dari coffee sampai snack.
        </p>
      </div>

      <!-- Category tabs -->
      <div
        class="sticky top-14 z-30 mb-8 bg-background-light py-3 dark:bg-background-dark"
      >
        <div
          class="flex gap-7 overflow-x-auto border-b border-slate-200 no-scrollbar dark:border-slate-800"
        >
          <button
            v-for="section in sections"
            :key="section.id"
            @click="activeSection = section.id"
            class="shrink-0 border-b-[3px] pb-3 text-sm font-bold transition"
            :class="
              activeSection === section.id
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500'
            "
          >
            {{ section.title }}
          </button>
        </div>
      </div>

      <div v-if="isLoading" class="py-20 text-center text-slate-500">
        Loading menu...
      </div>

      <!-- Menu items grid -->
      <section v-if="currentSection" class="mb-14">
        <div class="mb-6 flex items-center gap-3">
          <component :is="currentSection.icon" class="h-6 w-6 text-primary" />
          <h2 class="text-2xl font-black">{{ currentSection.title }}</h2>
        </div>

        <div
          v-if="currentSection.items.length === 0"
          class="rounded-xl border border-dashed border-slate-300 p-6 text-sm text-slate-500"
        >
          Belum ada menu pada kategori ini.
        </div>

        <div v-else class="grid grid-cols-1 gap-5 md:grid-cols-2">
          <article
            v-for="item in currentSection.items"
            :key="item.id"
            class="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/50"
          >
            <img
              :src="`${config.public.apiBaseUrl}${item.image}`"
              :alt="item.title"
              class="h-24 w-24 shrink-0 rounded-xl object-cover"
            />

            <div class="flex flex-1 flex-col justify-between min-w-0">
              <div>
                <div class="mb-1 flex items-start justify-between gap-2">
                  <h3 class="text-lg font-bold leading-tight">
                    {{ item.title }}
                  </h3>
                  <span
                    class="whitespace-nowrap text-sm font-black text-primary"
                  >
                    {{ formatPrice(item.price) }}
                  </span>
                </div>
                <p
                  class="line-clamp-2 text-sm text-slate-500 dark:text-slate-400"
                >
                  {{ item.description }}
                </p>
              </div>

              <div class="mt-3 flex items-center gap-3">
                <div
                  v-if="isAuthenticated"
                  class="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-2 py-1"
                >
                  <button
                    class="flex h-7 w-7 items-center justify-center rounded-full bg-white text-slate-700 transition hover:bg-primary/10"
                    @click="handleDecreaseQty(item)"
                    :disabled="getItemQty(item.id) === 0"
                  >
                    <Minus :size="14" />
                  </button>
                  <span class="w-6 text-center text-sm font-black">
                    {{ getItemQty(item.id) }}
                  </span>
                  <button
                    class="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-slate-900 transition hover:brightness-105"
                    @click="handleIncreaseQty(item)"
                  >
                    <Plus :size="14" />
                  </button>
                </div>

                <NuxtLink
                  v-else
                  to="/auth/login"
                  class="inline-flex items-center gap-1.5 text-xs font-bold tracking-wide text-slate-500 transition hover:text-primary"
                >
                  Login untuk order
                </NuxtLink>

                <NuxtLink
                  :to="`/menu/${item.id}`"
                  class="inline-flex items-center rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-300"
                >
                  See Detail
                </NuxtLink>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  </div>
</template>
