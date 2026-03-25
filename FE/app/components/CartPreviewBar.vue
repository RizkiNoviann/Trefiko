<script setup lang="ts">
import { computed, ref, watch } from "vue";
import {
  Minus,
  Plus,
  ArrowRight,
  ChevronUp,
  ChevronDown,
} from "lucide-vue-next";
import { resolveImageUrl } from "~/composable/useImageUrl";
import { useCart } from "~/composable/useCart";
import { useAuth } from "~/composable/useAuth";

const config = useRuntimeConfig();
const route = useRoute();
const { isAuthenticated } = useAuth();
const {
  cartItems,
  increaseQty,
  decreaseQty,
  totalItems,
  totalPrice,
  itemNames,
  hasItems,
} = useCart();

const isExpanded = ref(false);
const isCheckoutPage = computed(() => route.path.startsWith("/menu/checkout"));

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);

// Auto-collapse when cart becomes empty
watch(hasItems, (val) => {
  if (!val) isExpanded.value = false;
});
</script>

<template>
  <Transition name="bar-slide">
    <div
      v-if="hasItems && isAuthenticated && !isCheckoutPage"
      class="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-4 pb-5 pointer-events-none"
    >
      <div
        class="w-full max-w-3xl pointer-events-auto"
        :class="isExpanded ? 'shadow-2xl' : ''"
      >
        <!-- Expanded Panel -->
        <Transition name="expand-up">
          <div
            v-if="isExpanded"
            class="rounded-t-2xl bg-white dark:bg-slate-900 border border-b-0 border-slate-200 dark:border-slate-700 overflow-hidden"
          >
            <!-- Expanded header -->
            <div
              class="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100 dark:border-slate-800"
            >
              <span
                class="text-sm font-black tracking-wide uppercase text-slate-400"
                >Pesanan Kamu</span
              >
              <button
                @click="isExpanded = false"
                class="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400"
              >
                <ChevronDown :size="16" />
              </button>
            </div>

            <!-- Items list -->
            <div
              class="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800"
            >
              <div
                v-for="item in cartItems"
                :key="item.menu.id"
                class="flex items-center gap-3 px-5 py-3"
              >
                <!-- Image -->
                <div
                  class="h-12 w-12 rounded-xl overflow-hidden shrink-0 bg-slate-100"
                >
                  <img
                    :src="
                      resolveImageUrl(item.menu.image, config.public.apiBaseUrl)
                    "
                    :alt="item.menu.title"
                    class="h-full w-full object-cover"
                  />
                </div>

                <!-- Name + temp -->
                <div class="grow min-w-0">
                  <p class="text-sm font-bold truncate leading-tight">
                    {{ item.menu.title }}
                  </p>
                  <p
                    v-if="item.temperature"
                    class="text-xs text-slate-400 capitalize"
                  >
                    {{ item.temperature }}
                  </p>
                </div>

                <!-- Price -->
                <span class="text-sm font-bold text-primary shrink-0">
                  {{ formatPrice(item.menu.price * item.quantity) }}
                </span>

                <!-- Qty controls -->
                <div
                  class="flex items-center gap-1.5 bg-primary/10 rounded-full px-1.5 py-1 shrink-0"
                >
                  <button
                    @click="decreaseQty(item.menu.id)"
                    class="h-7 w-7 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-200"
                    :title="item.quantity === 1 ? 'Hapus item' : 'Kurangi'"
                  >
                    <Minus :size="12" />
                  </button>
                  <span class="w-5 text-center text-sm font-black">{{
                    item.quantity
                  }}</span>
                  <button
                    @click="increaseQty(item.menu.id)"
                    class="h-7 w-7 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-200"
                  >
                    <Plus :size="12" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Subtotal row inside expanded -->
            <div
              class="flex items-center justify-between px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800"
            >
              <span
                class="text-xs text-slate-500 font-semibold uppercase tracking-wide"
                >Subtotal</span
              >
              <span class="font-black text-primary text-base">{{
                formatPrice(totalPrice)
              }}</span>
            </div>
          </div>
        </Transition>

        <!-- Bottom collapsed bar -->
        <div
          class="flex items-center gap-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl shadow-black/15 px-4 py-3"
          :class="isExpanded ? 'rounded-t-none border-t-0' : ''"
        >
          <!-- Stacked thumbnails + info -->
          <button
            class="flex items-center gap-3 grow min-w-0 text-left"
            @click="isExpanded = !isExpanded"
          >
            <!-- Stacked images -->
            <div
              class="relative shrink-0 h-10"
              :style="`width: ${Math.min(cartItems.length, 3) * 22 + 18}px`"
            >
              <div
                v-for="(item, idx) in cartItems.slice(0, 3)"
                :key="item.menu.id"
                class="absolute top-0 h-10 w-10 rounded-full overflow-hidden border-2 border-white dark:border-slate-900 bg-slate-100"
                :style="`left: ${idx * 22}px; z-index: ${10 - idx}`"
              >
                <img
                  :src="
                    resolveImageUrl(item.menu.image, config.public.apiBaseUrl)
                  "
                  :alt="item.menu.title"
                  class="h-full w-full object-cover"
                />
              </div>
            </div>

            <!-- Text info -->
            <div class="min-w-0">
              <p class="text-sm font-black leading-tight">
                {{ totalItems }} item{{ totalItems > 1 ? "s" : "" }} dalam
                pesanan
              </p>
              <p class="text-xs text-slate-400 truncate max-w-36 sm:max-w-64">
                {{ itemNames }}
              </p>
            </div>

            <!-- Chevron toggle -->
            <component
              :is="isExpanded ? ChevronDown : ChevronUp"
              :size="16"
              class="text-slate-400 shrink-0 ml-1"
            />
          </button>

          <!-- Total + CTA -->
          <div class="flex items-center gap-3 shrink-0">
            <div class="text-right hidden sm:block">
              <p
                class="text-xs text-slate-400 font-semibold uppercase tracking-wide"
              >
                Total
              </p>
              <p class="text-base font-black text-primary leading-tight">
                {{ formatPrice(totalPrice) }}
              </p>
            </div>
            <NuxtLink
              :to="
                cartItems.length
                  ? `/menu/checkout/${cartItems[0].menu.id}`
                  : '/menu'
              "
              class="flex items-center gap-2 bg-primary hover:bg-primary/90 text-slate-900 font-black text-sm px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-primary/30 active:scale-95 whitespace-nowrap"
            >
              Bayar
              <ArrowRight :size="15" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.bar-slide-enter-active,
.bar-slide-leave-active {
  transition:
    transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
    opacity 0.25s ease;
}
.bar-slide-enter-from,
.bar-slide-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.expand-up-enter-active,
.expand-up-leave-active {
  transition:
    max-height 0.3s ease,
    opacity 0.2s ease;
  max-height: 400px;
}
.expand-up-enter-from,
.expand-up-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
