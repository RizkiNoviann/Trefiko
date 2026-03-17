<script setup lang="ts">
import {
  Menu,
  X,
  User,
  ShoppingCart,
  Home,
  UtensilsCrossed,
} from "lucide-vue-next";

const mobileMenuOpen = ref(false);
const route = useRoute();

function closeMobileMenu() {
  mobileMenuOpen.value = false;
}
</script>

<template>
  <header
    class="sticky top-0 z-50 w-full border-b border-primary/10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md"
  >
    <div
      class="max-w-[1280px] mx-auto px-6 lg:px-40 py-4 flex items-center justify-between"
    >
      <!-- Logo -->
      <NuxtLink
        to="/"
        class="text-xl font-extrabold tracking-tight hover:text-primary transition-colors"
      >
        Cafe Trefiko
      </NuxtLink>

      <!-- Desktop Nav -->
      <nav class="hidden md:flex items-center gap-10">
        <NuxtLink
          to="/"
          class="text-sm font-semibold hover:text-primary transition-colors"
          :class="route.path === '/' ? 'text-primary' : ''"
        >
          Home
        </NuxtLink>
        <NuxtLink
          to="/menu"
          class="text-sm font-semibold hover:text-primary transition-colors"
          :class="route.path.startsWith('/menu') ? 'text-primary' : ''"
        >
          Menu
        </NuxtLink>
        <NuxtLink
          to="/chart"
          class="text-sm font-semibold hover:text-primary transition-colors"
          :class="route.path === '/chart' ? 'text-primary' : ''"
        >
          Kontak
        </NuxtLink>
      </nav>

      <!-- Right Actions -->
      <div class="flex items-center gap-3">
        <NuxtLink
          to="/auth/login"
          class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 hover:bg-primary/20 transition-all text-slate-900 dark:text-slate-100"
        >
          <User :size="20" />
        </NuxtLink>
        <NuxtLink
          to="/chart"
          class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-background-dark shadow-lg shadow-primary/20 hover:scale-105 transition-all"
        >
          <ShoppingCart :size="20" />
        </NuxtLink>

        <!-- Mobile Hamburger -->
        <button
          class="md:hidden flex items-center justify-center h-10 w-10 rounded-xl hover:bg-primary/10 transition-all"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <X v-if="mobileMenuOpen" :size="20" />
          <Menu v-else :size="20" />
        </button>
      </div>
    </div>

    <!-- Mobile Dropdown Menu -->
    <div
      v-if="mobileMenuOpen"
      class="md:hidden border-t border-primary/10 bg-background-light dark:bg-background-dark"
    >
      <nav class="flex flex-col px-6 py-4 gap-1">
        <NuxtLink
          to="/"
          class="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold hover:bg-primary/10 hover:text-primary transition-all"
          :class="route.path === '/' ? 'text-primary bg-primary/5' : ''"
          @click="closeMobileMenu"
        >
          <Home :size="18" />
          Home
        </NuxtLink>
        <NuxtLink
          to="/menu"
          class="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold hover:bg-primary/10 hover:text-primary transition-all"
          :class="
            route.path.startsWith('/menu') ? 'text-primary bg-primary/5' : ''
          "
          @click="closeMobileMenu"
        >
          <UtensilsCrossed :size="18" />
          Menu
        </NuxtLink>
        <NuxtLink
          to="/chart"
          class="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold hover:bg-primary/10 hover:text-primary transition-all"
          :class="route.path === '/chart' ? 'text-primary bg-primary/5' : ''"
          @click="closeMobileMenu"
        >
          <ShoppingCart :size="18" />
          Keranjang
        </NuxtLink>
      </nav>
    </div>
  </header>

  <!-- Mobile Bottom Tab Bar -->
  <nav
    class="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md border-t border-primary/10 flex justify-around py-3 px-2"
  >
    <NuxtLink
      to="/"
      class="flex flex-col items-center gap-1 transition-colors"
      :class="
        route.path === '/'
          ? 'text-primary'
          : 'text-slate-500 hover:text-primary'
      "
    >
      <Home :size="22" />
      <span class="text-[10px] font-bold">HOME</span>
    </NuxtLink>
    <NuxtLink
      to="/menu"
      class="flex flex-col items-center gap-1 transition-colors"
      :class="
        route.path.startsWith('/menu')
          ? 'text-primary'
          : 'text-slate-500 hover:text-primary'
      "
    >
      <UtensilsCrossed :size="22" />
      <span class="text-[10px] font-bold">MENU</span>
    </NuxtLink>
    <NuxtLink
      to="/chart"
      class="flex flex-col items-center gap-1 transition-colors"
      :class="
        route.path === '/chart'
          ? 'text-primary'
          : 'text-slate-500 hover:text-primary'
      "
    >
      <ShoppingCart :size="22" />
      <span class="text-[10px] font-bold">CART</span>
    </NuxtLink>
    <NuxtLink
      to="/auth/login"
      class="flex flex-col items-center gap-1 transition-colors"
      :class="
        route.path.startsWith('/auth')
          ? 'text-primary'
          : 'text-slate-500 hover:text-primary'
      "
    >
      <User :size="22" />
      <span class="text-[10px] font-bold">AKUN</span>
    </NuxtLink>
  </nav>
</template>
