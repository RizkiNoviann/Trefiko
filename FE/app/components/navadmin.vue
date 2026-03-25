<template>
  <!-- Header Navigation -->
  <header
    class="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-end px-8 shrink-0"
  >
    <div class="flex items-center gap-3">
      <button
        type="button"
        class="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-600 transition hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-300"
        @click="toggleTheme"
      >
        <component :is="isDarkMode ? Sun : Moon" :size="16" />
        {{ isDarkMode ? "Terang" : "Gelap" }}
      </button>

      <div class="text-right">
        <p class="text-sm font-bold">{{ resolvedUserName }}</p>
        <p class="text-xs text-slate-500">{{ resolvedUserRole }}</p>
      </div>
      <div
        class="size-10 rounded-full bg-primary/15 text-primary border-2 border-primary/20 flex items-center justify-center"
      >
        <span class="text-sm font-black tracking-wide">{{ userInitials }}</span>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Moon, Sun } from "lucide-vue-next";
import { useAuth } from "../composable/useAuth";

const props = defineProps<{
  searchPlaceholder?: string;
  userName?: string;
  userRole?: string;
}>();

const { user, token, userInitials, fetchMe } = useAuth();
const colorMode = useColorMode();

const isDarkMode = computed(() => colorMode.value === "dark");

const toggleTheme = () => {
  colorMode.preference = isDarkMode.value ? "light" : "dark";
};

const resolvedUserName = computed(
  () => user.value?.name || props.userName || "Admin",
);
const resolvedUserRole = computed(() => {
  if (user.value?.role === "ADMIN") {
    return "Admin";
  }

  if (user.value?.role === "USER") {
    return "Pengguna";
  }

  return props.userRole || "Pengelola Toko";
});

onMounted(async () => {
  if (token.value && !user.value) {
    try {
      await fetchMe();
    } catch {
      // Route middleware handles invalid auth redirect.
    }
  }
});
</script>

<style scoped>
/* Navigation styles can be added here if needed */
</style>
