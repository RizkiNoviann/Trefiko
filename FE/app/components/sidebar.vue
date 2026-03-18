<template>
  <aside
    class="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col"
  >
    <div class="p-6 flex items-center gap-3">
      <div
        class="size-10 rounded-full bg-primary flex items-center justify-center text-white"
      >
        <Coffee class="w-5 h-5" />
      </div>
      <div>
        <h1 class="text-lg font-bold leading-tight">Trefiko Cafe</h1>
        <p class="text-primary text-xs font-semibold uppercase tracking-wider">
          Admin Panel
        </p>
      </div>
    </div>

    <nav class="flex-1 px-4 space-y-2 mt-4">
      <a
        href="/dashboard/home"
        class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary"
        :class="{ 'bg-primary/20 text-primary': activeMenu === 'dashboard' }"
      >
        <LayoutDashboard class="w-5 h-5" />
        <span class="text-sm font-medium">Dashboard</span>
      </a>
      <a
        href="/dashboard/order"
        class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary"
        :class="{ 'bg-primary/20 text-primary': activeMenu === 'order' }"
      >
        <ShoppingBag class="w-5 h-5" />
        <span class="text-sm font-medium">Order Management</span>
      </a>
      <a
        href="/dashboard/menu"
        class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary"
        :class="{ 'bg-primary/20 text-primary': activeMenu === 'menu' }"
      >
        <UtensilsCrossed class="w-5 h-5" />
        <span class="text-sm font-medium">Menu Management</span>
      </a>
      <a
        href="/dashboard/review"
        class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary"
        :class="{ 'bg-primary/20 text-primary': activeMenu === 'review' }"
      >
        <Star class="w-5 h-5" />
        <span class="text-sm font-medium">Review Management</span>
      </a>
    </nav>

    <div class="p-4 mt-auto border-t border-slate-200 dark:border-slate-800">
      <button
        class="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:text-red-500 w-full transition-colors"
      >
        <LogOut class="w-5 h-5" />
        <span class="text-sm font-medium">Logout</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import {
  Coffee,
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Star,
  LogOut,
} from "lucide-vue-next";

defineProps({
  activeMenu: {
    type: String,
    default: "dashboard",
  },
});
</script>
