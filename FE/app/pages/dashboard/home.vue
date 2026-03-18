<script setup>
definePageMeta({ layout: "dashboard" });

import {
  Search,
  Bell,
  Settings,
  ShoppingBag,
  Star,
  Package,
  UserPlus,
  TrendingUp,
  CreditCard,
  ShoppingCart,
} from "lucide-vue-next";
import Sidebar from "~/components/sidebar.vue";
import NavAdmin from "~/components/navadmin.vue";

const activeMenu = "dashboard";

const activityItems = [
  {
    icon: ShoppingBag,
    iconColor: "text-primary",
    title: "Order #8492",
    description: "completed for 2 Caramel Macchiatos",
    time: "2 minutes ago",
  },
  {
    icon: Star,
    iconColor: "text-yellow-500",
    title: "New Review",
    description: 'received: "Best coffee in town!" (5 stars)',
    time: "14 minutes ago",
  },
  {
    icon: Package,
    iconColor: "text-blue-500",
    title: "Inventory Alert:",
    description: "Arabica beans running low.",
    time: "1 hour ago",
  },
  {
    icon: UserPlus,
    iconColor: "text-purple-500",
    title: "New Staff",
    description: "registered: Sarah Connor (Barista)",
    time: "3 hours ago",
  },
  {
    icon: ShoppingBag,
    iconColor: "text-primary",
    title: "Order #8491",
    description: "processed: 1 Avocado Toast",
    time: "4 hours ago",
  },
];

const metrics = [
  {
    label: "Total Sales",
    value: "$12,840",
    change: "+12.5%",
    icon: CreditCard,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    label: "Total Orders",
    value: "450",
    change: "+8.2%",
    icon: ShoppingCart,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
  },
  {
    label: "Average Rating",
    value: "4.8",
    change: "+0.1",
    icon: Star,
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-500",
  },
];
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <Sidebar :activeMenu="activeMenu" />

    <main class="flex-1 flex flex-col overflow-y-auto">
      <!-- Header -->
      <NavAdmin
        searchPlaceholder="Search analytics..."
        userName="Alex Rivera"
        userRole="Store Manager"
      />

      <!-- Content -->
      <div class="p-8 space-y-8">
        <!-- Summary Metrics -->
        <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="(metric, index) in metrics"
            :key="index"
            class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div class="flex justify-between items-start mb-4">
              <div
                class="p-3 rounded-xl"
                :class="[metric.iconBg, metric.iconColor]"
              >
                <component :is="metric.icon" class="w-5 h-5" />
              </div>
              <span
                class="text-emerald-500 text-sm font-bold bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg"
              >
                {{ metric.change }}
              </span>
            </div>
            <p class="text-slate-500 dark:text-slate-400 text-sm font-medium">
              {{ metric.label }}
            </p>
            <h3
              class="text-slate-900 dark:text-slate-100 text-3xl font-bold mt-1"
            >
              {{ metric.value }}
            </h3>
          </div>
        </section>

        <!-- Analytics Row -->
        <section class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Sales Chart -->
          <div
            class="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm"
          >
            <div class="flex justify-between items-center mb-8">
              <div>
                <h4
                  class="text-slate-900 dark:text-slate-100 text-lg font-bold"
                >
                  Sales Overview
                </h4>
                <p class="text-slate-500 dark:text-slate-400 text-sm">
                  Revenue performance for last 7 days
                </p>
              </div>
              <div class="flex gap-2">
                <button
                  class="px-3 py-1.5 rounded-lg text-xs font-bold bg-primary text-slate-900"
                >
                  7 Days
                </button>
                <button
                  class="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-500"
                >
                  30 Days
                </button>
              </div>
            </div>
            <div class="flex items-end gap-2 mb-4">
              <h2
                class="text-slate-900 dark:text-slate-100 text-4xl font-black"
              >
                $45,200
              </h2>
              <span
                class="text-emerald-500 text-base font-bold pb-1 flex items-center gap-1"
              >
                <TrendingUp class="w-4 h-4" /> +15.4%
              </span>
            </div>
            <div class="relative w-full h-[240px] mt-8">
              <svg
                fill="none"
                height="100%"
                preserveAspectRatio="none"
                viewBox="0 0 478 150"
                width="100%"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V149H0V109Z"
                  fill="url(#sales_gradient)"
                />
                <path
                  d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25"
                  stroke="#4ade80"
                  stroke-linecap="round"
                  stroke-width="4"
                />
                <defs>
                  <linearGradient
                    gradientUnits="userSpaceOnUse"
                    id="sales_gradient"
                    x1="236"
                    x2="236"
                    y1="1"
                    y2="149"
                  >
                    <stop stop-color="#4ade80" stop-opacity="0.3" />
                    <stop offset="1" stop-color="#4ade80" stop-opacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div
              class="flex justify-between px-2 mt-4 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider"
            >
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>

          <!-- Recent Activity -->
          <div
            class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col"
          >
            <div class="flex justify-between items-center mb-6">
              <h4 class="text-slate-900 dark:text-slate-100 text-lg font-bold">
                Recent Activity
              </h4>
              <button class="text-primary text-sm font-bold hover:underline">
                View All
              </button>
            </div>
            <div class="flex flex-col gap-6 overflow-y-auto max-h-[400px]">
              <div
                v-for="(item, index) in activityItems"
                :key="index"
                class="flex gap-4"
              >
                <div
                  class="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0"
                >
                  <component
                    :is="item.icon"
                    class="w-5 h-5"
                    :class="item.iconColor"
                  />
                </div>
                <div class="flex flex-col">
                  <p class="text-sm text-slate-900 dark:text-slate-100">
                    <span class="font-bold">{{ item.title }}</span>
                    {{ item.description }}
                  </p>
                  <span class="text-xs text-slate-500">{{ item.time }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>
