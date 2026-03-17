<script setup lang="ts">
import {
  ArrowLeft,
  CreditCard,
  CheckCircle2,
  Circle,
  ArrowRight,
} from "lucide-vue-next";

useSeoMeta({
  title: "Checkout | Cafe Trefiko",
});

const selectedPayment = ref("now");
</script>

<template>
  <div class="flex-1 max-w-[1280px] mx-auto w-full px-6 lg:px-40 py-8">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Left Column: Checkout Details -->
      <div class="lg:col-span-2 space-y-6">
        <div class="flex items-center gap-2 mb-2">
          <NuxtLink
            to="/chart"
            class="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <ArrowLeft :size="20" />
          </NuxtLink>
          <h1 class="text-3xl font-bold tracking-tight">Checkout</h1>
        </div>

        <!-- Payment Method -->
        <div
          class="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-primary/10 dark:border-primary/5"
        >
          <div class="flex items-center gap-3 mb-4">
            <CreditCard :size="22" class="text-primary" />
            <h3 class="text-lg font-bold">Payment Method</h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Pay Now -->
            <label
              class="relative flex cursor-pointer rounded-xl border-2 p-4 transition-all"
              :class="
                selectedPayment === 'now'
                  ? 'border-primary bg-primary/5'
                  : 'border-slate-200 dark:border-slate-700 hover:border-primary/40'
              "
            >
              <input
                v-model="selectedPayment"
                class="sr-only"
                name="payment-option"
                type="radio"
                value="now"
              />
              <span class="flex flex-1">
                <span class="flex flex-col">
                  <span
                    class="block text-sm font-bold text-slate-900 dark:text-slate-100"
                    >Bayar Langsung</span
                  >
                  <span
                    class="mt-1 flex items-center text-xs text-slate-500 dark:text-slate-400"
                  >
                    E-Wallet, Credit Card, Virtual Account
                  </span>
                </span>
              </span>
              <CheckCircle2
                :size="20"
                :class="
                  selectedPayment === 'now'
                    ? 'text-primary'
                    : 'text-slate-300 dark:text-slate-600'
                "
              />
            </label>

            <!-- Cash on Delivery -->
            <label
              class="relative flex cursor-pointer rounded-xl border-2 p-4 transition-all"
              :class="
                selectedPayment === 'cod'
                  ? 'border-primary bg-primary/5'
                  : 'border-slate-200 dark:border-slate-700 hover:border-primary/40'
              "
            >
              <input
                v-model="selectedPayment"
                class="sr-only"
                name="payment-option"
                type="radio"
                value="cod"
              />
              <span class="flex flex-1">
                <span class="flex flex-col">
                  <span
                    class="block text-sm font-bold text-slate-900 dark:text-slate-100"
                    >Bayar di Tempat</span
                  >
                  <span
                    class="mt-1 flex items-center text-xs text-slate-500 dark:text-slate-400"
                  >
                    Cash on Delivery (COD)
                  </span>
                </span>
              </span>
              <CheckCircle2
                :size="20"
                :class="
                  selectedPayment === 'cod'
                    ? 'text-primary'
                    : 'text-slate-300 dark:text-slate-600'
                "
              />
            </label>
          </div>
        </div>
      </div>

      <!-- Right Column: Order Summary -->
      <div class="lg:col-span-1">
        <div
          class="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-md border border-primary/10 dark:border-primary/5 sticky top-24"
        >
          <h3 class="text-xl font-bold mb-6">Order Summary</h3>
          <div class="space-y-4 mb-6">
            <!-- Item 1 -->
            <div class="flex items-center gap-4">
              <div
                class="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-16 shrink-0"
                style="
                  background-image: url(&quot;https://lh3.googleusercontent.com/aida-public/AB6AXuAhJLiAtR1EEoF0fWXE3tJJaopzeT1MO-XAol2HTNo_ntIUiZPxi1y78XQu5oRp48AIHNEwo-Cei-UlGdryMoHUTGKOpgKIqzHD9caGg4wXdxsGFLcgCFPDwO2Rh9qYnBn4UzG6Y7CzrrMcXrxrIZW4S-6E718RAZiOfEYRspRsywAp-Q_ceJuhSOYvT89twi4EnGR-033QVY_uio3U1Km1raE0mbnxjyop5AurkEa0zdNUCE0nkhxHePxWz9nNlWe2IEnOg0Ta6BM&quot;);
                "
              />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-bold leading-none mb-1">
                  Caramel Macchiato
                </p>
                <p class="text-xs text-slate-500 dark:text-slate-400">
                  1x - Regular Size
                </p>
                <p class="text-sm font-medium mt-1">Rp 35.000</p>
              </div>
            </div>

            <!-- Item 2 -->
            <div class="flex items-center gap-4">
              <div
                class="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-16 shrink-0"
                style="
                  background-image: url(&quot;https://lh3.googleusercontent.com/aida-public/AB6AXuCCDxQmkB6jItkIaoiL4bYrsiL3kqUzRX57JsCfi7uIbYvwBI1W2Q0fwDWJzIV45SH5VqhsuiwUN7CQUVb2hlUL0BTAinzvvljXZdl1zudRT39oOSd1QosTkvgaeOjSgjIKho5xYUT_xuTXOPmQY8surXMER_egmTrLPmGvUBfv9KoYW1lBDoh8Bv2wkCGHDpfo2_Rno2RHhfFR2oUe1baZfTTU-SxcCRoy1kvar2SaF2DpJGw6Ozt-_pA99D_Rc8MwX9MFMBvExA4&quot;);
                "
              />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-bold leading-none mb-1">
                  Double Espresso
                </p>
                <p class="text-xs text-slate-500 dark:text-slate-400">
                  1x - Shot
                </p>
                <p class="text-sm font-medium mt-1">Rp 28.000</p>
              </div>
            </div>
          </div>

          <!-- Totals -->
          <div class="border-t border-primary/10 pt-4 space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-slate-500 dark:text-slate-400">Subtotal</span>
              <span class="font-medium">Rp 63.000</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500 dark:text-slate-400"
                >Delivery Fee</span
              >
              <span class="font-medium">Rp 10.000</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500 dark:text-slate-400"
                >Service Fee</span
              >
              <span class="font-medium">Rp 2.000</span>
            </div>
            <div
              class="flex justify-between text-lg font-bold pt-2 border-t border-dashed border-primary/20 mt-2"
            >
              <span>Total Price</span>
              <span class="text-primary">Rp 75.000</span>
            </div>
          </div>

          <button
            class="w-full mt-8 bg-primary hover:scale-[1.02] text-background-dark font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
          >
            <span>Place Order</span>
            <ArrowRight :size="18" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
