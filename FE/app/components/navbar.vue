<script setup lang="ts">
import {
  Menu,
  X,
  User,
  ShoppingCart,
  Home,
  UtensilsCrossed,
  LogOut,
} from "lucide-vue-next";
import { useAuth } from "../composable/useAuth";

const mobileMenuOpen = ref(false);
const userDropdownOpen = ref(false);
const route = useRoute();
const { user, token, isAuthenticated, userInitials, fetchMe, logout } =
  useAuth();

const accountPath = computed(() => {
  if (!isAuthenticated.value) return "/auth/login";
  if (user.value?.role === "ADMIN") return "/dashboard/home";
  return "/";
});

function closeMobileMenu() {
  mobileMenuOpen.value = false;
}

// Anchor scroll — works on home page, navigates + scrolls on other pages
const router = useRouter();

async function scrollToSection(id: string) {
  closeMobileMenu();
  if (route.path !== "/") {
    await router.push("/");
    // Wait for page to render before scrolling
    await nextTick();
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  } else {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }
}

const handleLogout = async () => {
  logout();
  userDropdownOpen.value = false;
  await navigateTo("/");
};

const handleClickOutside = (event: MouseEvent) => {
  if (userDropdownOpen.value) {
    const dropdown = document.querySelector('[data-dropdown="account"]');
    if (dropdown && !dropdown.contains(event.target as Node)) {
      userDropdownOpen.value = false;
    }
  }
};

onMounted(async () => {
  if (token.value && !user.value) {
    try {
      await fetchMe();
    } catch {
      // Middleware handles invalid session cleanup.
    }
  }
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <header
    class="sticky top-0 z-50 w-full border-b border-primary/10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md"
  >
    <div
      class="max-w-7xl mx-auto px-6 lg:px-40 py-4 flex items-center justify-between"
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
          Beranda
        </NuxtLink>
        <NuxtLink
          to="/menu"
          class="text-sm font-semibold hover:text-primary transition-colors"
          :class="route.path.startsWith('/menu') ? 'text-primary' : ''"
        >
          Menu
        </NuxtLink>
        <button
          class="text-sm font-semibold hover:text-primary transition-colors"
          @click="scrollToSection('tentang-kami')"
        >
          Tentang
        </button>
        <button
          class="text-sm font-semibold hover:text-primary transition-colors"
          @click="scrollToSection('lokasi')"
        >
          Kontak
        </button>
        <button
          class="text-sm font-semibold hover:text-primary transition-colors"
          @click="scrollToSection('ulasan')"
        >
          Ulasan
        </button>
      </nav>

      <!-- Right Actions -->
      <div class="flex items-center gap-3 relative">
        <!-- Account Button/Dropdown -->
        <div class="relative" data-dropdown="account">
          <button
            v-if="isAuthenticated"
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 hover:bg-primary/20 transition-all text-slate-900 dark:text-slate-100"
            @click="userDropdownOpen = !userDropdownOpen"
          >
            <span class="text-sm font-black tracking-wide">
              {{ userInitials }}
            </span>
          </button>
          <NuxtLink
            v-else
            :to="accountPath"
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 hover:bg-primary/20 transition-all text-slate-900 dark:text-slate-100"
          >
            <User :size="20" />
          </NuxtLink>

          <!-- Dropdown Menu -->
          <div
            v-if="isAuthenticated && userDropdownOpen"
            class="absolute right-0 mt-2 w-48 bg-background-light dark:bg-background-dark rounded-xl border border-primary/10 shadow-lg overflow-hidden z-50"
          >
            <div class="px-4 py-3 border-b border-primary/10">
              <p
                class="text-sm font-semibold text-slate-900 dark:text-slate-100"
              >
                {{ user?.name }}
              </p>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                {{ user?.email }}
              </p>
            </div>
            <button
              @click="handleLogout"
              class="w-full px-4 py-3 flex items-center gap-3 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
            >
              <LogOut :size="18" />
              Logout
            </button>
          </div>
        </div>

        <NuxtLink
          v-if="isAuthenticated"
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
          Beranda
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
        <button
          class="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold hover:bg-primary/10 hover:text-primary transition-all w-full text-left"
          @click="scrollToSection('tentang-kami')"
        >
          <Home :size="18" />
          Tentang
        </button>
        <button
          class="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold hover:bg-primary/10 hover:text-primary transition-all w-full text-left"
          @click="scrollToSection('lokasi')"
        >
          <Home :size="18" />
          Kontak
        </button>
        <button
          class="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold hover:bg-primary/10 hover:text-primary transition-all w-full text-left"
          @click="scrollToSection('ulasan')"
        >
          <Home :size="18" />
          Ulasan
        </button>
        <NuxtLink
          v-if="isAuthenticated"
          to="/chart"
          class="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold hover:bg-primary/10 hover:text-primary transition-all"
          :class="route.path === '/chart' ? 'text-primary bg-primary/5' : ''"
          @click="closeMobileMenu"
        >
          <ShoppingCart :size="18" />
          Keranjang
        </NuxtLink>
        <button
          v-if="isAuthenticated"
          @click="handleLogout"
          class="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all w-full"
        >
          <LogOut :size="18" />
          Logout
        </button>
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
      v-if="isAuthenticated"
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
      :to="accountPath"
      class="flex flex-col items-center gap-1 transition-colors"
      :class="
        route.path.startsWith('/auth') || route.path.startsWith('/dashboard')
          ? 'text-primary'
          : 'text-slate-500 hover:text-primary'
      "
    >
      <span v-if="isAuthenticated" class="text-xs font-black tracking-wide">
        {{ userInitials }}
      </span>
      <User v-else :size="22" />
      <span class="text-[10px] font-bold">AKUN</span>
    </NuxtLink>
  </nav>
</template>
