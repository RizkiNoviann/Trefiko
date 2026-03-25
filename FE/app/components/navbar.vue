<script setup lang="ts">
import { ShoppingCart, LogOut, Moon, Sun, LogIn } from "lucide-vue-next";
import { useAuth } from "../composable/useAuth";

const mobileMenuOpen = ref(false);
const userDropdownOpen = ref(false);
const route = useRoute();
const colorMode = useColorMode();
const { user, token, isAuthenticated, userInitials, fetchMe, logout } =
  useAuth();

const isDarkMode = computed(() => colorMode.value === "dark");

const toggleTheme = () => {
  colorMode.preference = isDarkMode.value ? "light" : "dark";
};

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
        Trefiko
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
        <!-- Account Button/Dropdown (when authenticated) -->
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

          <!-- Dropdown Menu (only when authenticated) -->
          <div
            v-if="isAuthenticated && userDropdownOpen"
            class="absolute right-0 mt-2 w-56 bg-background-light dark:bg-background-dark rounded-xl border border-primary/10 shadow-lg overflow-hidden z-50"
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
              @click="toggleTheme"
              class="w-full px-4 py-3 flex items-center justify-between gap-3 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-primary/10 transition-all"
            >
              <span class="inline-flex items-center gap-3">
                <component :is="isDarkMode ? Sun : Moon" :size="18" />
                {{ isDarkMode ? "Mode Terang" : "Mode Gelap" }}
              </span>
            </button>
            <button
              @click="handleLogout"
              class="w-full px-4 py-3 flex items-center gap-3 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
            >
              <LogOut :size="18" />
              Keluar
            </button>
          </div>
        </div>

        <!-- Login Button (when not authenticated) -->
        <template v-if="!isAuthenticated">
          <NuxtLink
            :to="accountPath"
            class="flex h-10 px-4 items-center gap-2 rounded-xl bg-primary text-background-dark hover:shadow-lg hover:shadow-primary/20 transition-all font-semibold text-sm"
          >
            <LogIn :size="18" />
            Masuk
          </NuxtLink>
        </template>

        <NuxtLink
          v-if="isAuthenticated"
          to="/chart"
          class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-background-dark shadow-lg shadow-primary/20 hover:scale-105 transition-all"
        >
          <ShoppingCart :size="20" />
        </NuxtLink>

        <!-- Mobile Hamburger -->
        <button
          class="md:hidden flex items-center justify-center h-10 rounded-xl px-3 hover:bg-primary/10 transition-all"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <span class="text-xs font-bold">{{
            mobileMenuOpen ? "Tutup" : "Menu"
          }}</span>
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
          class="px-3 py-3 rounded-lg text-sm font-semibold hover:bg-primary/10 hover:text-primary transition-all"
          :class="route.path === '/' ? 'text-primary bg-primary/5' : ''"
          @click="closeMobileMenu"
        >
          Beranda
        </NuxtLink>
        <NuxtLink
          to="/menu"
          class="px-3 py-3 rounded-lg text-sm font-semibold hover:bg-primary/10 hover:text-primary transition-all"
          :class="
            route.path.startsWith('/menu') ? 'text-primary bg-primary/5' : ''
          "
          @click="closeMobileMenu"
        >
          Menu
        </NuxtLink>
        <button
          class="w-full px-3 py-3 rounded-lg text-sm font-semibold hover:bg-primary/10 hover:text-primary transition-all text-left"
          @click="scrollToSection('tentang-kami')"
        >
          Tentang
        </button>
        <button
          class="w-full px-3 py-3 rounded-lg text-sm font-semibold hover:bg-primary/10 hover:text-primary transition-all text-left"
          @click="scrollToSection('lokasi')"
        >
          Kontak
        </button>
        <button
          class="w-full px-3 py-3 rounded-lg text-sm font-semibold hover:bg-primary/10 hover:text-primary transition-all text-left"
          @click="scrollToSection('ulasan')"
        >
          Ulasan
        </button>
        <NuxtLink
          v-if="isAuthenticated"
          to="/chart"
          class="px-3 py-3 rounded-lg text-sm font-semibold hover:bg-primary/10 hover:text-primary transition-all"
          :class="route.path === '/chart' ? 'text-primary bg-primary/5' : ''"
          @click="closeMobileMenu"
        >
          Keranjang
        </NuxtLink>
        <button
          v-if="isAuthenticated"
          @click="handleLogout"
          class="w-full px-3 py-3 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all text-left"
        >
          Keluar
        </button>
      </nav>
    </div>
  </header>
</template>
