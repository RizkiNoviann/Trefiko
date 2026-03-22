<script setup lang="ts">
import {
  Minus,
  Plus,
  Trash2,
  Cookie,
  Droplets,
  ArrowRight,
} from "lucide-vue-next";

useSeoMeta({
  title: "Keranjang | Cafe Trefiko",
});
</script>

<template>
  <div class="flex-grow max-w-3xl mx-auto w-full px-6 py-12">
    <div class="flex flex-col gap-8">
      <div
        class="flex items-end justify-between border-b border-primary/10 pb-6"
      >
        <h2 class="text-4xl font-black tracking-tight">Your Cart</h2>
        <p class="text-primary font-medium">2 items</p>
      </div>

      <!-- Cart Items -->
      <div class="space-y-1">
        <!-- Item 1 -->
        <div
          class="flex items-center gap-4 sm:gap-6 py-6 border-b border-primary/5 group"
        >
          <div
            class="h-20 w-20 sm:h-24 sm:w-24 rounded-xl bg-slate-200 overflow-hidden flex-shrink-0"
          >
            <img
              alt="Vanilla Oat Latte"
              class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLmPtsLpCziBGiGAnj1tM48xRzMQVrQSTJK-7Q1i_qqfBP9k_9oov1fbgdlFib7rWch20qzcvyz37Wi7Kv5zYXR3sdN82_BQASpftwfceJ2h3BsZfVfzytJVZSOdxkEJkyEgAQqJBhVpCLiiX46L2uQCe8lH4SumtxmcsOtgdyrzgMEOP0-_uOnY6a_0zghJVrEPzGEWZS0rO6vIurrgF41iYO794bYLobrz6eForvLZFb_SFAzZbLBE6uThtdCiXwdHC02eAX2xA"
            />
          </div>
          <div
            class="flex-grow flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div class="space-y-1">
              <h3 class="text-lg font-bold">Vanilla Oat Latte</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400">
                Regular • Oat Milk • Extra Hot
              </p>
              <p class="text-primary font-semibold">$5.50</p>
            </div>
            <div class="flex items-center gap-4">
              <div
                class="flex items-center bg-primary/10 rounded-full px-2 py-1"
              >
                <button
                  class="h-8 w-8 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-slate-800 transition-colors"
                >
                  <Minus :size="14" />
                </button>
                <span class="w-8 text-center font-bold">1</span>
                <button
                  class="h-8 w-8 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-slate-800 transition-colors"
                >
                  <Plus :size="14" />
                </button>
              </div>
              <button
                class="p-2 text-slate-400 hover:text-red-500 transition-colors"
              >
                <Trash2 :size="18" />
              </button>
            </div>
          </div>
        </div>

        <!-- Item 2 -->
        <div
          class="flex items-center gap-4 sm:gap-6 py-6 border-b border-primary/5 group"
        >
          <div
            class="h-20 w-20 sm:h-24 sm:w-24 rounded-xl bg-slate-200 overflow-hidden flex-shrink-0"
          >
            <img
              alt="Butter Croissant"
              class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDP9Z7CN18T08v5pRHxTfTUbrn8TWgOOkkbnQSYsHhLLDlr1I8KuigUsmpkIV4HA7_mxDlAOwG000pUt4w3CTyrVnPhP0VelgV54xhcbt5JEDuBBmVvtkYvaZzMdvxvKLQhPTwoNzkSQPBArMNmVVybCrwRSqkZRoVASHLZ4zfQc5W3NnL1y07XSZ5DAeOPb7pBtot0Yspqg8PfMcV2rC6wVJtJVCnBjrtZGDG_wSYMBfdAFfRsl2egGaPBOPMa4-yYhqYg8WzPWCM"
            />
          </div>
          <div
            class="flex-grow flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div class="space-y-1">
              <h3 class="text-lg font-bold">Butter Croissant</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400">
                Warmed • Side of Jam
              </p>
              <p class="text-primary font-semibold">$4.25</p>
            </div>
            <div class="flex items-center gap-4">
              <div
                class="flex items-center bg-primary/10 rounded-full px-2 py-1"
              >
                <button
                  class="h-8 w-8 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-slate-800 transition-colors"
                >
                  <Minus :size="14" />
                </button>
                <span class="w-8 text-center font-bold">2</span>
                <button
                  class="h-8 w-8 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-slate-800 transition-colors"
                >
                  <Plus :size="14" />
                </button>
              </div>
              <button
                class="p-2 text-slate-400 hover:text-red-500 transition-colors"
              >
                <Trash2 :size="18" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div
        class="bg-white dark:bg-slate-900/50 rounded-2xl p-8 border border-primary/10 shadow-sm"
      >
        <div class="space-y-4">
          <div class="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Subtotal</span>
            <span class="font-medium text-slate-900 dark:text-slate-100"
              >$14.00</span
            >
          </div>
          <div class="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Estimated Tax</span>
            <span class="font-medium text-slate-900 dark:text-slate-100"
              >$1.12</span
            >
          </div>
          <div
            class="pt-4 border-t border-primary/10 flex justify-between items-end"
          >
            <span class="text-xl font-bold">Total</span>
            <span class="block text-3xl font-black text-primary">$15.12</span>
          </div>
        </div>
        <div class="mt-8 flex flex-col gap-3">
          <NuxtLink
            to="/menu/checkout/1"
            class="w-full bg-primary hover:bg-primary/90 text-slate-900 font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
          >
            Checkout Now
            <ArrowRight :size="18" />
          </NuxtLink>
          <NuxtLink
            to="/menu"
            class="w-full py-4 text-sm font-semibold text-slate-500 hover:text-primary transition-colors text-center"
          >
            Continue Shopping
          </NuxtLink>
        </div>
      </div>

      <!-- Recommendations -->
      <div class="mt-8">
        <h4 class="text-lg font-bold mb-6">Add a little extra?</h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            class="flex items-center justify-between p-4 rounded-xl border border-primary/5 bg-white dark:bg-slate-900/30 hover:border-primary/30 transition-all cursor-pointer group"
          >
            <div class="flex items-center gap-3">
              <div
                class="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center"
              >
                <Cookie :size="22" class="text-primary" />
              </div>
              <div>
                <p class="font-bold text-sm">Chocolate Cookie</p>
                <p class="text-xs text-primary">+$2.50</p>
              </div>
            </div>
            <button
              class="h-8 w-8 rounded-full bg-primary/10 group-hover:bg-primary group-hover:text-slate-900 transition-colors flex items-center justify-center"
            >
              <Plus :size="16" />
            </button>
          </div>

          <div
            class="flex items-center justify-between p-4 rounded-xl border border-primary/5 bg-white dark:bg-slate-900/30 hover:border-primary/30 transition-all cursor-pointer group"
          >
            <div class="flex items-center gap-3">
              <div
                class="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center"
              >
                <Droplets :size="22" class="text-primary" />
              </div>
              <div>
                <p class="font-bold text-sm">Bottled Water</p>
                <p class="text-xs text-primary">+$1.75</p>
              </div>
            </div>
            <button
              class="h-8 w-8 rounded-full bg-primary/10 group-hover:bg-primary group-hover:text-slate-900 transition-colors flex items-center justify-center"
            >
              <Plus :size="16" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
