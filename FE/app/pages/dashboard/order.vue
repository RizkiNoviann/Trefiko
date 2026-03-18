<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <Sidebar :activeMenu="activeMenu" />

    <!-- Main Content Area -->
    <main class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Navbar -->
      <NavAdmin
        searchPlaceholder="Search orders, customers..."
        userName="Alex Rivera"
        userRole="Store Manager"
      />

      <!-- Dashboard Body -->
      <div class="flex-1 overflow-y-auto p-8">
        <div class="flex flex-col lg:flex-row gap-8">
          <!-- Left Column: Calendar -->
          <div class="w-full lg:w-96 shrink-0">
            <div
              class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6"
            >
              <div class="flex items-center justify-between mb-6">
                <h3 class="font-bold text-lg">Calendar</h3>
                <div class="flex gap-1">
                  <button
                    class="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                  >
                    <ChevronLeft class="w-5 h-5" />
                  </button>
                  <button
                    class="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                  >
                    <ChevronRight class="w-5 h-5" />
                  </button>
                </div>
              </div>
              <p class="text-sm font-semibold text-slate-500 mb-4 px-2">
                October 2023
              </p>
              <div class="grid grid-cols-7 text-center mb-2">
                <span class="text-[10px] font-bold text-slate-400 uppercase"
                  >Su</span
                >
                <span class="text-[10px] font-bold text-slate-400 uppercase"
                  >Mo</span
                >
                <span class="text-[10px] font-bold text-slate-400 uppercase"
                  >Tu</span
                >
                <span class="text-[10px] font-bold text-slate-400 uppercase"
                  >We</span
                >
                <span class="text-[10px] font-bold text-slate-400 uppercase"
                  >Th</span
                >
                <span class="text-[10px] font-bold text-slate-400 uppercase"
                  >Fr</span
                >
                <span class="text-[10px] font-bold text-slate-400 uppercase"
                  >Sa</span
                >
              </div>
              <div class="grid grid-cols-7 gap-y-2">
                <div class="h-10"></div>
                <div class="h-10"></div>
                <div class="h-10"></div>
                <button
                  v-for="day in 31"
                  :key="day"
                  class="h-10 w-full flex items-center justify-center text-sm rounded-lg hover:bg-primary/10 relative"
                  :class="{
                    'bg-primary text-white font-bold shadow-md shadow-primary/30':
                      day === 5,
                  }"
                >
                  {{ day }}
                  <span
                    v-if="[18, 24].includes(day)"
                    class="absolute bottom-1 left-1/2 -translate-x-1/2 size-1 bg-primary rounded-full"
                  ></span>
                </button>
              </div>
            </div>
            <div
              class="mt-8 bg-primary/10 rounded-xl p-6 border border-primary/20"
            >
              <div class="flex items-center gap-3 text-primary mb-2">
                <Info class="w-5 h-5" />
                <h4 class="font-bold text-sm">Quick Stats</h4>
              </div>
              <p class="text-xs text-slate-600 dark:text-slate-400">
                You have 12 pending orders for today. Most items are from the
                "Breakfast" category.
              </p>
            </div>
          </div>

          <!-- Right Column: Orders List -->
          <div class="flex-1">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h2 class="text-2xl font-bold tracking-tight">
                  Orders for Oct 5, 2023
                </h2>
                <p class="text-slate-500 text-sm">
                  Manage incoming and active orders
                </p>
              </div>
              <div class="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                <button
                  class="px-4 py-2 text-xs font-bold rounded-md bg-white dark:bg-slate-700 shadow-sm"
                >
                  Today
                </button>
                <button
                  class="px-4 py-2 text-xs font-bold text-slate-500 rounded-md hover:text-slate-700"
                >
                  All
                </button>
              </div>
            </div>
            <div
              class="flex gap-4 mb-6 border-b border-slate-200 dark:border-slate-800"
            >
              <button
                class="pb-4 px-2 border-b-2 border-primary text-primary text-sm font-bold"
              >
                Pending (12)
              </button>
              <button
                class="pb-4 px-2 border-b-2 border-transparent text-slate-500 hover:text-slate-800 text-sm font-bold transition-colors"
              >
                In Progress (4)
              </button>
              <button
                class="pb-4 px-2 border-b-2 border-transparent text-slate-500 hover:text-slate-800 text-sm font-bold transition-colors"
              >
                Completed (48)
              </button>
            </div>

            <!-- Order Cards List -->
            <div class="space-y-4">
              <div
                v-for="(order, index) in orders"
                :key="index"
                class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-primary/50 transition-colors"
                :class="{
                  'opacity-80': order.status === 'in-progress',
                  'opacity-60': order.status === 'completed',
                }"
              >
                <div
                  class="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div class="flex gap-4">
                    <div
                      class="size-12 rounded-xl flex items-center justify-center shrink-0"
                      :class="order.bgColor"
                    >
                      <component :is="order.icon" class="w-5 h-5" />
                    </div>
                    <div>
                      <div class="flex items-center gap-2 mb-1">
                        <span class="text-xs font-bold text-slate-400">{{
                          order.id
                        }}</span>
                        <span
                          class="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full"
                          :class="order.statusClass"
                        >
                          {{ order.statusLabel }}
                        </span>
                      </div>
                      <h4 class="font-bold text-base">{{ order.customer }}</h4>
                      <p class="text-sm text-slate-500">{{ order.items }}</p>
                    </div>
                  </div>
                  <div
                    class="flex items-center gap-6 justify-between md:justify-end"
                  >
                    <div class="text-right">
                      <p class="text-xs text-slate-400 uppercase font-bold">
                        Total Price
                      </p>
                      <p class="text-lg font-bold">{{ order.price }}</p>
                    </div>
                    <div class="flex gap-2">
                      <button
                        v-if="order.status === 'pending'"
                        class="px-4 py-2 bg-primary text-slate-900 text-sm font-bold rounded-lg hover:brightness-105 transition-all"
                      >
                        Accept
                      </button>
                      <button
                        v-else-if="order.status === 'in-progress'"
                        class="px-4 py-2 bg-primary/20 text-primary text-sm font-bold rounded-lg hover:bg-primary hover:text-white transition-all"
                      >
                        Mark as Done
                      </button>
                      <span
                        v-else
                        class="text-xs font-bold text-slate-400 flex items-center gap-1"
                      >
                        <History class="w-4 h-4" />
                        Delivered
                      </span>
                      <button
                        v-if="order.status !== 'completed'"
                        class="p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 class="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import {
  ChevronLeft,
  ChevronRight,
  Info,
  History,
  Trash2,
  Clock,
  CheckCircle,
  ClipboardList,
} from "lucide-vue-next";
import Sidebar from "~/components/sidebar.vue";
import NavAdmin from "~/components/navadmin.vue";

const activeMenu = "order";

const orders = [
  {
    id: "#ORD-7742",
    customer: "Sarah Johnson",
    items: "2x Avocado Toast, 1x Iced Latte",
    price: "$34.50",
    status: "pending",
    statusLabel: "Pending",
    icon: ClipboardList,
    bgColor:
      "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
    statusClass:
      "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
  },
  {
    id: "#ORD-7741",
    customer: "Michael Chen",
    items: "1x Breakfast Burrito, 1x Espresso",
    price: "$18.20",
    status: "in-progress",
    statusLabel: "In Progress",
    icon: Clock,
    bgColor: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    statusClass:
      "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  },
  {
    id: "#ORD-7740",
    customer: "Elena Rodriguez",
    items: "3x Chocolate Croissant, 1x Earl Grey",
    price: "$22.75",
    status: "pending",
    statusLabel: "Pending",
    icon: ClipboardList,
    bgColor:
      "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
    statusClass:
      "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
  },
  {
    id: "#ORD-7739",
    customer: "David Wilson",
    items: "1x Cold Brew, 1x Blueberry Muffin",
    price: "$12.40",
    status: "completed",
    statusLabel: "Completed",
    icon: CheckCircle,
    bgColor:
      "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    statusClass:
      "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
  },
];
</script>
