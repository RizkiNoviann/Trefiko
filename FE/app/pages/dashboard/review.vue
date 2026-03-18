<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <Sidebar :activeMenu="activeMenu" />

    <!-- Main Content Area -->
    <main class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Navbar -->
      <NavAdmin
        searchPlaceholder="Search reviews..."
        userName="Alex Rivera"
        userRole="Store Manager"
      />

      <!-- Scrollable Content -->
      <div class="flex-1 overflow-y-auto">
        <!-- Stats Overview -->
        <div class="px-10 pt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            class="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800"
          >
            <p class="text-slate-500 text-sm font-medium mb-1">
              Total Published Reviews
            </p>
            <div class="flex items-end justify-between">
              <h3
                class="text-3xl font-black text-slate-900 dark:text-slate-100"
              >
                1,284
              </h3>
              <span
                class="text-primary text-sm font-bold flex items-center gap-1"
              >
                <TrendingUp class="w-4 h-4" />
                12.5%
              </span>
            </div>
          </div>
          <div
            class="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800"
          >
            <p class="text-slate-500 text-sm font-medium mb-1">
              Average Guest Rating
            </p>
            <div class="flex items-end justify-between">
              <h3
                class="text-3xl font-black text-slate-900 dark:text-slate-100"
              >
                4.8
              </h3>
              <div class="flex text-yellow-400">
                <Star v-for="i in 4" :key="i" class="w-5 h-5 fill-current" />
                <StarHalf class="w-5 h-5 fill-current" />
              </div>
            </div>
          </div>
        </div>

        <!-- Content Tabs -->
        <div class="px-10 mt-8">
          <div
            class="flex border-b border-slate-200 dark:border-slate-800 gap-8"
          >
            <button
              class="pb-4 px-1 border-b-2 border-primary text-primary font-bold text-sm"
            >
              All Published
            </button>
            <button
              class="pb-4 px-1 border-b-2 border-transparent text-slate-500 font-bold text-sm hover:text-slate-700"
            >
              Flagged
            </button>
          </div>
        </div>

        <!-- Reviews List -->
        <div class="px-10 py-6">
          <div class="flex flex-col gap-4">
            <div
              v-for="(review, index) in reviews"
              :key="index"
              class="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-4"
            >
              <div class="flex items-start justify-between">
                <div class="flex items-center gap-4">
                  <div
                    class="size-12 rounded-full flex items-center justify-center font-bold"
                    :class="review.avatarBgColor"
                  >
                    {{ review.initials }}
                  </div>
                  <div>
                    <h4 class="font-bold text-slate-900 dark:text-slate-100">
                      {{ review.author }}
                    </h4>
                    <p class="text-xs text-slate-400">{{ review.date }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-0.5 text-yellow-400">
                  <Star
                    v-for="i in review.rating"
                    :key="i"
                    class="w-4 h-4 fill-current"
                  />
                  <Star
                    v-for="i in 5 - review.rating"
                    :key="`empty-${i}`"
                    class="w-4 h-4 text-slate-200 dark:text-slate-700"
                  />
                </div>
              </div>
              <p
                class="text-slate-600 dark:text-slate-300 text-sm leading-relaxed"
              >
                {{ review.content }}
              </p>
              <div
                class="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800"
              >
                <button
                  class="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm font-bold"
                >
                  <Trash2 class="w-4 h-4" />
                  Delete Review
                </button>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div
            class="mt-8 flex items-center justify-between py-4 border-t border-slate-200 dark:border-slate-800"
          >
            <p class="text-sm text-slate-500">Showing 1-10 of 1,284 reviews</p>
            <div class="flex gap-2">
              <button
                class="px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Previous
              </button>
              <button
                class="px-3 py-1 bg-primary text-slate-900 border border-primary rounded-md text-sm font-bold"
              >
                1
              </button>
              <button
                class="px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                2
              </button>
              <button
                class="px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                3
              </button>
              <button
                class="px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
definePageMeta({ layout: "dashboard" });

import { Star, StarHalf, TrendingUp, Trash2 } from "lucide-vue-next";
import Sidebar from "~/components/sidebar.vue";
import NavAdmin from "~/components/navadmin.vue";

const activeMenu = "review";

const reviews = [
  {
    author: "Sarah Miller",
    initials: "SM",
    avatarBgColor: "bg-primary/10 text-primary",
    rating: 5,
    date: "Reviewed on Oct 24, 2023",
    content:
      "The atmosphere at Trefiko is unbeatable. I tried the Matcha Latte and the Avocado Toast. Both were exceptional. The staff was very attentive and the WiFi was strong enough for me to get some work done.",
  },
  {
    author: "James Davies",
    initials: "JD",
    avatarBgColor: "bg-blue-100 text-blue-600",
    rating: 4,
    date: "Reviewed on Oct 23, 2023",
    content:
      "Good coffee, but it was a bit crowded during lunch. I had to wait about 15 minutes for a table. Once seated, the service was fast.",
  },
  {
    author: "Elena Lopez",
    initials: "EL",
    avatarBgColor: "bg-purple-100 text-purple-600",
    rating: 5,
    date: "Reviewed on Oct 22, 2023",
    content:
      "Best espresso in the city! I love the modern decor and the selection of pastries. The sourdough croissant is a must-try.",
  },
];
</script>
