<template>
  <!-- Header Navigation -->
  <header
    class="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 shrink-0"
  >
    <div class="flex items-center gap-4">
      <span class="material-symbols-outlined text-slate-400">search</span>
      <input
        class="bg-transparent border-none focus:ring-0 text-sm w-64 placeholder:text-slate-400"
        :placeholder="props.searchPlaceholder || 'Search...'"
        type="text"
      />
    </div>
    <div class="flex items-center gap-6">
      <button
        class="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
      >
        <span class="material-symbols-outlined">notifications</span>
        <span
          class="absolute top-2 right-2 size-2 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full"
        ></span>
      </button>
      <div class="h-8 w-px bg-slate-200 dark:border-slate-800"></div>
      <div class="flex items-center gap-3">
        <div class="text-right">
          <p class="text-sm font-bold">{{ resolvedUserName }}</p>
          <p class="text-xs text-slate-500">{{ resolvedUserRole }}</p>
        </div>
        <div
          class="size-10 rounded-full bg-primary/15 text-primary border-2 border-primary/20 flex items-center justify-center"
        >
          <span class="text-sm font-black tracking-wide">{{
            userInitials
          }}</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuth } from "../composable/useAuth";

const props = defineProps<{
  searchPlaceholder?: string;
  userName?: string;
  userRole?: string;
}>();

const { user, token, userInitials, fetchMe } = useAuth();

const resolvedUserName = computed(
  () => user.value?.name || props.userName || "Admin",
);
const resolvedUserRole = computed(() => {
  if (user.value?.role === "ADMIN") {
    return "Administrator";
  }

  if (user.value?.role === "USER") {
    return "User";
  }

  return props.userRole || "Store Manager";
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
