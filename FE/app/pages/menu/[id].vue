<script setup lang="ts">
import {
  ArrowLeft,
  Heart,
  Share2,
  Minus,
  Plus,
  ShoppingCart,
} from "lucide-vue-next";

useSeoMeta({
  title: "Detail Menu | Cafe Trefiko",
});

const quantity = ref(1);
const temperature = ref("hot");

function decreaseQty() {
  if (quantity.value > 1) quantity.value--;
}
function increaseQty() {
  quantity.value++;
}
</script>

<template>
  <div class="px-4 md:px-40 flex flex-1 justify-center py-5">
    <div class="flex flex-col max-w-[1280px] flex-1 w-full">
      <!-- Back Button -->
      <div class="mb-4">
        <NuxtLink
          to="/menu"
          class="inline-flex items-center gap-2 p-2 rounded-full hover:bg-primary/10 transition-colors text-slate-900 dark:text-slate-100"
        >
          <ArrowLeft :size="20" />
          <span class="text-sm font-semibold">Kembali ke Menu</span>
        </NuxtLink>
      </div>

      <!-- Hero Image -->
      <div
        class="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden rounded-3xl min-h-[280px] sm:min-h-[400px] shadow-2xl relative"
        style="
          background-image: url(&quot;https://lh3.googleusercontent.com/aida-public/AB6AXuA6uumGlQXu0krSk8TKIIu4g-QsfCvXfeBfzV43P4whnBEYv148-64YmaSHaWMPPdBUWYAZxT6I4B6eNEi8TMBh1ru8ssTQTfTO5_GfmNdQOOjk7qVY41QZ54QHzVmCAqAa8Zb3P-FcUUgIzDWxvVNvNVFrurU7TJApl5vVZskq0bwtRIiPESPI32rmONbueJzFauKXfq2k23TPlqr9JshPFW10QPTY5TVgL7bupxMhUWb8LyjvBL2KYq5pFfJJ3frVEFiaS-jH8mE&quot;);
        "
      />

      <!-- Product Info -->
      <div class="flex flex-wrap justify-between gap-3 p-4 mt-4">
        <div class="flex min-w-72 flex-col gap-1">
          <span
            class="inline-flex items-center px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider w-fit mb-1"
          >
            Best Seller
          </span>
          <h1
            class="text-slate-900 dark:text-slate-100 tracking-tight text-4xl sm:text-5xl font-black leading-tight"
          >
            Vanilla Oat Latte
          </h1>
          <p class="text-primary text-3xl font-bold leading-normal">$5.50</p>
        </div>
        <div class="flex items-start gap-2 pt-2">
          <button
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 hover:bg-primary/20 transition-all text-slate-900 dark:text-slate-100"
          >
            <Heart :size="20" />
          </button>
          <button
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 hover:bg-primary/20 transition-all text-slate-900 dark:text-slate-100"
          >
            <Share2 :size="20" />
          </button>
        </div>
      </div>

      <div class="px-4 py-2">
        <div class="h-px w-full bg-primary/10" />
      </div>

      <!-- Description -->
      <div class="px-4 pt-4">
        <h3
          class="text-slate-900 dark:text-slate-100 text-xl font-bold leading-tight tracking-tight mb-2"
        >
          Description
        </h3>
        <p
          class="text-slate-600 dark:text-slate-400 text-lg font-normal leading-relaxed max-w-3xl"
        >
          Experience the perfect harmony of our signature espresso and velvety
          oat milk. This Vanilla Oat Latte is delicately sweetened with
          house-made vanilla bean syrup, creating a smooth, creamy, and
          dairy-free treat that's perfect for any time of day. 100% plant-based
          and naturally delicious.
        </p>
      </div>

      <!-- Options -->
      <div class="px-4 pt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Quantity -->
        <div>
          <h3
            class="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight mb-4"
          >
            Quantity
          </h3>
          <div
            class="flex items-center gap-4 bg-primary/5 dark:bg-background-dark/50 p-2 rounded-2xl border border-primary/10 w-fit"
          >
            <button
              class="flex size-11 items-center justify-center rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm hover:bg-primary/10 transition-colors"
              @click="decreaseQty"
            >
              <Minus :size="18" />
            </button>
            <span class="text-xl font-bold px-4">{{ quantity }}</span>
            <button
              class="flex size-11 items-center justify-center rounded-xl bg-primary text-background-dark shadow-sm hover:brightness-110 transition-colors"
              @click="increaseQty"
            >
              <Plus :size="18" />
            </button>
          </div>
        </div>

        <!-- Temperature -->
        <div>
          <h3
            class="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight mb-4"
          >
            Temperature
          </h3>
          <div class="flex gap-4">
            <button
              class="flex-1 py-3 px-6 rounded-xl border-2 font-bold transition-all"
              :class="
                temperature === 'hot'
                  ? 'border-primary bg-primary/10 text-slate-900 dark:text-slate-100'
                  : 'border-primary/10 text-slate-400 hover:border-primary/40'
              "
              @click="temperature = 'hot'"
            >
              Hot
            </button>
            <button
              class="flex-1 py-3 px-6 rounded-xl border-2 font-bold transition-all"
              :class="
                temperature === 'iced'
                  ? 'border-primary bg-primary/10 text-slate-900 dark:text-slate-100'
                  : 'border-primary/10 text-slate-400 hover:border-primary/40'
              "
              @click="temperature = 'iced'"
            >
              Iced
            </button>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 p-4 mt-8 pb-12">
        <NuxtLink
          to="/chart"
          class="flex-1 flex h-16 cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-primary/10 hover:bg-primary/20 text-slate-900 dark:text-slate-100 text-lg font-bold transition-all gap-2"
        >
          <ShoppingCart :size="22" />
          Add to Cart
        </NuxtLink>
        <NuxtLink
          to="/menu/checkout/1"
          class="flex-[2] flex h-16 cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-primary text-background-dark text-lg font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
        >
          Buy Now
        </NuxtLink>
      </div>

      <!-- Related Items -->
      <div class="px-4 pb-20">
        <h3
          class="text-slate-900 dark:text-slate-100 text-2xl font-black tracking-tight mb-6"
        >
          Pairs well with
        </h3>
        <div class="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
          <div
            class="min-w-[180px] sm:min-w-[200px] bg-background-light dark:bg-background-dark/50 p-4 rounded-3xl border border-primary/10 hover:border-primary/40 transition-all group"
          >
            <div
              class="w-full aspect-square rounded-2xl bg-cover bg-center mb-4 group-hover:scale-105 transition-transform"
              style="
                background-image: url(&quot;https://lh3.googleusercontent.com/aida-public/AB6AXuCc_3S03ZaYUF0XiOlqdKGzoTz-mVSEdggG3yOwzj-ILANVnvu0lnTRv0jrFzndk_Ai26oawMJoCdta-8FIKGVPtWfU8ND7IipoG3BpzTLa4QjIxxrtrc55u-kObqa6j3t7AXXockq3Xicub0hGtxaHbDGXFKKHK27EAdJzgZ99ZOtwWSJhMbXsHc_tB4BHjSV1H_8RC4uKPUvFSiECrRUx70b-LGQVy7WkJ8lEpYtLjsmak8GyK237Nwf6ytdwnVc4MOVzmNBs1tQ&quot;);
              "
            />
            <p class="text-lg font-bold truncate">Butter Croissant</p>
            <p class="text-primary font-bold">+$3.25</p>
          </div>
          <div
            class="min-w-[180px] sm:min-w-[200px] bg-background-light dark:bg-background-dark/50 p-4 rounded-3xl border border-primary/10 hover:border-primary/40 transition-all group"
          >
            <div
              class="w-full aspect-square rounded-2xl bg-cover bg-center mb-4 group-hover:scale-105 transition-transform"
              style="
                background-image: url(&quot;https://lh3.googleusercontent.com/aida-public/AB6AXuBrHHHhajUFDW6zxNu4E9AC-m7Rj0Qc1kQjigVL6k-u-7jsJcb_wLfrh7YdWoEqY-CWodrMOGiOKzS5dFZTkNw00l49FLN4nz6BLR4izt3PCWHbEaF75oJ4y23OAR1xSe54v3Q30JwtpufvLHum35bbWimq_kj7yjR-skFHV3CnJXrvRXkdi00FvaV_mXcnYGMbEV1cnD8qt8KhntbFVwZKr5H54qwbfx1BSeyx34vS3zi0Ds3GWBDkjpSlepH6LMsTqZ2RRUi1kF4&quot;);
              "
            />
            <p class="text-lg font-bold truncate">Choco Cookie</p>
            <p class="text-primary font-bold">+$2.50</p>
          </div>
          <div
            class="min-w-[180px] sm:min-w-[200px] bg-background-light dark:bg-background-dark/50 p-4 rounded-3xl border border-primary/10 hover:border-primary/40 transition-all group"
          >
            <div
              class="w-full aspect-square rounded-2xl bg-cover bg-center mb-4 group-hover:scale-105 transition-transform"
              style="
                background-image: url(&quot;https://lh3.googleusercontent.com/aida-public/AB6AXuA-R0iO2syDmSzD3B4BTYh3VrBeWVfEBb97UD2xjF5yf30MhIWxtSxeJl37HxqqVxYK2nXjYvCazE7fe4m212K2p3YUizs9rhfKjzgkKGYUzmcIiDsF2czftmhz7P1S_-uBNwLw0HUCc8hT4v9w7aDawLi6Tc9uRmzfXDVQhkKR2F5JaP13qBPDwW95_b-1F68mOChW9d4wrWmSACKava9I_qts-VTpJKeM1OCS7NuhIrNBTDKcxTGlo-wTPy4Vq6zeGbL5VoxUuTs&quot;);
              "
            />
            <p class="text-lg font-bold truncate">Avocado Toast</p>
            <p class="text-primary font-bold">+$7.00</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
